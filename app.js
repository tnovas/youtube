let request = require('axios');

class Youtube {
	constructor(clientId, clientSecret, redirectUrl, key, scopes, channelId, accessToken='', refreshToken='') {
		this.__credentials = {
			clientId: clientId,
			clientSecret: clientSecret,
			redirectUrl: redirectUrl,
			key: key,
			scopes: scopes,
			channelId: channelId,
			accessToken: accessToken,
			refreshToken: refreshToken
		};
		
		this.__urlApi = {
			base: 'https://www.googleapis.com/youtube/v3/',
			baseAuth: 'https://accounts.google.com/o/oauth2/',
			authorizate: 'auth',
			accessTokenPath: 'token',
			channels: 'channels',
			streams: 'liveStreams'
		};

		request.defaults.headers.post['Authorization'] =  `Bearer ${accessToken}`;
	}

	authorizationUrl() {
		return `${this.__urlApi.baseAuth}${this.__urlApi.authorizate}?response_type=code&client_id=${this.__credentials.clientId}&redirect_uri=${this.__credentials.redirectUrl}&scope=${this.__credentials.scopes}`;
	}

	getCredentials() {
		return {
			accessToken: this.__credentials.accessToken,
			refreshToken: this.__credentials.refreshToken,
			channelId: this.__credentials.channelId
		};
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

	connect(code, success, error) {
		let url = `${this.__urlApi.baseAuth}${this.__urlApi.accessTokenPath}`;
		let body = {
			grant_type: 'authorization_code',
			client_id: this.__credentials.clientId,
			client_secret: this.__credentials.clientSecret,
			redirect_uri: this.__credentials.redirectUrl,
			code: code
		};

		this.__post(url, body, (result) => {
			this.__credentials.accessToken = result.data.access_token;
			this.__credentials.refreshToken = result.data.refresh_token;

			request.defaults.headers.post['Authorization'] =  `Bearer ${result.data.access_token}`;
			success();
	    }, error);
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

	__post(url, body, success, error) {
		request({
		    method: 'POST',
		    url: url,
		    body: body,
		    json: true
		})
		.then(success)
	    .catch(error);
	}
}

module.exports = Youtube;