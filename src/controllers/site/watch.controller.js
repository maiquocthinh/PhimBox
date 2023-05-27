const filmModels = require('../../models/film.models');
const loadHeaderData = require('../../utils/site/loadHeaderData.utils');
const loadLeftSidebarData = require('../../utils/site/loadLeftSidebarData.util');
module.exports = async (req, res) => {
	const { filmSlug, filmId } = req.params;
	const { episodes, ...film } = await filmModels
		.aggregate([
			{ $match: { _id: filmId, slug: filmSlug } },
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
					slug: { $concat: ['$slug', '-', '$_id'] },
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

	// console.log(episodes.length);

	let _episodes = {};
	let currentEpisode = episodes[0];

	for (const ep of episodes) {
		ep.href = `/watch/${film.slug}/${ep._id}`;

		if (ep._id === req.params.episodeId) currentEpisode = ep;

		if (!Array.isArray(_episodes[ep.language])) _episodes[ep.language] = [];
		_episodes[ep.language].push(ep);
	}

	res.render('site/watch', {
		header: await loadHeaderData.load(),
		leftSidebar: await loadLeftSidebarData.load(),
		info: { film, episodes: _episodes, currentEpisode },
		SEO: {
			title: `Tập ${currentEpisode.name} - Phim ${film.name} ${film.year}`,
		},
	});
};
