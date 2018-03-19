# Youtube

[![Build Status](https://travis-ci.org/tnovas/youtube.svg?branch=master)](https://travis-ci.org/tnovas/youtube)
[![Coverage Status](https://coveralls.io/repos/github/tnovas/youtube/badge.svg)](https://coveralls.io/github/tnovas/youtube)

#### This module is a implementation of Youtube Data API V3 https://developers.google.com/youtube/v3/guides

You need nodejs version > 6x because this module was made with ES6.
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
| **ClientId**     | *The Client Id* | **false** |
| **ClientSecret** | *The Client Secret* | **false** |
| **RedirectUrl**  | *The RedirectUrl with format 'http://yourdomain/youraction'* | **false** |
| **Key**  | *The api key*  | **false** |
| **Scopes**       | *They are 3 scopes: https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtube.force-ssl* | **false** |
| **AccessToken**  | *The access token if you have one* | **true** |
| **ChatId**  | *The chat id if you have one* | **true** |
| **LiveId**  | *The live id if you have one* | **true** |

```js
let youtube = new youtubeApi('clientId', 'clientSecret', 'http://yourdomain/youraction', 'https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtube.force-ssl');
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
youtube.getChannel();
```

### Get Live Broadcast:
For get chatId and liveId you have to call `liveBroadcast`

```js
youtube.liveBroadcast();
```

### Get Live Stream:
For get your live stream information you have to call `liveStream`

```js
youtube.liveStream();
```

### Get Viewers:
For get live viewers you have to call `getViewers`

```js
youtube.getViewers();
```

### Get Live Chat:
For get live chat message you have to call `liveChat`

```js
youtube.liveChat();
```

### Get Credentials:
If you need to save credentials, you have to call `getCredentials` and you will get an object

```js
{
  accessToken,
  refreshToken,
  expiresIn,
  chatId,
  liveId
}
```

### Promises
If you add `then` to call you will take the success of response and if you add `catch` you will take the error of response.
```js
youtube.getChannel()
	.then((res) => console.log(res)))
	.catch((err) => console.log(err)))
```

## Test Integration:
You can test the module with your productive credentials. 
First change the `clientId` and `clientSecret` in `tests/integration.js` with yours credentials, open a console and run `npm start`, open browser and type `http://localhost:8080/`

### Urls:
- `http://localhost:8080/` return the url of [authorization](#authorization), copy and paste into the url of the browser
- `http://localhost:8080/getChannel` return information of your [channel](#get-channel)
- `http://localhost:8080/credentials` [get credentials](#get-credentials)
- `http://localhost:8080/reconnect` [refresh access token](#refresh-access-token)
- `http://localhost:8080/getViewers` [get viewers](#get-viewers)

