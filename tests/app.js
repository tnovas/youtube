var chai = require('chai');
var expect = chai.expect;
var Youtube = require('../app');
var axios = require('axios');
var MockAdapter = require('axios-mock-adapter');

var mock = new MockAdapter(axios);

describe('youtube', function() {
	var youtube, scope, urls, credentials;

	before(() => {
	    youtube = new Youtube(
			"clientId", 
			"secretId", 
			"redirectUrl", 
			"key",
			"scopes"
		);

	    credentials = {
	    	clientId: "clientId", 
			clientSecret: "clientSecret", 
			redirectUrl: "redirectUrl", 
			key: "key",
			scopes: "scopes"
	    };

	    urls = {
	    	base: 'https://www.googleapis.com/youtube/v3/',
	    	baseAuth: 'https://accounts.google.com/o/oauth2/',
	    	authorizate: 'auth',
	    	token: 'token',
			channels: 'channels',
			streams: 'liveStreams',
			chats: 'liveChat/messages',
			broadcasts: 'liveBroadcasts'
		};
	  });

	it('authorizationUrl() should return Url of authorization', () => 
		expect(youtube.authorizationUrl()).to.equal(`${urls.baseAuth}${urls.authorizate}?response_type=code&client_id=${credentials.clientId}&redirect_uri=${credentials.redirectUrl}&scope=${credentials.scopes}`)
	);

	it('connect() should connect to youtube and get accessToken with code', () => {	
		var credentials = {
			accessToken: 'token',
			refreshToken: 'token',
			expiresIn: 3600,
			chatId: '',
			liveId: ''
		};
		
		mock.onPost(urls.token).replyOnce(200, {access_token: 'token', refresh_token: 'token', expires_in: 3600});

		youtube.connect('code').then(() => expect(JSON.stringify(youtube.getCredentials())).to.equal(JSON.stringify(credentials)));
	});

	it('connect() should throw error with a message', () => {	
		mock.onPost(urls.token).replyOnce(500, { error: 'error' });

		youtube.connect('code').catch((err) => expect(500).to.equal(err.response.status));
	});

	it('reconnect() should connect to youtube and get accessToken with code', () => {	
		var credentials = {
			accessToken: 'token',
			refreshToken: 'token',
			expiresIn: 3600,
			chatId: '',
			liveId: ''
		};
		
		mock.onPost(urls.token).replyOnce(200, {access_token: 'token', refresh_token: 'token', expires_in: 3600});

		youtube.reconnect('refreshToken').then(() => expect(JSON.stringify(youtube.getCredentials())).to.equal(JSON.stringify(credentials)));
	});

	it('reconnect() should throw error with a message', () => {	
		mock.onPost(urls.token).replyOnce(500, { error: 'error' });

		youtube.reconnect('refreshToken').catch((err) => expect(500).to.equal(err.response.status));
	});

	it('getChannel() should get channel', () => {	
		var response = {
			id: 1
		};
		
		mock.onGet(urls.channels).replyOnce(200, {response: {id: 1}});

		youtube.getChannel().then(() => expect(JSON.stringify(response)).to.equal(JSON.stringify(response)));
	});

	it('getChannel() should throw error with a message', () => {	
		mock.onGet(urls.channels).replyOnce(500, { error: 'error' });

		youtube.getChannel().catch((err) => expect(500).to.equal(err.response.status));
	});

	it('liveStreams() should get live stream', () => {	
		var response = {
			id: 1
		};
		
		mock.onGet(urls.streams).replyOnce(200, {response: {id: 1}});

		youtube.liveStream().then(() => expect(JSON.stringify(response)).to.equal(JSON.stringify(response)));
	});

	it('liveStreams() should throw error with a message', () => {	
		mock.onGet(urls.streams).replyOnce(500, { error: 'error' });

		youtube.liveStream().catch((err) => expect(500).to.equal(err.response.status));
	});

	it('liveChat() should get live chat', () => {	
		var response = {
			msg: "test"
		};
		
		mock.onGet(urls.chats).replyOnce(200, {response: {msg: "test"}});

		youtube.liveChat().then(() => expect(JSON.stringify(response)).to.equal(JSON.stringify(response)));
	});

	it('liveChat() should throw error with a message', () => {	
		mock.onGet(urls.chats).replyOnce(500, { error: 'error' });

		youtube.liveChat().catch((err) => expect(500).to.equal(err.response.status));
	});

	it('liveBroadcast() should get live stream', () => {	
		var response = {
			id: 1
		};
		
		mock.onGet(urls.broadcasts).replyOnce(200, {response: {id: 1}});

		youtube.liveBroadcast().then(() => expect(JSON.stringify(response)).to.equal(JSON.stringify(response)));
	});

	it('liveBroadcast() should throw error with a message', () => {	
		mock.onGet(urls.broadcasts).replyOnce(500, { error: 'error' });

		youtube.liveBroadcast().catch((err) => expect(500).to.equal(err.response.status));
	});

	it('getCredentials() should get credentials', () => {
		var credentials = {
			accessToken: 'token',
			refreshToken: 'token',
			expiresIn: 3600,
			chatId: '',
			liveId: ''
		};

		var result = youtube.getCredentials();

		expect(JSON.stringify(result)).to.equal(JSON.stringify(credentials));
	});
});