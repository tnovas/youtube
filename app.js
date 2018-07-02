let axios = require('axios');
let OAuth2 = require('oauth20');
let getYoutube = Symbol('getYoutube');
let getViewers = Symbol('getViewers');
let credentialsYoutube = Symbol('credentialsYoutube');
let urlsYoutube = Symbol('urlsYoutube');

class Youtube extends OAuth2 {
	constructor(clientId, clientSecret, redirectUrl, key, scopes, accessToken='', liveId='', channelId='') {
		super(clientId, clientSecret, redirectUrl, scopes, accessToken, 'https://accounts.google.com/o/oauth2/', 'auth');

		this[credentialsYoutube] = {
			key: key,
			liveId: liveId,
			channelId: channelId
		};
		
		this[urlsYoutube] = {
			channels: 'channels',
			chats: 'liveChat/messages',
			search: 'search',
			videos: 'videos'
		};

		this.axiosYoutube = axios.create({
		  baseURL: 'https://www.googleapis.com/youtube/v3/'
		});
	}

	getCredentials() {
		var credentials = super.getCredentials();
		credentials.liveId = this[credentialsYoutube].liveId;
		credentials.channelId = this[credentialsYoutube].channelId;

		return credentials;
	}

	getChannel() {
		let url = this[urlsYoutube].channels;
		let params = {
			part: 'snippet,contentDetails,brandingSettings,invideoPromotion,statistics',
			mine: true,
			key: this[credentialsYoutube].key
		};

		return this[getYoutube](url, params).then((result) => {
			this[credentialsYoutube].channelId = result.data.items[0].id;
			return;
		});
	}

	liveStream() {
		let url = this[urlsYoutube].videos;
		let params = {
			part: 'statistics',
			id: this[credentialsYoutube].liveId,
			mine: true,
			key: this[credentialsYoutube].key
		};

		return this[getYoutube](url, params);	
	}

	getViewers() {
		return this[getViewers]();
	}

	liveChat() {
		let url = this[urlsYoutube].chats;
		let params = {
			part: 'id,snippet,authorDetails',
			key: this[credentialsYoutube].key,
			liveChatId: this[credentialsYoutube].liveId
		};

		return this[getYoutube](url, params);	
	}
	
	liveBroadcast() {
		let url = this[urlsYoutube].search;
		let params = {
			part: 'snippet',
			channelId: this[credentialsYoutube].channelId,
			eventType: 'live',
			type: 'video',
			key: this[credentialsYoutube].key
		};

		return this[getYoutube](url, params).then((result) => {
			if (result.data.items[0])  
				this[credentialsYoutube].liveId = result.data.items[0].id.videoId;

			return;
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

	[getViewers]() {
		let url = `https://www.youtube.com/live_stats?v=${this[credentialsYoutube].liveId}`;
		return require('axios').get(url);
	}
}

module.exports = Youtube;