const userModels = require('../../models/user.models');
const filmModels = require('../../models/film.models');
const episodeModels = require('../../models/episode.models');

// [GET] admin/dashboard
const dashboard = (req, res) => {
	Promise.all([
		userModels.countDocuments({}),
		filmModels.countDocuments({}),
		episodeModels.countDocuments({}),
		filmModels
			.aggregate([
				{
					$lookup: {
						from: 'users',
						localField: 'createdBy',
						foreignField: '_id',
						as: 'createdBy',
					},
				},
				{
					$project: {
						id: 1,
						poster: 1,
						originalName: 1,
						type: 1,
						status: 1,
						year: 1,
						uploadBy: 1,
						createdAt: 1,
						viewed: 1,
						viewable: 1,
						createdBy: { username: '$createdBy.username', avatar: '$createdBy.avatar' },
					},
				},
			])
			.sort({ _id: -1 })
			.limit(10),
		userModels.find({}, { password: 0 }).sort({ createdAt: -1 }).limit(10),
		userModels.aggregate([
			{ $project: { numOfFollow: { $size: '$films.follow' } } },
			{ $group: { _id: null, totalFollow: { $sum: '$numOfFollow' } } },
		]),
	])
		.then(([totalUser, totalFilm, totalEpisode, Films, Users, [{ totalFollow }]]) => {
			const totalCount = {
				user: totalUser,
				film: totalFilm,
				episode: totalEpisode,
				follow: totalFollow,
			};
			const films = Films.map((film) => film);

			const users = Users.map((user) => user);

			res.render('admin/dashboard', {
				user: req.session.user,
				totalCount,
				films,
				users,
			});
		})
		.catch((error) => {
			res.status(500).json(error);
		});
};

module.exports = { dashboard };
