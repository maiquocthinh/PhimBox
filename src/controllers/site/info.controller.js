const filmModels = require('../../models/film.models');
const { getIMDBScore, convertToYoutubeEmbed } = require('../../utils/site/filmInfo.util');
const loadHeaderData = require('../../utils/site/loadHeaderData.utils');
const loadRightSidebarData = require('../../utils/site/loadRightSidebarData.util');
const loadRelatedFilms = require('../../utils/site/loadRelatedFilms.utils');

module.exports = async (req, res) => {
	const { filmSlug, filmId } = req.params;
	const film = await filmModels
		.aggregate([
			{
				$match: { _id: filmId, slug: filmSlug },
			},
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
			{
				$addFields: {
					isHasEpisode: {
						$cond: {
							if: { $eq: [{ $size: '$episodes' }, 0] },
							then: false,
							else: true,
						},
					},
				},
			},
			{
				$project: {
					_id: 1,
					name: 1,
					originalName: 1,
					status: 1,
					poster: 1,
					categoriesData: { name: 1, slug: 1 },
					countriesData: { name: 1, slug: 1 },
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
					slug: { $concat: ['$slug', '-', '$_id'] },
					isHasEpisode: 1,
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

	const [header, rightSidebar, relatedFilms] = await Promise.all([
		loadHeaderData.load(),
		loadRightSidebarData.load(),
		loadRelatedFilms.load(film),
	]);

	res.render('site/info', {
		header,
		rightSidebar,
		relatedFilms,
		info: { film },
		user: req.session.user,
	});
};
