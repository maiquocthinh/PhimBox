const episodeModels = require('../../../models/episode.models');
module.exports = (req, res) => {
	const { episodeId } = req.body;

	if (!episodeId) return res.status(400).json({ message: 'Missing a required parameter' });

	episodeModels
		.findByIdAndUpdate(episodeId, { isError: true })
		.then(() => {
			return res.status(200).json({ message: 'Report error success.' });
		})
		.catch((err) => {
			return res.status(500).json({ error: err.message });
		});
};
