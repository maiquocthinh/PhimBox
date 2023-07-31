const roleModels = require('../../models/role.models');
const userModels = require('../../models/user.models');
const { getUserLevelHtml } = require('../../utils/ajaxUsers.util');
const { generateHashPassword } = require('../../utils');
const PERMISSION = require('../../config/permission.config');

// ###### API ######
// [PATCH] admin/profile/update/:id
const update = async (req, res) => {
	const { _id: userId } = req.session.user || {};
	const { fullname, username, email, password, avatar, role: roleId } = req.body;

	// check permission to change role
	if (roleId) {
		const [{ role }] = await userModels.aggregate([
			{ $match: { _id: userId } },
			{
				$lookup: {
					from: 'roles',
					localField: 'roleId',
					foreignField: '_id',
					as: 'role',
				},
			},
			{ $unwind: '$role' },
			{ $project: { role: { permissions: 1 } } },
		]);

		if (!role?.permissions?.includes(PERMISSION['set user role']))
			return res.status(500).json({ message: 'You have not permission.' });
	}

	// allow to change information if it is owner account
	if (userId !== req.params.id) return res.status(500).json({ message: 'You have not permission.' });

	try {
		// hash password
		const hashPassword = password ? generateHashPassword(password) : undefined;

		// update info of user
		await userModels.findByIdAndUpdate(userId, {
			fullname,
			username,
			email,
			password: hashPassword,
			avatar,
			roleId: !!roleId ? roleId : undefined,
		});

		// change user info in current session
		if (userId === req.params.id) {
			const user = req.session.user;
			req.session.user = {
				...user,
				fullname: fullname || user.fullname,
				username: username || user.username,
				email: email || user.email,
				avatar: avatar || user.avatar,
			};
		}

		return res.status(200).json({ message: 'Change profile success.' });
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

// ###### PAGE ######
// [GET] admin/profile
const profile = async (req, res) => {
	const { _id: userId } = req.session.user || {};

	try {
		// get all role
		const roles = await roleModels.find({}, { _id: 1, name: 1 });

		// get role of user
		const [user] = await userModels.aggregate([
			{ $match: { _id: userId } },
			{
				$lookup: {
					from: 'roles',
					localField: 'roleId',
					foreignField: '_id',
					as: 'role',
				},
			},
			{ $unwind: '$role' },
			{
				$addFields: {
					createdAt: { $dateToString: { format: '%H:%M:%S %d/%m/%Y', date: '$createdAt' } },
					updatedAt: { $dateToString: { format: '%H:%M:%S %d/%m/%Y', date: '$createdAt' } },
				},
			},
			{ $project: { password: 0, films: 0, limit: 0 } },
		]);

		const levelLabel = getUserLevelHtml(user.role.permissions);

		return res.render('admin/profile', {
			user,
			roles,
			levelLabel,
		});
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

module.exports = { profile, update };
