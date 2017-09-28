let request = require('axios');
let oAuth2 = require('oauth20');

class Youtube extends oAuth2 {
	constructor(clientId, clientSecret, redirectUrl, key, scopes, channelId, accessToken='', refreshToken='') {
		super(clientId, clientSecret, redirectUrl, scopes, 'https://accounts.google.com/o/oauth2/', 'auth', 'token');

		this.__credentials = {
			key: key,
			channelId: channelId
		};
		
		this.__urlApi = {
			base: 'https://www.googleapis.com/youtube/v3/',
			channels: 'channels',
			streams: 'liveStreams'
		};
	}

	getCredentials() {
		let credentials = super.getCredentials();
		credentials.channelId = this.__credentials.channelId;

		return credentials;
	}

	getChannel(success, error) {
		let url = `${this.__urlApi.base}${this.__urlApi.channels}`;
		let qs = {
			part: 'snippet,contentDetails,brandingSettings,invideoPromotion,statistics',
			id: this.__credentials.channelId,
			key: this.__credentials.key
		};

		this.__get(url, qs, success, error);
	}

	__get(url, qs={}, success, error) {
		request({
		    method: 'GET',
		    url: url,
		    qs: qs,
		    json: true
		})
		.then(success)
	    .catch(error);
	}
}

module.exports = Youtube;