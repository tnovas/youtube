# Youtube

[![Build Status](https://travis-ci.org/tnovas/youtube.svg?branch=v2-0-0-beta)](https://travis-ci.org/tnovas/youtube?branch=v2-0-0-beta)
[![Coverage Status](https://coveralls.io/repos/github/tnovas/youtube/badge.svg)](https://coveralls.io/github/tnovas/youtube?branch=v2-0-0-beta)

#### This module is a implementation of Youtube Data API V3 https://developers.google.com/youtube/v3/getting-started

You need nodejs version > 7.6 because this module was made with ES6 and use Async - Await.
```
node --version
```

## Installation:
Add the latest version of `youtube-streamer` to your package.json:
```
npm install -s youtube-streamer@beta
```

## Usage:
```js
let youtubeApi = require('youtube-streamer');
```

Give the credentials of the youtube to the constructor

| Params       | Description     | Optional | 
| --------     |:---------------| :-----:|
| **clientId**     | *The Client Id was provided by [Youtube OAuth 2.0 Client](https://console.developers.google.com/apis/credentials)* | **false** |
| **clientSecret** | *The Client Secret was provided by [Youtube OAuth 2.0 Client](https://console.developers.google.com/apis/credentials)* | **false** |
| **redirectUrl**  | *The Redirect URL that you configured in the Youtube OAuth 2.0 Client with format 'http://redirectURL'* | **false** |
| **key**  | *The key was provided by [Youtube Api Key](https://console.developers.google.com/apis/credentials)*  | **false** |
| **scopes**       | *They are 3 scopes: https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtube.force-ssl* | **false** |
| **accessToken**  | *Access token* | **true** |
| **liveId**  | *Live Id* | **true** |
| **channelId**  | *Channel Id* | **true** |

```js
let params = {
	clientId: 'clientId',
	clientSecret: 'clientSecret',
	redirectUrl: 'http://redirectURL',
	key: 'key',
	scopes: 'https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtube.force-ssl'
};

let youtube = new youtubeApi(params);
```

### Authorization
To authenticate with OAuth you will call `authorizationUrl` and will return an URL, you will make a request with a browser and authorizate in OAuth. After that you will be redirect to `RedirectUrl` and you will get a `code` on QueryString `?code='hjqweassxzass'`

```js
let urlAuthorization = youtube.authorizationUrl();
```

### Get Access Token
For generate an access token and refresh token you have to call `connect` with the `code` you got on QueryString

| Params   | Description     | Optional | 
| -------- |:---------------| :-----:|
| **Code**  | *The code you got in the querystring* | **false** |

```js
youtube.connect(code);
```

### Refresh Access Token
If you need refresh the access token, you have to call `reconnect` and send the `refreshToken`

| Params   | Description     | Optional | 
| -------- |:---------------| :-----:|
| **RefreshToken**  | *The refresh token you got in credentials* | **false** |

```js
youtube.reconnect(refreshToken);
```

### Get Channel:
For get your channel information you have to call `getChannel`

```js
let channel = await youtube.getChannel();
```

### Search Channel:
For get any channel or if you need a liveId you have to call `searchChannel`

```js
let channel = await youtube.searchChannel();
```

### Get Viewers:
For get live viewers you have to call `getViewers`

```js
let viewers = await youtube.getViewers();
```

### Get Live Chat:
For get live chat message you have to call `liveChat`

```js
let chats = await youtube.liveChat();
```

### Get Credentials:
All credentials you need in this api saved automatically, if you need any of these credentials call `getCredentials` and you will get an object

```js
let credentials = youtube.getCredentials();
```

```js
Response:
{
  accessToken,
  refreshToken,
  expiresIn,
  liveId,
  channelId
}
```

### Async Await
If you add `await` to a call, the thread waits for the response. Remember the method that makes the `await method ()` call must have the `async` declared
```js
async myMethod() {
	let channel = await youtube.getChannel();

	return channel;	
}
```