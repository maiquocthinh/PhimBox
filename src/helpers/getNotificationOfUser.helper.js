const notificationModels = require('../models/notification.models');

module.exports = async (userId) =>
	await notificationModels.aggregate([
		{ $match: { userId } },
		{
			$project: {
				_id: 1,
				title: 1,
				image: 1,
				url: 1,
				read: 1,
				createdAt: {
					$dateToString: {
						format: '%H:%M:%S %d/%m/%Y',
						date: '$createdAt',
					},
				},
			},
		},
	]);
