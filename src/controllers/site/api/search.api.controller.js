const filmModels = require('../../../models/film.models');

module.exports = async (req, res) => {
	try {
		const { keyWord } = req.body;

		if (!keyWord) return res.status(400).json([]);

		const films = await filmModels.find(
			{
				$or: [{ name: { $regex: keyWord, $options: 'i' } }, { originalName: { $regex: keyWord, $options: 'i' } }],
			},
			{
				name: 1,
				originalName: 1,
				language: 1,
				status: 1,
				quality: 1,
				slug: { $concat: ['$slug', '-', '$_id'] },
			},
		);

		res.status(200).json(films);
	} catch (error) {
		res.status(500).json(error);
	}
};
