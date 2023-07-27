const playerHelper = require('../../../helpers/player.helper');
const episodeModels = require('../../../models/episode.models');

module.exports = async (req, res) => {
	const { episodeId, serverId } = req.body;

	if (!episodeId) return res.status(400).json({ message: 'Missing a required parameter' });

	const { film, ...episode } = await episodeModels
		.aggregate([
			{ $match: { _id: episodeId } },
			{
				$lookup: {
					from: 'films',
					foreignField: '_id',
					localField: 'filmId',
					as: 'film',
				},
			},
			{
				$unwind: '$film',
			},
			{
				$project: {
					_id: 1,
					name: 1,
					links: 1,
					subtitle: 1,
					language: 1,
					film: { _id: 1, name: 1, year: 1, backdrops: 1, slug: 1 },
				},
			},
		])
		.then((res) => res[0]);

	if (!film && !episode) return res.status(400).json({ message: 'Episode ID is wrong' });

	// find next ep & prev ep
	let next, prev;

	const listEp = await episodeModels
		.find({ filmId: film._id, language: episode.language }, { _id: 1, name: 1 })
		.sort({ createdAt: 1 });

	listEp.forEach((ep, index) => {
		if (ep._id === episode._id) {
			const prevEp = listEp[index - 1]?._doc;
			const nextEp = listEp[index + 1]?._doc;

			prev = prevEp ? { ...prevEp, href: `/watch/${film.slug}-${film._id}/${prevEp._id}` } : undefined;
			next = nextEp ? { ...nextEp, href: `/watch/${film.slug}-${film._id}/${nextEp._id}` } : undefined;
		}
	});

	return res.status(200).json({
		image: film.backdrops,
		title: `Tập ${episode.name} - Phim ${film.name} (${film.year})`,
		links: await playerHelper(episode.links[parseInt(serverId) - 1 || 0]),
		subtitle: episode.subtitle || undefined,
		servers: !serverId
			? episode.links.map((_, index) => ({
					name: 'Server#' + (index + 1),
					id: index + 1,
			  }))
			: undefined,
		prev,
		next,
	});
};
