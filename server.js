// Load in dotenv to use .env file storing your env variables
require('dotenv').config()

// Load in some dependencies 
const Mixer = require('@mixer/client-node');
const ws = require('ws');

// Instantiate a new Mixer Client
const client = new Mixer.Client(new Mixer.DefaultRequestRunner()); 

// Store your token for the account you wish to use as a bot
const myToken = process.env.token; 

// Store the ID of the channel who's chat you wish to connect
const myChannelId = Number(process.env.ganjaId); 

// Store the name of the channel who's chat you wish to connect 
const myChannelName = process.env.channelName;

/* With OAuth we don't need to log in. The OAuth Provider will attach
 * the required information to all of our requests after this call.
 * They'll also be authenticated with the user information of the user
 * who owns the token provided.
 */
client.use(
  new Mixer.OAuthProvider(client, {
    tokens: {
      access: myToken,
      // Tokens retrieved via this page last for 1 year.
      expires: Date.now() + 365 * 24 * 60 * 60 * 1000
    }
  })
);

/* Gets our Currently Authenticated Mixer user's information. This returns an object
 * full of useful information about the user whose OAuth Token we provided above.
 */
function getUserInfo() {
  // Users Current will return information about the user who owns the OAuth
  // token registered above.
  return client.request('GET', 'users/current').then(response => response.body);
}

// /**
//  * Gets connection information from Mixer's chat servers
//  * @param {Number} channelId The channelId of the channel you'd like to
//  *  get connection information for.
//  * @returns {Promise.<>}
//  */
function getConnectionInformation(channelId) {
  return new Mixer.ChatService(client)
    .join(channelId)
    .then(response => response.body);
}

// /**
//  * Creates a Mixer chat socket and authenticates
//  * @param {number} userId The user to authenticate as
//  * @param {number} channelId The channel id of the channel you want to join
//  * @returns {Promise.<>}
//  */
async function joinChat(userId, channelId) {
  const joinInformation = await getConnectionInformation(channelId);
  // Chat connection
  const socket = new Mixer.Socket(ws, joinInformation.endpoints).boot();

  return socket
    .auth(channelId, userId, joinInformation.authkey)
    .then(() => socket)
    .catch(error => console.log(error));
}

// Get our Bot's User Information, Who are they?
getUserInfo().then(async userInfo => {
  /* Join our target Chat Channel, in this case we'll join
   * our Bot's channel.
   * But you can replace the second argument of this function with ANY Channel ID.
   */
  const socket = await joinChat(userInfo.id, myChannelId).catch(error =>
    console.log(error)
  );
  let myAdmin = ['Owner', 'Mod'];
  let lurkers = []; 
  let viewers = [];

  // Send a message once connected to chat.
  socket.call('msg', [`GanjaBot online...`]);

  // Notify when a user has joined.
  socket.on('UserJoin', data => {
    if (data.user_name) { 
      if (!viewers.includes(data.user_name)) {
        viewers.push(data.user_name)
      }
      socket.call('whisper', [
        `${myChannelName}`,
        `${data.user_name} has appeared in your channel.`
      ]);
    }
  });

  // Notify when a user has left.
  socket.on('UserLeave', data => {
    socket.call('whisper', [
      `${myChannelName}`,
      `${data.user_name} has left the channel.`
    ]);
  });

  socket.on('ChatMessage', data => {
    // PingPong Test
    if (data.message.message[0].data === '!ping') {
      console.log('dataLog: ', data);
      socket.call('whisper', [`${data.user_name}`, `PONG!`]);
    }

    // !focus -adminOnly
    if (
      data.message.message[0].data === '!focus' &&
      myAdmin.some(role => data.user_roles.includes(role))
    ) {
      socket.call('msg', [
        `Sorry if I don't check the chat log in time! I'm usually playing a game that requires more focus!`
      ]);
    }

    // !so -adminOnly
    if (
      data.message.message[0].data === '!so' &&
      myAdmin.some(role => data.user_roles.includes(role))
    ) {
      const targetUser = `${data.message.message[1].text}`;
      socket.call('msg', [`Please go give ${targetUser} a follow!`]);
    }

    // !reveal -adminOnly
    if (
      data.message.message[0].data === '!reveal' &&
      myAdmin.some(role => data.user_roles.includes(role))
    ) {
      socket.call('whisper', [`${data.user_name}`, `lurkers: ${lurkers}`]);
    } 

    // !vlog -adminOnly 
    if (
      data.message.message[0].data === '!vlog' &&
      myAdmin.some(role => data.user_roles.includes(role))
    ) {
      socket.call('whisper', [`${data.user_name}`, `viewers: ${viewers}`]);
    } 

    // !lurk
    if (data.message.message[0].data === '!lurk') {
      if (!lurkers.includes(data.user_name)) {
        lurkers.push(data.user_name);
        socket.call('whisper', [`${data.user_name}`, `lurk_mode: enabled`]);
      } else {
        lurkers = lurkers.filter(user => user !== data.user_name);
        socket.call('whisper', [`${data.user_name}`, `lurk_mode: disabled`]);
      }
    }

    // Handle Sparks
    if (data.message.meta.is_skill) {
      // Skills that cost over 50,000 sparks
      if (data.message.meta.skill.cost > 50000) {
        socket.call('msg', [
          `@${data.user_name}!! Thank you for all of those juicy ${data.message.meta.skill.currency}!`
        ]);
      }
      // Skills that cost over 20,000 sparks
      if (data.message.meta.skill.cost > 20000) {
        socket.call('msg', [
          `@${data.user_name}! Thank you for the ${data.message.meta.skill.currency}! `
        ]);
      }
    }
  });

  // Handle errors
  socket.on('error', error => {
    console.error('Socket error');
    console.error(error);
  });
});
