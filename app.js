let axios = require('axios');
let OAuth2 = require('oauth20');
let getYoutube = Symbol('getYoutube');
let credentialsYoutube = Symbol('credentialsYoutube');
let urlsYoutube = Symbol('urlsYoutube');

class Youtube extends OAuth2 {
	constructor(clientId, clientSecret, redirectUrl, key, scopes, accessToken='', chatId='', liveId='') {
		super(clientId, clientSecret, redirectUrl, scopes, accessToken, 'https://accounts.google.com/o/oauth2/', 'auth');

		this[credentialsYoutube] = {
			key: key,
			chatId: chatId,
			liveId: liveId
		};
		
		this[urlsYoutube] = {
			channels: 'channels',
			chats: 'liveChat/messages',
			broadcasts: 'liveBroadcasts',
			videos: 'videos'
		};

		this.axiosYoutube = axios.create({
		  baseURL: 'https://www.googleapis.com/youtube/v3/'
		});
	}

	getCredentials() {
		var credentials = super.getCredentials();
		credentials.chatId = this[credentialsYoutube].chatId;
		credentials.liveId = this[credentialsYoutube].liveId;

		return credentials;
	}

	getChannel() {
		let url = `${this[urlsYoutube].channels}`;
		let params = {
			part: 'snippet,contentDetails,brandingSettings,invideoPromotion,statistics',
			mine: true,
			key: this[credentialsYoutube].key
		};

		return this[getYoutube](url, params);
	}

	liveStream() {
		let url = `${this[urlsYoutube].videos}`;
		let params = {
			part: 'statistics',
			id: this[credentialsYoutube].liveId,
			mine: true,
			key: this[credentialsYoutube].key
		};

		return this[getYoutube](url, params);	
	}

	liveChat() {
		let url = `${this[urlsYoutube].chats}`;
		let params = {
			part: 'id,snippet,authorDetails',
			key: this[credentialsYoutube].key,
			liveChatId: this[credentialsYoutube].chatId
		};

		return this[getYoutube](url, params);	
	}
	
	liveBroadcast() {
		let url = `${this[urlsYoutube].broadcasts}`;
		let params = {
			part: 'snippet',
			broadcastType: 'persistent',
			mine: true,
			key: this[credentialsYoutube].key
		};

		return this[getYoutube](url, params).then((result) => {
			this[credentialsYoutube].liveId = result.data.items[0].id;
			this[credentialsYoutube].chatId = result.data.items[0].snippet.liveChatId;	
		});
	}

	[getYoutube](url, params) {
		return this.axiosYoutube({
		    method: 'GET',
		    url: url,
		    params: params,
		    headers: {Authorization: `Bearer ${this.getCredentials().accessToken}`}
		});
	}
}

module.exports = Youtube;