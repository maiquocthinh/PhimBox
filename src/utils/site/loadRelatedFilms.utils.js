const filmModels = require('../../models/film.models');
const redisClient = require('../../database/init.redis');
const { getIMDBScore } = require('./filmInfo.util');

const loadFromDatabase = async ({ filmId, name, originalName }) => {
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

	const relatedFilms = await filmModels.aggregateWithDeleted([
		{
			$match: {
				$text: { $search: `${name} ${originalName}` },
				_id: { $ne: filmId },
				viewable: true,
				deleted: false,
			},
		},
		...lookups,
		{ $project: projection },
		{ $sort: { score: { $meta: 'textScore' } } },
		{ $limit: 10 },
	]);

	const imdbScorePromiseArray = relatedFilms.map((film) =>
		getIMDBScore(film.imdb).then((imdbScore) => {
			film.imdb = imdbScore;
		}),
	);

	await Promise.all(imdbScorePromiseArray);

	return relatedFilms;
};

const load = async ({ _id: filmId, name, originalName }) => {
	return await new Promise((resolve, reject) => {
		redisClient.get(`site:relatedFilms:${filmId}`, async (error, result) => {
			if (error) reject(error);

			let relatedFilmsData = result;
			if (relatedFilmsData) {
				resolve(JSON.parse(relatedFilmsData));
			} else {
				relatedFilmsData = await loadFromDatabase({ filmId, name, originalName });
				resolve(relatedFilmsData);

				redisClient.set(`site:relatedFilms:${filmId}`, JSON.stringify(relatedFilmsData), 'EX', 15 * 60, () => {});
			}
		});
	});
};

module.exports = { load };
