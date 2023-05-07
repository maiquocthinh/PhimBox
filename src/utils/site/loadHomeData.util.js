const filmModels = require('../../models/film.models');
const configurationModels = require('../../models/configuration.models');
const redisClient = require('../../database/init.redis');
const toTime = require('to-time');

const loadFromDatabase = async () => {
	const projection = {
		_id: 0,
		id: 1,
		name: 1,
		originalName: 1,
		poster: 1,
		status: 1,
		year: 1,
		language: 1,
		duration: 1,
		imdb: 1,
		description: 1,
		slug: 1,
		category: 1,
		country: 1,
	};
	const promiseArray = [
		filmModels.find({ recommend: '1' }, projection).limit(10),

		filmModels.find({ canonical: '1' }, { ...projection, backdropsCanonical: 1 }).limit(10),

		filmModels.find({ type: 'movie' }, projection).limit(18),

		filmModels.find({ type: 'series' }, projection).limit(18),

		filmModels.find({ category: '63ea61267619eddd0a9cc94f' }, projection).limit(18),
	];

	const [listFilmRecommend, listFilmCanonical, listFilmMovie, listFilmSeries, listFilmAnimation] = await Promise.all(
		promiseArray,
	).then((results) =>
		results.map((result) => result.map((film) => ({ ...film._doc, slug: `${film.slug}-${film.id}` }))),
	);

	return { listFilmRecommend, listFilmCanonical, listFilmMovie, listFilmSeries, listFilmAnimation };
};

const load = async () => {
	return await new Promise((resolve, reject) => {
		redisClient.get('site:home', async (error, result) => {
			if (error) reject(error);

			let homeData = result;
			if (homeData) {
				resolve(JSON.parse(homeData));
			} else {
				const { timecache: timeCache } = await configurationModels.findOne({}, { timecache: 1 });

				homeData = await loadFromDatabase();
				resolve(homeData);

				redisClient.set('site:home', JSON.stringify(homeData), 'EX', toTime(timeCache).seconds(), () => {});
			}
		});
	});
};

module.exports = { load };
