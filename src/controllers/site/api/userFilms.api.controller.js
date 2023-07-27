const episodeModels = require('../../../models/episode.models');
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
					name: {
						$concat: ['Tập ', '$episode.name', ' - ', '$film.name'],
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

const addHistory = async (req, res) => {
	const { epId } = req.body;
	const { username } = req.session.user || {};

	if (!epId) return res.status(400).json({ msg: 'Bad request' });
	if (!username) return res.status(400).json({ msg: 'Bad request' });

	try {
		// check ep
		const episode = await episodeModels.findById(epId, { _id: 1 });
		if (!episode) return res.status(400).json({ msg: 'Bad request' });

		//check username
		const user = await userModels.findOne({ username }, { films: { history: 1 } });
		if (!user) return res.status(400).json({ msg: 'Bad request' });

		// limit under 50eps in history
		const histories = (() => {
			const listHistory = user?.films?.history?.slice(0, 50).filter((history) => history && history?.epId !== epId) || [];
			if (listHistory.length < 50) return listHistory;
			return listHistory.slice(0, 49);
		})();

		// update view history
		await userModels.findOneAndUpdate(
			{ username },
			{
				films: {
					history: [{ epId }, ...histories],
				},
			},
		);

		return res.status(200).json({ msg: 'Add into history success!' });
	} catch (error) {
		return res.status(500).json({ msg: error.message });
	}
};

const deleteHistory = async (req, res) => {
	const { epId } = req.params;
	const { username } = req.session.user || {};

	if (!epId) return res.status(400).json({ msg: 'Bad request!' });
	if (!username) return res.status(400).json({ msg: 'Bad request' });

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

module.exports = { getHistory, addHistory, deleteHistory };
