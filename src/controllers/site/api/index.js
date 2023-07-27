const searchApiController = require('./search.api.controller');
const reportErrorEpisodeApiController = require('./reportErrorEpisode.api.controller');
const loadEpisodeApiController = require('./loadEpisode.api.controller');
const authApiController = require('./auth.api.controller');
const userInfoApiController = require('./userInfo.api.controller');
const userFilmsApiControllers = require('./userFilms.api.controller');

module.exports = {
	searchApiController,
	reportErrorEpisodeApiController,
	loadEpisodeApiController,
	authApiController,
	userInfoApiController,
	userFilmsApiControllers,
};
