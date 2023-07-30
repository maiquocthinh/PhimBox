const filmModels = require('../../models/film.models');
const loadHeaderData = require('../../utils/site/loadHeaderData.utils');
const loadRightSidebarData = require('../../utils/site/loadRightSidebarData.util');
const loadRelatedFilms = require('../../utils/site/loadRelatedFilms.utils');
const getNotificationOfUser = require('../../helpers/getNotificationOfUser.helper');

module.exports = async (req, res, next) => {
	const { filmSlug, filmId } = req.params;
	const { _id: userId } = req.session.user || {};

	const { episodes, ...film } = await filmModels
		.aggregate([
			{ $match: { _id: filmId, slug: filmSlug, viewable: true } },
			{
				$lookup: {
					from: 'episodes',
					let: { episodeIds: '$episodes' },
					pipeline: [{ $match: { $expr: { $in: ['$_id', '$$episodeIds'] } } }, { $sort: { createdAt: 1 } }],
					as: 'episodes',
				},
			},
			{
				$project: {
					_id: 1,
					name: 1,
					originalName: 1,
					poster: 1,
					year: 1,
					language: 1,
					type: 1,
					viewed: 1,
					tag: 1,
					tagAscii: 1,
					infoHref: { $concat: ['/info/', '$slug', '-', '$_id'] },
					watchHref: { $concat: ['/watch/', '$slug', '-', '$_id'] },
					slug: 1,
					episodes: { _id: 1, name: 1, links: 1, language: 1, subtitle: 1, message: 1 },
				},
			},
			{ $limit: 1 },
		])
		.then((res) => res[0]);

	if (!film || episodes.length === 0) {
		res.status(404).json({ message: 'Page not found' });
		return;
	}

	let _episodes = {};
	let currentEpisode = episodes[0];

	for (const ep of episodes) {
		ep.href = `${film.watchHref}/${ep._id}`;

		if (ep._id === req.params.episodeId) currentEpisode = ep;

		if (!Array.isArray(_episodes[ep.language])) _episodes[ep.language] = [];
		_episodes[ep.language].push(ep);
	}

	const [header, rightSidebar, relatedFilms, notifications] = await Promise.all([
		loadHeaderData.load(),
		loadRightSidebarData.load(),
		loadRelatedFilms.load(film),
		userId && getNotificationOfUser(userId),
	]);

	res.render('site/watch', {
		header: { ...header, notifications },
		rightSidebar,
		relatedFilms,
		info: { film, episodes: _episodes, currentEpisode },
		SEO: {
			title: `Tập ${currentEpisode.name} - Phim ${film.name} ${film.year}`,
		},
		user: req.session.user,
	});

	// update view in next middleware
	next();
};
