const filmModels = require('../../models/film.models');
const loadHeaderData = require('../../utils/site/loadHeaderData.utils');
const loadRightSidebarData = require('../../utils/site/loadRightSidebarData.util');
const loadRelatedFilms = require('../../utils/site/loadRelatedFilms.utils');
const { getStartOfWeek, getEndOfWeek, getStartOfMonth, getEndOfMonth } = require('../../utils/date.util');

const updateView = (filmId) => {
	const currentDate = new Date();

	filmModels
		.findOneAndUpdate(
			{
				_id: filmId,
			},
			[
				{
					$set: {
						viewed: { $add: ['$viewed', 1] },
						viewedDay: {
							$cond: {
								if: {
									$eq: [
										{ $dateToString: { format: '%Y-%m-%d', date: '$viewedDay.date' } },
										{ $dateToString: { format: '%Y-%m-%d', date: currentDate } },
									],
								},
								then: {
									viewed: { $add: ['$viewedDay.viewed', 1] },
									date: currentDate,
								},
								else: {
									viewed: 1,
									date: currentDate,
								},
							},
						},
						viewedWeek: {
							$cond: {
								if: {
									$and: [
										{ $gte: ['$viewedWeek.date', getStartOfWeek()] },
										{ $lte: ['$viewedWeek.date', getEndOfWeek()] },
									],
								},
								then: {
									viewed: { $add: ['$viewedWeek.viewed', 1] },
									date: currentDate,
								},
								else: {
									viewed: 1,
									date: currentDate,
								},
							},
						},
						viewedMonth: {
							$cond: {
								if: {
									$and: [
										{ $gte: ['$viewedMonth.date', getStartOfMonth()] },
										{ $lte: ['$viewedMonth.date', getEndOfMonth()] },
									],
								},
								then: {
									viewed: { $add: ['$viewedMonth.viewed', 1] },
									date: currentDate,
								},
								else: {
									viewed: 1,
									date: currentDate,
								},
							},
						},
					},
				},
			],
		)
		.catch((err) => {
			console.log(err);
		});
};

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
					infoHref: { $concat: ['/info/', '$slug', '-', '$_id'] },
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
		ep.href = `/watch/${film.slug}/${ep._id}`;

		if (ep._id === req.params.episodeId) currentEpisode = ep;

		if (!Array.isArray(_episodes[ep.language])) _episodes[ep.language] = [];
		_episodes[ep.language].push(ep);
	}

	const [header, rightSidebar, relatedFilms] = await Promise.all([
		loadHeaderData.load(),
		loadRightSidebarData.load(),
		loadRelatedFilms.load(film),
	]);

	res.render('site/watch', {
		header,
		rightSidebar,
		relatedFilms,
		info: { film, episodes: _episodes, currentEpisode },
		SEO: {
			title: `Tập ${currentEpisode.name} - Phim ${film.name} ${film.year}`,
		},
	});

	// update view
	updateView(filmId);
};
