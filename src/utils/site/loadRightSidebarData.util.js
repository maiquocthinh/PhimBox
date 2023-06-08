const filmModels = require('../../models/film.models');
const configurationModels = require('../../models/configuration.models');
const redisClient = require('../../database/init.redis');
const toTime = require('to-time');
const { getIMDBScore } = require('./filmInfo.util');
const { getStartOfWeek, getEndOfWeek, getStartOfMonth, getEndOfMonth, getStartOfDay, getEndOfDay } = require('../date.util');

const loadFromDatabase = async () => {
	const currentDate = new Date();
	currentDate.setHours(0, 0, 0, 0);

	const matchTrailer = { status: 'trailer' };
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
		quality: 1,
		duration: 1,
		imdb: 1,
		description: 1,
		infoHref: { $concat: ['/info/', '$slug', '-', '$_id'] },
		categoriesData: { name: 1, slug: 1 },
		countriesData: { name: 1, slug: 1 },
	};

	const promiseArray = [
		filmModels.aggregate([{ $match: matchTrailer }, ...lookups, { $project: projection }]),
		filmModels.aggregate([
			{
				$facet: {
					topViewsOfDay: [
						// { $match: { 'viewedDay.date': { $gte: getStartOfDay(), $lte: getEndOfDay() } } },
						{ $match: { 'viewedDay.date': { $gte: getStartOfDay() } } },
						{ $sort: { 'viewedDay.viewed': -1 } },
						{ $limit: 8 },
						{ $project: projection },
					],
					topViewsOfWeek: [
						{ $match: { 'viewedWeek.date': { $gte: getStartOfWeek(), $lte: getEndOfWeek() } } },
						{ $sort: { 'viewedWeek.viewed': -1 } },
						{ $limit: 8 },
						{ $project: projection },
					],
					topViewsOfMonth: [
						{ $match: { 'viewedMonth.date': { $gte: getStartOfMonth(), $lte: getEndOfMonth() } } },
						{ $sort: { 'viewedMonth.viewed': -1 } },
						{ $limit: 8 },
						{ $project: projection },
					],
				},
			},
			{ $project: { topViewsOfDay: 1, topViewsOfWeek: 1, topViewsOfMonth: 1 } },
		]),
		configurationModels.findOne({}, { web_tags: 1 }),
	];

	const [listFilmTrailer, [topViews], { web_tags: webTags }] = await Promise.all(promiseArray);

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
		for (const key in topViews) {
			if (!Object.hasOwnProperty.call(topViews, key)) continue;
			topViews[key].forEach((film) => {
				imdbScorePromiseArray.push(
					getIMDBScore(film.imdb).then((imdbScore) => {
						film.imdb = imdbScore;
					}),
				);
			});
		}
		await Promise.all(imdbScorePromiseArray);
	}

	return { listFilmTrailer, topViews, webTags: webTags.split(',') };
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

				redisClient.set('site:leftSidebar', JSON.stringify(leftSidebarData), 'EX', toTime('15m').seconds(), () => {});
			}
		});
	});
};

module.exports = { load };
