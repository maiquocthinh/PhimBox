const Users = require('../../models/user.models');
const Films = require('../../models/film.models');
const Episodes = require('../../models/episode.models');

// [GET] admin/dashboard
const dashboard = (req, res) => {
	Promise.all([
		Users.countDocuments({}),
		Films.countDocuments({}),
		Episodes.countDocuments({}),
		Films.find(
			{},
			{
				film_id: 1,
				film_img: 1,
				film_originalname: 1,
				film_year: 1,
				film_uploadby: 1,
				updatedAt: 1,
			},
		)
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
				films.push(currentFilm._doc);
				return films;
			}, []);
			const users = Users.reduce((users, currentUser) => {
				users.push(currentUser._doc);
				return users;
			}, []);

			res.render('admin/dashboard', {
				user: { ...req.user._doc },
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
