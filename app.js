let axios = require('axios');
let OAuth2 = require('oauth20');
let get = Symbol('get');
let put = Symbol('put');
let credentialsYT = Symbol('credentialsYT');
let urlsYT = Symbol('urlsYT');

class Youtube extends OAuth2 {
	constructor(clientId, clientSecret, redirectUrl, key, scopes) {
		super(clientId, clientSecret, redirectUrl, scopes, 'https://accounts.google.com/o/oauth2/', 'auth', 'token');

		this[credentialsYT] = {
			key: key,
			chatId: '',
			liveId: ''
		};
		
		this[urlsYT] = {
			base: 'https://www.googleapis.com/youtube/v3/',
			channels: 'channels',
			streams: 'liveStreams',
			chats: 'liveChat/messages',
			broadcasts: 'liveBroadcasts'
		};

		axios = axios.create({
		  baseURL: this[urlsYT].base
		});
	}

	getCredentials() {
		var credentials = super.getCredentials();
		credentials.chatId = this[credentialsYT].chatId;
		credentials.liveId = this[credentialsYT].liveId;

		return credentials;
	}

	getChannel() {
		let url = `${this[urlsYT].channels}`;
		let params = {
			part: 'snippet,contentDetails,brandingSettings,invideoPromotion,statistics',
			mine: true,
			key: this[credentialsYT].key
		};

		return this[get](url, params);
	}

	liveStream() {
		let url = `${this[urlsYT].streams}`;
		let params = {
			part: 'id,snippet,cdn,status',
			key: this[credentialsYT].key,
			liveId: this[credentialsYT].liveId
		};

		return this[get](url, params);	
	}

	liveChat() {
		let url = `${this[urlsYT].chats}`;
		let params = {
			part: 'id,snippet,authorDetails',
			key: this[credentialsYT].key,
			chatId: this[credentialsYT].chatId
		};

		return this[get](url, params);	
	}
	
	liveBroadcast() {
		let url = `${this[urlsYT].broadcasts}`;
		let params = {
			part: 'id,snippet,contentDetails,status',
			mine: true,
			key: this[credentialsYT].key
		};

		return this[get](url, params);	
	}

	[get](url, params) {
		return axios({
		    method: 'GET',
		    url: url,
		    params: params,
		    headers: {Authorization: `Bearer ${this.getCredentials().accessToken}`}
		});
	}

	[put](url, data) {
		return axios({
		    method: 'PUT',
		    url: url,
		    data: data,
		    headers: {Authorization: `Bearer ${this.getCredentials().accessToken}`}
		});
	}
}

module.exports = Youtube;