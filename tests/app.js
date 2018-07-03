var chai = require('chai');
var expect = chai.expect;
var Youtube = require('../app');
var axios = require('axios');
var MockAdapter = require('axios-mock-adapter');

var mock = new MockAdapter(axios);

describe('youtube', () => {
	var youtube, scope, urls, credentials;

	before(() => {
		let params = {
			clientId: 'clientId',
			clientSecret: 'clientSecret',
			redirectUrl: 'redirectUrl',
			key: 'key',
			scopes: 'scopes'
		};

	    youtube = new Youtube(params);

	    credentials = params;

	    urls = {
	    	base: 'https://www.googleapis.com/youtube/v3/',
	    	baseAuth: 'https://accounts.google.com/o/oauth2/',
	    	authorizate: 'auth',
	    	token: 'token',
	    	search: 'search',
			channels: 'channels',
			chats: 'liveChat/messages',
			broadcasts: 'liveBroadcasts',
			videos: 'videos',
			viewers: 'https://www.youtube.com/live_stats?v='
		};
	  });

	it('authorizationUrl() should return Url of authorization', () => 
		expect(youtube.authorizationUrl()).to.equal(`${urls.baseAuth}${urls.authorizate}?response_type=code&client_id=${credentials.clientId}&redirect_uri=${credentials.redirectUrl}&scope=${credentials.scopes}`)
	);

	it('connect() should connect to youtube and get accessToken with code', async () => {	
		var credentials = {
			accessToken: 'token',
			refreshToken: 'token',
			expiresIn: 3600,
			liveId: '',
			channelId: ''
		};
		
		mock.onPost(urls.token).replyOnce(200, {access_token: 'token', refresh_token: 'token', expires_in: 3600});

		await youtube.connect('code');
		expect(JSON.stringify(youtube.getCredentials())).to.equal(JSON.stringify(credentials));
	});

	it('reconnect() should connect to youtube and get accessToken with code', () => {	
		var credentials = {
			accessToken: 'token',
			refreshToken: 'token',
			expiresIn: 3600,
			liveId: '',
			channelId: ''
		};
		
		mock.onPost(urls.token).replyOnce(200, {access_token: 'token', refresh_token: 'token', expires_in: 3600});

		youtube.reconnect('refreshToken').then(() => expect(JSON.stringify(youtube.getCredentials())).to.equal(JSON.stringify(credentials)));
	});

	it('getChannel() should get channel', async () => {	
		let response = {
			items: [{
				id: 1
			}]
		};

		mock.onGet(urls.channels).replyOnce(200, response);

		let result = await youtube.getChannel();

		expect(JSON.stringify(response)).to.equal(JSON.stringify(result))
	});

	it('liveStreams() should get live stream', async () => {	
		var response = {
			id: 1
		};
		
		mock.onGet(urls.videos).replyOnce(200, response);

		let result = await youtube.liveStream();

		expect(JSON.stringify(response)).to.equal(JSON.stringify(result));
	});

	it('liveChat() should get live chat', async () => {	
		var response = {
			msg: "test"
		};
		
		mock.onGet(urls.chats).replyOnce(200, response);

		let result = await youtube.liveChat();

		expect(JSON.stringify(response)).to.equal(JSON.stringify(result))
	});

	it('getViewers() should get a count of viewers', async () => {	
		var response = 1240;
		
		mock.onGet(urls.viewers).replyOnce(200, response);

		let result = await youtube.getViewers();

		expect(JSON.stringify(response)).to.equal(JSON.stringify(result));
	});

	it('searchChannel() should get a live Id', async () => {	
		let response = {
			items: [{
				id: {
					videoId: 1
				}
			}]
		};
		
		mock.onGet(urls.search).replyOnce(200, response);

		let result = await youtube.searchChannel();

		expect(JSON.stringify(response)).to.equal(JSON.stringify(result));
	});

	it('searchChannel() the result is empty', async () => {	
		let response = {
			items: []
		};
		
		mock.onGet(urls.search).replyOnce(200, response);

		let result = await youtube.searchChannel();

		expect(JSON.stringify(response)).to.equal(JSON.stringify(result));
	});

	it('getCredentials() should get credentials', () => {
		var credentials = {
			accessToken: 'token',
			refreshToken: 'token',
			expiresIn: 3600,
			liveId: 1,
			channelId: 1
		};

		var result = youtube.getCredentials();

		expect(JSON.stringify(result)).to.equal(JSON.stringify(credentials));
	});
});