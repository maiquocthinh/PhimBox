const userModels = require('../models/user.models');

const limitChangeInfo = async (req, res, next) => {
	const REQUEST_LIMIT_PER_DAY = 3;
	const { username } = req.body;

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

module.exports = {
	limitChangeInfo,
};
