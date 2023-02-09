// [GET] admin/profile
const profile = (req, res) => {
	res.render('admin/profile', {
		user: req.session.user,
	});
};

module.exports = { profile };
