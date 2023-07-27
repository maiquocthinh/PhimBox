const userModels = require('../models/user.models');
const episodeModels = require('../models/episode.models');

module.exports = async (req, res, next) => {
	const { username } = req.session?.user || {};
	const { episodeId: epId, serverId } = req.body;

	if (!username) return next();
	if (serverId) return next();

	//check username
	const user = await userModels.findOne({ username }, { films: { history: 1 } });
	if (!user) return res.status(400).json({ msg: 'Bad request' });

	// check ep
	const episode = await episodeModels.findById(epId, { _id: 1 });
	if (!episode) return res.status(400).json({ msg: 'Bad request' });

	// limit under 50eps in history
	const histories = (() => {
		const histories = user?.films?.history?.slice(0, 50).filter((history) => history && history?.epId !== epId) || [];
		if (histories.length < 50) return histories;
		return histories.slice(0, 49);
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

	return next();
};
