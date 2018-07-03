# Youtube

[![Build Status](https://travis-ci.org/tnovas/youtube.svg?branch=master)](https://travis-ci.org/tnovas/youtube)
[![Coverage Status](https://coveralls.io/repos/github/tnovas/youtube/badge.svg)](https://coveralls.io/github/tnovas/youtube)

#### This module is a implementation of Youtube Data API V3 https://developers.google.com/youtube/v3/getting-started

You need nodejs version > 7.6 because this module was made with ES6 and use Async - Await.
```
node --version
```

## Installation:
Add the latest version of `youtube-streamer` to your package.json:
```
npm install youtube-streamer --save
```

## Usage:
```js
let youtubeApi = require('youtube-streamer');
```

Give the credentials of the youtube to the constructor

| Params       | Description     | Optional | 
| --------     |:---------------| :-----:|
| **clientId**     | *The Client Id was provided by Youtube OAuth 2.0 Client* | **false** |
| **clientSecret** | *The Client Secret was provided by Youtube OAuth 2.0 Client* | **false** |
| **redirectUrl**  | *TThe Redirect URL that you configured in the Youtube OAuth 2.0 Client with format 'http://youUrl/'* | **false** |
| **key**  | *The key was provided by Youtube Api keys*  | **false** |
| **scopes**       | *They are 3 scopes: https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtube.force-ssl* | **false** |
| **accessToken**  | *Access token* | **true** |
| **liveId**  | *Live Id* | **true** |
| **channelId**  | *Channel Id* | **true** |

```js
let params = {
	clientId: 'clientId',
	clientSecret: 'clientSecret',
	redirectUrl: 'http://yourdomain/youraction',
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

## Integration Test:
You can test the module with your productive credentials. 
First change the `clientId` and `clientSecret` in `tests/integration.js` with yours credentials, open a console and run `npm start`, open browser and type `http://localhost:8080/`

### Urls:
- `http://localhost:8080/` return the url of [authorization](#authorization), copy and paste into the url of the browser
- `http://localhost:8080/getChannel` return information of your [channel](#get-channel)
- `http://localhost:8080/credentials` [get credentials](#get-credentials)
- `http://localhost:8080/reconnect` [refresh access token](#refresh-access-token)
- `http://localhost:8080/getViewers` [get viewers](#get-viewers)

