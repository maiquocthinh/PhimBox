const filmModels = require('../../../models/film.models');
const userModels = require('../../../models/user.models');

// View History
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

const deleteFromHistory = async (req, res) => {
	const { epId } = req.params;
	const { username } = req.session.user || {};

	if (!epId) return res.status(400).json({ msg: 'Bad request!' });
	if (!username) return res.status(400).json({ msg: 'Bad request!' });

	try {
		// remove ep in view history
		await userModels.updateOne({ username }, { $pull: { 'films.history': { epId } } });

		return res.status(200).json({ msg: 'Remove success!' });
	} catch (error) {
		return res.status(500).json({ msg: error.message });
	}
};

// Collection
const getCollection = async (req, res) => {
	const username = req.params.username || req.session.user?.username;
	if (!username) return res.status(400).json({ msg: 'Bad Request!' });

	try {
		const result = await userModels.aggregate([
			{ $match: { username } },
			{ $unwind: '$films.collection' },
			{
				$lookup: {
					from: 'films',
					localField: 'films.collection',
					foreignField: '_id',
					as: 'film',
				},
			},
			{ $unwind: '$film' },
			{
				$project: {
					_id: 0,
					film: {
						_id: 1,
						name: 1,
						originalName: 1,
						poster: 1,
						status: 1,
						year: 1,
						language: 1,
						url: { $concat: ['/info/', '$film.slug', '-', '$film._id'] },
					},
				},
			},
		]);

		return res.status(200).json(result?.map(({ film }) => film) || []);
	} catch (error) {
		return res.status(500).json({ msg: error.message });
	}
};

const addIntoCollection = async (req, res) => {
	const { filmId } = req.body;
	const { username } = req.session.user || {};

	if (!filmId) return res.status(400).json({ msg: 'Bad Request!' });
	if (!username) return res.status(400).json({ msg: 'Please login to continue!' });

	try {
		// check film
		const film = await filmModels.findById(filmId, { _id: 1 });
		if (!film) return res.status(400).json({ msg: 'Bad Request!' });

		// check user
		const user = await userModels.findOne({ username }, { films: { collection: 1 } });
		if (!user) return res.status(400).json({ msg: 'Bad Request!' });

		const collection = user?.films?.collection.filter((_filmId) => _filmId !== filmId) || [];

		// update collection
		await userModels.findOneAndUpdate({ username }, { 'films.collection': [filmId, ...collection] });

		return res.status(200).json({ msg: 'Add into collection success!' });
	} catch (error) {
		return res.status(500).json({ msg: error.message });
	}
};

const deleteFromCollection = async (req, res) => {
	const { filmId } = req.params;
	const { username } = req.session.user || {};

	if (!filmId) return res.status(400).json({ msg: 'Bad Request!' });
	if (!username) return res.status(400).json({ msg: 'Bad request!' });

	try {
		// update collection
		await userModels.findOneAndUpdate({ username }, { $pull: { 'films.collection': filmId } });

		return res.status(200).json({ msg: 'Remove success!' });
	} catch (error) {
		return res.status(500).json({ msg: error.message });
	}
};

// Follow
const getAllFollow = async (req, res) => {
	const { username } = req.session.user || {};
	if (!username) return res.status(400).json({ msg: 'Bad Request!' });

	try {
		const result = await userModels.aggregate([
			{ $match: { username } },
			{ $unwind: '$films.follow' },
			{
				$lookup: {
					from: 'films',
					localField: 'films.follow',
					foreignField: '_id',
					as: 'film',
				},
			},
			{ $unwind: '$film' },
			{
				$project: {
					_id: 0,
					film: {
						_id: 1,
						name: 1,
						originalName: 1,
						poster: 1,
						status: 1,
						year: 1,
						language: 1,
						url: { $concat: ['/info/', '$film.slug', '-', '$film._id'] },
					},
				},
			},
		]);

		return res.status(200).json(result?.map(({ film }) => film) || []);
	} catch (error) {
		return res.status(500).json({ msg: error.message });
	}
};

const follow = async (req, res) => {
	const { filmId } = req.body;
	const { username } = req.session.user || {};

	if (!filmId) return res.status(400).json({ msg: 'Bad Request!' });
	if (!username) return res.status(400).json({ msg: 'Please login to continue!' });

	try {
		// check film
		const film = await filmModels.findById(filmId, { _id: 1 });
		if (!film) return res.status(400).json({ msg: 'Bad Request!' });

		// check user
		const user = await userModels.findOne({ username }, { _id: 1, films: { follow: 1 } });
		if (!user) return res.status(400).json({ msg: 'Bad Request!' });

		const follow = user?.films?.follow.filter((_filmId) => _filmId !== filmId) || [];

		// update follow
		await userModels.findOneAndUpdate({ username }, { 'films.follow': [filmId, ...follow] });
		await filmModels.findByIdAndUpdate(filmId, { $addToSet: { followers: user._id } });

		return res.status(200).json({ msg: 'Follow film success!' });
	} catch (error) {
		return res.status(500).json({ msg: error.message });
	}
};
const unfollow = async (req, res) => {
	const { filmId } = req.params;
	const { username } = req.session.user || {};

	if (!filmId) return res.status(400).json({ msg: 'Bad Request!' });
	if (!username) return res.status(400).json({ msg: 'Bad request!' });

	try {
		// check film
		const film = await filmModels.findById(filmId, { _id: 1 });
		if (!film) return res.status(400).json({ msg: 'Bad Request!' });

		// check user
		const user = await userModels.findOne({ username }, { _id: 1 });
		if (!user) return res.status(400).json({ msg: 'Bad Request!' });

		// update follow
		await userModels.findOneAndUpdate({ username }, { $pull: { 'films.follow': filmId } });
		await filmModels.findByIdAndUpdate(filmId, { $push: { followers: user._id } });

		return res.status(200).json({ msg: 'Unfollow film success!' });
	} catch (error) {
		return res.status(500).json({ msg: error.message });
	}
};

const rate = async (req, res) => {
	const { filmId, point } = req.body;
	const { _id: userId } = req.session.user || {};

	if (!filmId && !point) return res.status(400).json({ msg: 'Bad Request!' });
	if (!userId) return res.status(400).json({ msg: 'Please login to rating film!' });

	try {
		// check point
		if (point < 0 || point > 10) return res.status(400).json({ msg: 'Point must be between 0 and 10!' });

		// check film
		const film = await filmModels.findById(filmId, { _id: 1 });
		if (!film) return res.status(400).json({ msg: 'Bad Request!' });

		// update rate
		const isExist = await filmModels.findOne({ _id: filmId, 'rated.userId': userId }, { _id: 1 });
		if (isExist) await filmModels.updateOne({ _id: filmId, 'rated.userId': userId }, { $set: { 'rated.$.point': point } });
		else await filmModels.updateOne({ _id: filmId }, { $addToSet: { rated: { userId: userId, point: point } } });

		// get average rate
		const result = await filmModels.findOne(
			{ _id: filmId },
			{ rate: { point: { $avg: '$rated.point' }, times: { $size: '$rated' } } },
		);
		const { rate } = result._doc;

		if (isExist) return res.status(200).json({ msg: 'Update rating film success!', rate });
		else return res.status(200).json({ msg: 'Rating film success!', rate });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ msg: error.message });
	}
};

module.exports = {
	getHistory,
	deleteFromHistory,
	getCollection,
	addIntoCollection,
	deleteFromCollection,
	getAllFollow,
	follow,
	unfollow,
	rate,
};
