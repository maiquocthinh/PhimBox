const filmModels = require('../../models/film.models');
const { getIMDBScore, convertToYoutubeEmbed } = require('../../utils/site/filmInfo.util');
const loadHeaderData = require('../../utils/site/loadHeaderData.utils');
const loadLeftSidebarData = require('../../utils/site/loadLeftSidebarData.util');

module.exports = async (req, res) => {
	const filmId = req.params.filmSlug.split('-').pop();
	const film = await filmModels
		.aggregate([
			{
				$match: { id: filmId },
			},
			{
				$lookup: {
					from: 'categories',
					localField: 'category',
					foreignField: 'id',
					as: 'categoriesData',
				},
			},
			{
				$lookup: {
					from: 'countries',
					localField: 'country',
					foreignField: 'id',
					as: 'countriesData',
				},
			},
			{
				$project: {
					_id: 0,
					name: 1,
					originalName: 1,
					status: 1,
					poster: 1,
					categoriesData: 1,
					countriesData: 1,
					trailer: 1,
					duration: 1,
					year: 1,
					imdb: 1,
					language: 1,
					type: 1,
					info: 1,
					viewed: 1,
					tag: 1,
					tagAscii: 1,
					slug: { $concat: ['$slug', '-', '$id'] },
				},
			},
			{ $limit: 1 },
		])
		.then((result) => result[0]);

	if (!film) {
		res.status(404).json({ message: 'Page not found' });
		return;
	}

	film.imdb = await getIMDBScore(film.imdb);
	film.trailer = convertToYoutubeEmbed(film.trailer);

	res.render('site/info', {
		header: await loadHeaderData.load(),
		leftSidebar: await loadLeftSidebarData.load(),
		info: { film },
	});
};
