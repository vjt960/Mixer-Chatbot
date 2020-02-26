# Mixer-Chatbot 

## Chatbot for Mixer in Node.js 

### Setup Instructions:

 1. Clone down this repo. 
 
 2. In your terminal, inside your Mixer-Chatbot directory, run `npm install`. 
 
 3. Create a `.env` file inside of your Mixer-Chatbot directory. 
 
 4. Inside your `.env` file, create the variables: `token`, `channel_id`, and `channelName` and then assign them the appropriate values like so:

> 

    token=<insert your Mixer authentication token here>
    channel_id=<insert the channel id of the target channel here>
    channelName=<insert the channel name of the target channel here>

> Note: Do **NOT** write your token, channel_id, or channelName in quotes like `token="blAhBlaHblAhExaMpLeTokEn"`. Just write/paste it as is without quotations like `token=blAhBlaHblAhExaMpLeTokEn`.
#
### Mixer Resources: 

 - ***Mixer Auth Token***: *You will need an Authentication Token from Mixer in order to access Mixer chat. You can either use your own token or even create a separate Mixer account to use as your bot. You can get your token from [HERE](https://dev.mixer.com/guides/chat/chatbot) and click on the code as shown below.* 
 
 ![](https://github.com/vjt960/Mixer-Chatbot/blob/master/_assets/authToken.png?raw=true)
 <p align="center"><img src="https://github.com/vjt960/Mixer-Chatbot/blob/master/_assets/authToken.png?raw=true" alt="Snippet of where to find your Mixer Auth-Token" width="800"/></p>
 
<p>&nbsp;  </p>
<p>&nbsp;  </p>

 - ***Channel ID***: *You will need the channel ID for the channel you wish to join. You can find your channel ID by going to* `https://mixer.com/api/v1/channels/<username>?fields=id` *, simply replace* `<username>` *with the name of the mixer channel you wish to join, and you will find the id as shown in the example below.* 
 
<p align="center"><img src="https://github.com/vjt960/Mixer-Chatbot/blob/master/_assets/mixerID.png?raw=true" alt="Ninja's Mixer id" width="400"/></p>
 
<p>&nbsp;  </p>
<p>&nbsp;  </p>

 - ***Channel Name***: *Quite simply, the name of the Mixer channel. In this context, it will be the name of the channel you wish to chat with.*
