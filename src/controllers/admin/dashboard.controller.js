const Users = require('../../models/user.models');
const Films = require('../../models/film.models');
const Episodes = require('../../models/episode.models');

// [GET] admin/dashboard
const dashboard = (req, res) => {
	Promise.all([
		Users.countDocuments({}),
		Films.countDocuments({}),
		Episodes.countDocuments({}),
		Films.aggregate([
			{
				$addFields: {
					createdBy: {
						$toObjectId: '$createdBy',
					},
				},
			},
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
					createdBy: { name: '$createdBy.name', avatar: '$createdBy.avatar' },
				},
			},
			// { $unwind: '$createdBy' },
		])
			.sort({ _id: -1 })
			.limit(10),
		Users.find({}, { user_pass: 0 }).sort({ _id: -1 }).limit(10),
	])
		.then(([totalUser, totalFilm, totalEpisode, Films, Users]) => {
			const totalCount = {
				user: totalUser,
				film: totalFilm,
				episode: totalEpisode,
			};
			const films = Films.reduce((films, currentFilm) => {
				films.push(currentFilm);
				return films;
			}, []);

			const users = Users.reduce((users, currentUser) => {
				users.push(currentUser._doc);
				return users;
			}, []);

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
