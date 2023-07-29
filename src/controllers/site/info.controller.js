const filmModels = require('../../models/film.models');
const userModels = require('../../models/user.models');
const { getIMDBScore, convertToYoutubeEmbed } = require('../../utils/site/filmInfo.util');
const loadHeaderData = require('../../utils/site/loadHeaderData.utils');
const loadRightSidebarData = require('../../utils/site/loadRightSidebarData.util');
const loadRelatedFilms = require('../../utils/site/loadRelatedFilms.utils');
const getNotificationOfUser = require('../../helpers/getNotificationOfUser.helper');

module.exports = async (req, res) => {
	const { filmSlug, filmId } = req.params;
	const { _id: userId } = req.session.user || {};

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

	// if user login, check is in collection?
	const { isInFollow, isInCollection } = await (async () => {
		// check user is login
		const { username } = req.session.user || {};
		if (!username) return { isInCollection: false };

		const [{ isInFollow, isInCollection }] = await userModels.aggregate([
			{
				$match: { username },
			},
			{
				$facet: {
					isInCollection: [
						{ $match: { 'films.collection': filmId } },
						{ $limit: 1 },
						{ $project: { _id: 0, exists: { $literal: true } } },
					],
					isInFollow: [
						{ $match: { 'films.follow': filmId } },
						{ $limit: 1 },
						{ $project: { _id: 0, exists: { $literal: true } } },
					],
				},
			},
			{
				$project: {
					_id: 0,
					isInCollection: { $arrayElemAt: ['$isInCollection.exists', 0] },
					isInFollow: { $arrayElemAt: ['$isInFollow.exists', 0] },
				},
			},
		]);

		return { isInFollow: !!isInFollow, isInCollection: !!isInCollection };
	})();

	const [header, rightSidebar, relatedFilms, notifications] = await Promise.all([
		loadHeaderData.load(),
		loadRightSidebarData.load(),
		loadRelatedFilms.load(film),
		userId && getNotificationOfUser(userId),
	]);

	res.render('site/info', {
		header: { ...header, notifications },
		rightSidebar,
		relatedFilms,
		info: { film, isInFollow, isInCollection },
		user: req.session.user,
	});
};
