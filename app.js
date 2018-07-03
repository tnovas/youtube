let axios = require('axios');
let OAuth2 = require('oauth20');
let getYoutube = Symbol('getYoutube');
let getViewers = Symbol('getViewers');
let credentialsYoutube = Symbol('credentialsYoutube');
let urlsYoutube = Symbol('urlsYoutube');

class Youtube extends OAuth2 {
	constructor(params) {
		super(params.clientId, params.clientSecret, params.redirectUrl, params.scopes, params.accessToken || '', 'https://accounts.google.com/o/oauth2/', 'auth');

		this[credentialsYoutube] = {
			key: params.key,
			liveId: params.liveId || '',
			channelId: params.channelId || ''
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

	async getChannel() {
		let url = this[urlsYoutube].channels;
		let params = {
			part: 'snippet,contentDetails,brandingSettings,invideoPromotion,statistics',
			mine: true,
			key: this[credentialsYoutube].key
		};

		let result = await this[getYoutube](url, params);
		this[credentialsYoutube].channelId = result.items[0].id;

		return result;
	}

	async liveStream() {
		let url = this[urlsYoutube].videos;
		let params = {
			part: 'statistics',
			id: this[credentialsYoutube].liveId,
			mine: true,
			key: this[credentialsYoutube].key
		};

		return await this[getYoutube](url, params);	
	}

	async getViewers() {
		return await this[getViewers]();
	}

	async liveChat() {
		let url = this[urlsYoutube].chats;
		let params = {
			part: 'id,snippet,authorDetails',
			key: this[credentialsYoutube].key,
			liveChatId: this[credentialsYoutube].liveId
		};

		return await this[getYoutube](url, params);	
	}
	
	async searchChannel() {
		let url = this[urlsYoutube].search;
		let params = {
			part: 'snippet',
			channelId: this[credentialsYoutube].channelId,
			eventType: 'live',
			type: 'video',
			key: this[credentialsYoutube].key
		};

		let result = await this[getYoutube](url, params);
		if (result.items[0])
			this[credentialsYoutube].liveId = result.items[0].id.videoId;

		return result;
	}

	async [getYoutube](url, params) {
		let result = await this.axiosYoutube({
		    method: 'GET',
		    url: url,
		    params: params,
		    headers: {Authorization: `Bearer ${this.getCredentials().accessToken}`}
		});

		return result.data;
	}

	async [getViewers]() {
		let url = `https://www.youtube.com/live_stats?v=${this[credentialsYoutube].liveId}`;
		let result = await require('axios').get(url);
		return result.data;
	}
}

module.exports = Youtube;