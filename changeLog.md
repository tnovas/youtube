# Changelog
All notable changes to this project will be documented in this file.

## [2.0.0] - 2018-07-03
### Added
- Methods with Async - Await
- ChannelId in contructor
- Change the way of pass parameters of contructor, now is an object
- New public method `searchChannel` for get liveId on any channel and its information
### Changed
- GetViewers now call a url for get the real viewers
- GetChannel now set the channelId and return information
- All calls of axios return content of `data`
- Documentation in README.md
- Nodejs version > 7.6
### Removed
- ChatId in params of constructor
- liveBroadcast method

## [1.2.0] - 2017-10-18
### Added
- ChatId in params of constructor
- LiveId in params of constructor

## [1.1.0] - 2017-10-18
### Added
- AccessToken in params of constructor
### Changed
- OAuth 2.0.0