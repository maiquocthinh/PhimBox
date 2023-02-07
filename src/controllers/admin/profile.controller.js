// [GET] admin/profile
const profile = (req, res) => {
	res.render('admin/profile', {
		user: { ...req.user._doc },
	});
};

module.exports = { profile };
