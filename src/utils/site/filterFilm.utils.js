const filmModels = require('../../models/film.models');
const { getIMDBScore } = require('./filmInfo.util');

module.exports = async ({ category, country, type, keyWord }, pageNumber) => {
	const RECORD_PER_PAGE = 20;
	const PAGE_NUMBER = pageNumber || 1;
	let filter = {};

	if (category) {
	}

	if (country) {
	}

	if (keyWord) {
		filter = {
			...filter,
			$or: [{ name: { $regex: keyWord, $options: 'i' } }, { originalName: { $regex: keyWord, $options: 'i' } }],
		};
	}

	if (type) {
		filter = { ...filter, type };
	}

	const pipelineOperators = [
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
		{ $match: filter },
	];

	const totalFilms = await filmModels
		.aggregate([
			...pipelineOperators,
			{
				$group: {
					_id: null,
					count: { $sum: 1 },
				},
			},
		])
		.then((res) => res[0]?.count || 0);

	const films = await filmModels.aggregate([
		...pipelineOperators,
		{
			$project: {
				_id: 0,
				name: 1,
				originalName: 1,
				poster: 1,
				status: 1,
				year: 1,
				language: 1,
				duration: 1,
				imdb: 1,
				description: 1,
				href: { $concat: ['/info/', '$slug', '-', '$_id'] },
				categoriesData: { name: 1, slug: 1 },
				countriesData: { name: 1, slug: 1 },
			},
		},
		{ $skip: (PAGE_NUMBER - 1) * RECORD_PER_PAGE },
		{ $limit: RECORD_PER_PAGE },
	]);

	const imdbScorePromiseArray = [];

	films.forEach((film) => {
		imdbScorePromiseArray.push(
			getIMDBScore(film.imdb).then((imdbScore) => {
				film.imdb = imdbScore;
			}),
		);
	});

	await Promise.all(imdbScorePromiseArray);

	return { data: films, totalPage: Math.ceil(totalFilms / RECORD_PER_PAGE), pageNumber: PAGE_NUMBER };
};
