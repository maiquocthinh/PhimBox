const filmModels = require('../../models/film.models');
const configurationModels = require('../../models/configuration.models');
const redisClient = require('../../database/init.redis');
const toTime = require('to-time');
const { getIMDBScore } = require('./filmInfo.util');

const loadFromDatabase = async () => {
	const match = { $or: [{ status: 'trailer' }, { status: 'ongoing' }] };
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
		filmModels.aggregate([{ $match: match }, ...lookups, { $project: projection }]),
		configurationModels.findOne({}, { web_tags: 1 }),
	];

	const [listFilmTrailer, { web_tags: webTags }] = await Promise.all(promiseArray);

	// load imdb score
	{
		const imdbScorePromiseArray = [];
		listFilmTrailer.forEach((film) => {
			imdbScorePromiseArray.push(
				getIMDBScore(film.imdb).then((imdbScore) => {
					film.imdb = imdbScore;
				}),
			);
		});
		await Promise.all(imdbScorePromiseArray);
	}

	return { listFilmTrailer, webTags: webTags.split(',') };
};

const load = async () => {
	return await new Promise((resolve, reject) => {
		redisClient.get('site:leftSidebar', async (error, result) => {
			if (error) reject(error);

			let leftSidebarData = result;
			if (leftSidebarData) {
				resolve(JSON.parse(leftSidebarData));
			} else {
				leftSidebarData = await loadFromDatabase();
				resolve(leftSidebarData);

				const { timecache: timeCache } = await configurationModels.findOne({}, { timecache: 1 });
				redisClient.set('site:leftSidebar', JSON.stringify(leftSidebarData), 'EX', toTime(timeCache).seconds(), () => {});
			}
		});
	});
};

module.exports = { load };
