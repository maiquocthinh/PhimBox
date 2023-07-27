const userModels = require('../../../models/user.models');

const getHistory = async (req, res) => {
	const { username } = req.session.user || {};
	if (!username) return res.status(400).json({ msg: 'Bad request' });

	try {
		const results = await userModels.aggregate([
			{
				$match: {
					username,
				},
			},
			{ $unwind: '$films.history' },
			{
				$lookup: {
					from: 'episodes',
					localField: 'films.history.epId',
					foreignField: '_id',
					as: 'episode',
				},
			},
			{ $unwind: '$episode' },
			{
				$lookup: {
					from: 'films',
					localField: 'episode.filmId',
					foreignField: '_id',
					as: 'film',
				},
			},
			{ $unwind: '$film' },
			{
				$project: {
					_id: 0,
					id: '$episode._id',
					name: {
						$concat: ['Tập ', '$episode.name', ' - ', '$film.name'],
					},
					poster: '$film.poster',
					url: {
						$concat: ['/watch/', '$film.slug', '-', '$film._id', '/', '$episode._id'],
					},
					date: {
						$dateToString: {
							format: '%H:%M:%S %d/%m/%Y',
							date: '$films.history.date',
						},
					},
				},
			},
		]);

		return res.status(200).json(results);
	} catch (error) {
		return res.status(500).json({ msg: error.message });
	}
};

const deleteHistory = async (req, res) => {
	const { epId } = req.params;
	const { username } = req.session.user || {};

	if (!epId) return res.status(400).json({ msg: 'Bad request!' });
	if (!username) return res.status(400).json({ msg: 'Bad request!' });

	try {
		// remove ep in view history
		await userModels.updateOne(
			{ username },
			{
				$pull: { 'films.history': { epId } },
			},
		);

		return res.status(200).json({ msg: 'Remove success!' });
	} catch (error) {
		return res.status(500).json({ msg: error.message });
	}
};

module.exports = { getHistory, deleteHistory };
