const notificationModels = require('../../../models/notification.models');

const getAllNotification = async (req, res) => {
	const { _id: userId } = req.session.user || {};
	if (!userId) return res.status(400).json({ msg: 'Bad Request!' });

	try {
		const notifications = await notificationModels.find({ userId });

		return res.status(200).json(notifications);
	} catch (error) {
		return res.status(500).json({ msg: error.message });
	}
};

const readNotification = async (req, res) => {
	const { username } = req.session.user || {};
	if (!username) return res.status(400).json({ msg: 'Bad Request!' });

	const { notifyId } = req.params;

	try {
		// update notification
		await notificationModels.findOneAndUpdate({ _id: notifyId }, { read: true });

		return res.status(200).json({ msg: 'Read notification success!' });
	} catch (error) {
		return res.status(500).json({ msg: error.message });
	}
};
const readAllNotification = async (req, res) => {
	const { _id: userId } = req.session.user || {};
	if (!userId) return res.status(400).json({ msg: 'Bad Request!' });

	try {
		// update notification
		await notificationModels.updateMany({ userId }, { read: true });

		return res.status(200).json({ msg: 'Read all notification success!' });
	} catch (error) {
		return res.status(500).json({ msg: error.message });
	}
};

module.exports = {
	getAllNotification,
	readNotification,
	readAllNotification,
};
