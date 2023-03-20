const roleModels = require('../../models/role.models');

// [GET] admin/profile
const profile = async (req, res) => {
	try {
		const roles = await roleModels.find({}, { _id: 1, name: 1 });

		res.render('admin/profile', {
			user: req.session.user,
			roles,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: error.message });
	}
};

module.exports = { profile };
