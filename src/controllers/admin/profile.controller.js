const roleModels = require('../../models/role.models');
const userModels = require('../../models/user.models');
const PERMISSIONS = require('../../config/permission.config');
const userRoleModels = require('../../models/userRole.models');
const { getUserLevelHtml } = require('../../utils/ajaxUsers.util');

// ###### API ######
// [PATCH] admin/profile/update/:id
const update = (req, res) => {
	const userId = req.session.user._id;
	const { email, name, password, avatar } = req.body;

	if (userId !== req.params.id) return res.status(500).json({ message: 'You have not permission.' });

	try {
		userModels.findByIdAndUpdate(userId, { email, name, password, avatar }).then(async () => {
			// change user info in current session
			if (req.session.user._id === req.params.id) {
				const user = await userModels.findById(req.params.id);
				user.password = undefined;
				req.session.user = user;
			}
			return res.status(200).json({ message: 'Change profile success.' });
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: error.message });
	}
};

// ###### PAGE ######
// [GET] admin/profile
const profile = async (req, res) => {
	try {
		const roles = await roleModels.find({}, { _id: 1, name: 1 });
		const userRole = await userRoleModels.aggregate([
			{
				$match: { userId: req.session.user._id },
			},
			{
				$limit: 1,
			},
			{
				$addFields: {
					roleId: { $toObjectId: '$roleId' },
				},
			},
			{
				$lookup: {
					from: 'roles',
					localField: 'roleId',
					foreignField: '_id',
					as: 'role',
				},
			},
			{
				$unwind: '$role',
			},
		]);
		const levelLabel = getUserLevelHtml(userRole[0].role.permissions);

		res.render('admin/profile', {
			user: req.session.user,
			roles,
			levelLabel,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: error.message });
	}
};

module.exports = { profile, update };
