let axios = require('axios');
let OAuth2 = require('oauth20');
let get = symbol('get');
let put = symbol('put');
let credentials = symbol('credentialsYT');
let urls = symbol('urlsYT');

class Youtube extends OAuth2 {
	constructor(clientId, clientSecret, redirectUrl, key, scopes, accessToken='', refreshToken='') {
		super(clientId, clientSecret, redirectUrl, scopes, 'https://accounts.google.com/o/oauth2/', 'auth', 'token');

		this[credentials] = {
			key: key,
			chatId: chatId,
			liveId: liveId
		};
		
		this[urls] = {
			channels: 'channels',
			streams: 'liveStreams',
			chats: 'liveChat/messages',
			broadcasts: 'liveBroadcasts'
		};

		axios.default.baseURL = 'https://www.googleapis.com/youtube/v3/';
	}

	getChannel() {
		let url = `${this[urls].channels}`;
		let params = {
			part: 'snippet,contentDetails,brandingSettings,invideoPromotion,statistics',
			mine: true,
			key: this[credentials].key
		};

		return this[get](url, params);
	}

	updateChannel() {
		let url = `${this[urls].channels}`;
		let data = {
			part: 'snippet,contentDetails,brandingSettings,invideoPromotion,statistics',
			mine: true,
			key: this[credentials].key
		};

		return this[put](url, params);
	}

	liveStreams() {
		let url = `${this[urls].streams}`;
		let params = {
			part: 'id,snippet,cdn,status',
			key: this[credentials].key,
			liveId: this[credentials].liveId
		};

		return this[get](url, params);	
	}

	liveChat() {
		let url = `${this[urls].chats}`;
		let params = {
			part: 'id,snippet,authorDetails',
			key: this[credentials].key,
			chatId: this[credentials].chatId
		};

		return this[get](url, params);	
	}
	
	liveBroadcast() {
		let url = `${this[urls].broadcasts}`;
		let params = {
			part: 'id,snippet,contentDetails,status',
			mine: true,
			key: this[credentials].key
		};

		return this[get](url, params);	
	}

	[get](url, params) {
		return axios({
		    method: 'GET',
		    url: url,
		    params: params,
		    headers: {Authorization: `Bearer ${super.getCredentials().accessToken}`}
		});
	}

	[put](url, data) {
		return axios({
		    method: 'PUT',
		    url: url,
		    data: data,
		    headers: {Authorization: `Bearer ${super.getCredentials().accessToken}`}
		});
	}
}

module.exports = Youtube;