var chai = require('chai');
var expect = chai.expect;
var request = require('request');
var Youtube = require('../app');
var axios = require('axios');
var MockAdapter = require('axios-mock-adapter');

var mock = new MockAdapter(axios);

describe('youtube', function() {
	var youtube, scope, urlApi, headers;

	before(function() {
	    youtube = new Youtube(
			"clientId", 
			"clientSecret", 
			"redirectUrl", 
			"key",
			"https://www.googleapis.com/auth/youtube.force-ssl,https://www.googleapis.com/auth/youtube,https://www.googleapis.com/auth/youtube.readonly,https://www.googleapis.com/auth/youtube.upload,https://www.googleapis.com/auth/youtubepartner-channel-audit",
			"channelId");

	    urlApi = {
			base: 'https://www.googleapis.com/youtube/v3/',
			baseAuth: 'https://accounts.google.com/o/oauth2/',
			authorizate: 'auth',
			accessTokenPath: 'token',
			channels: 'channels',
			streams: 'liveStreams'
		};
	  });


	it('constructor() should make credentials with params', function() {
		var credentials = {
			clientId: "clientId",
			clientSecret: "clientSecret",
			redirectUrl: "redirectUrl",
			key: "key",
			scopes: "https://www.googleapis.com/auth/youtube.force-ssl,https://www.googleapis.com/auth/youtube,https://www.googleapis.com/auth/youtube.readonly,https://www.googleapis.com/auth/youtube.upload,https://www.googleapis.com/auth/youtubepartner-channel-audit",
			channelId: "channelId",
			accessToken: '',
			refreshToken: '',
			
		};
		
		expect(JSON.stringify(youtube.__credentials)).to.equal(JSON.stringify(credentials));
		expect(JSON.stringify(youtube.__urlApi)).to.equal(JSON.stringify(urlApi));
	});

	it('authorizationUrl() should return Url of authorization', function() {
		expect(youtube.authorizationUrl()).to.equal(`${urlApi.baseAuth}${urlApi.authorizate}?response_type=code&client_id=${youtube.__credentials.clientId}&redirect_uri=${youtube.__credentials.redirectUrl}&scope=${youtube.__credentials.scopes}`);
	});

	it('connect() should connect to youtube and get accessToken with code', function() {	
		mock.onPost(`${urlApi.baseAuth}${urlApi.accessTokenPath}`).reply(200, {access_token: 'token'});

		youtube.connect('code', () => { expect('token').to.equal(youtube.__credentials.accessToken); }, (err) => {console.log(err)});
	});

	it('getChannel() should get channel by id', function() {
		let items = [ 
				{
					statistics: {
		                viewCount: "37034581",
		                commentCount: "3508",
		                subscriberCount: "413939",
		                hiddenSubscriberCount: false,
		                videoCount: "1411"
		            }
		        }
	        ];

		mock.onGet(`${urlApi.base}${urlApi.channels}`).reply(200, items);

		youtube.getChannel((result) => { expect(JSON.stringify(items[0])).to.equal(JSON.stringify(result.data[0])); }, (err) => {console.log(err)});
	});

	it('getCredentials() should get credentials', function() {
		var credentials = {
			accessToken: 'token',
			refreshToken: 'token',
			channelId: 'channelId'
		};

		youtube.__credentials = {
			accessToken: 'token',
			refreshToken: 'token',
			channelId: 'channelId'	
		};

		var result = youtube.getCredentials();

		expect(JSON.stringify(result)).to.equal(JSON.stringify(credentials));
	});

});