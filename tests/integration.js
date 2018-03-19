var Youtube = require('../app');
var express = require('express');
var app = express();

let youtube = new Youtube(
		"clientId", 
		"secretId", 
		"http://www.localhost.com/connect", 
		"key",
		"https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtube.force-ssl"
);

app.get('/connect', (req, res) => {
	youtube.connect(req.query.code).then((result) => res.json(result.data)).catch((err) => res.json(err.response.data));
});

app.get('/reconnect', (req, res) => {
	youtube.reconnect(youtube.getCredentials().refreshToken).then((result) => res.json(result.data)).catch((err) => res.json(err.response.data));
});

app.get('/getChannel', (req, res) => {
	youtube.getChannel().then((result) => res.json(result.data)).catch((err) => res.json(err.response.data));
});

app.get('/credentials', (req, res) => {
	res.json(youtube.getCredentials());
});

app.get('/getViewers', (req, res) => {
	youtube.getViewers().then((result) => res.json(result.data)).catch((err) => res.json(err.response.data));
});

app.get('/', (req, res) => {
	res.json(youtube.authorizationUrl());
});

app.listen(80);