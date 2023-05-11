const filmModels = require('../../models/film.models');
const configurationModels = require('../../models/configuration.models');
const redisClient = require('../../database/init.redis');
const toTime = require('to-time');
const { getIMDBScore } = require('./filmInfo.util');

const loadFromDatabase = async () => {
	const lookups = [
		{
			$lookup: {
				from: 'categories',
				localField: 'category',
				foreignField: '_id',
				as: 'categoriesData',
			},
		},
		{
			$lookup: {
				from: 'countries',
				localField: 'country',
				foreignField: '_id',
				as: 'countriesData',
			},
		},
	];

	const projection = {
		_id: 1,
		name: 1,
		originalName: 1,
		poster: 1,
		status: 1,
		year: 1,
		language: 1,
		duration: 1,
		imdb: 1,
		description: 1,
		slug: { $concat: ['$slug', '-', '$_id'] },
		categoriesData: { name: 1, slug: 1 },
		countriesData: { name: 1, slug: 1 },
	};
	const promiseArray = [
		filmModels.aggregate([{ $match: { recommend: '1' } }, ...lookups, { $project: projection }, { $limit: 10 }]),

		filmModels.aggregate([
			{ $match: { canonical: '1' } },
			...lookups,
			{ $project: { ...projection, backdropsCanonical: 1 } },
			{ $limit: 10 },
		]),

		filmModels.aggregate([{ $match: { type: 'movie' } }, ...lookups, { $project: projection }, { $limit: 18 }]),

		filmModels.aggregate([{ $match: { type: 'series' } }, ...lookups, { $project: projection }, { $limit: 18 }]),

		filmModels.aggregate([{ $match: { category: 'jb9qn0B' } }, ...lookups, { $project: projection }, { $limit: 18 }]),
	];

	const [listFilmRecommend, listFilmCanonical, listFilmMovie, listFilmSeries, listFilmAnimation] = await Promise.all(
		promiseArray,
	);

	// load imdb score
	for (const listFilm of [listFilmRecommend, listFilmCanonical, listFilmMovie, listFilmSeries, listFilmAnimation]) {
		const imdbScorePromiseArray = [];
		listFilm.forEach((film) => {
			imdbScorePromiseArray.push(
				getIMDBScore(film.imdb).then((imdbScore) => {
					film.imdb = imdbScore;
				}),
			);
		});
		await Promise.all(imdbScorePromiseArray);
	}

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
				homeData = await loadFromDatabase();
				resolve(homeData);

				const { timecache: timeCache } = await configurationModels.findOne({}, { timecache: 1 });
				redisClient.set('site:home', JSON.stringify(homeData), 'EX', toTime(timeCache).seconds(), () => {});
			}
		});
	});
};

module.exports = { load };
