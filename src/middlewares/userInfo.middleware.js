const userModels = require('../models/user.models');

const limitChangeInfo = async (req, res, next) => {
	const REQUEST_LIMIT_PER_DAY = 3;

	const { username } = req.session.user || {};
	if (!username) return res.status(403).json({ msg: 'Access denied. Only user of system are permitted for change info' });

	const { limit: { timesChangeInfo } = {} } = await userModels.findOne({ username }, { limit: 1 });

	const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
	const requestsInOneDay = timesChangeInfo?.filter((time) => new Date(time) > oneDayAgo) || [];

	if (requestsInOneDay?.length < REQUEST_LIMIT_PER_DAY) {
		await userModels.findOneAndUpdate({ username }, { 'limit.timesChangeInfo': [...requestsInOneDay, Date.now()] });
		return next();
	} else {
		return res
			.status(429)
			.json({ msg: `Info are change only ${REQUEST_LIMIT_PER_DAY} times per day. Please try again later.` });
	}
};

const limitChangeAvatar = async (req, res, next) => {
	const REQUEST_LIMIT_PER_DAY = 3;

	const { username } = req.session.user || {};
	if (!username) return res.status(403).json({ msg: 'Access denied. Only user of system are permitted for upload' });

	const { limit: { timesChangeAvatar } = {} } = await userModels.findOne({ username }, { limit: 1 });

	const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
	const requestsInOneDay = timesChangeAvatar?.filter((time) => new Date(time) > oneDayAgo) || [];

	if (requestsInOneDay?.length < REQUEST_LIMIT_PER_DAY) {
		await userModels.findOneAndUpdate({ username }, { 'limit.timesChangeAvatar': [...requestsInOneDay, Date.now()] });
		return next();
	} else {
		return res
			.status(429)
			.json({ msg: `Avatar are change only ${REQUEST_LIMIT_PER_DAY} times per day. Please try again later.` });
	}
};

module.exports = {
	limitChangeInfo,
	limitChangeAvatar,
};
