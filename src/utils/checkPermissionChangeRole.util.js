const PERMISSION = require('../config/permission.config');
const userModels = require('../models/user.models');

module.exports = async (userId) => {
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

	return role?.permissions?.includes(PERMISSION['set user role']);
};
