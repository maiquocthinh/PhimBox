const currentDate = new Date();

const getStartOfDay = () => {
	const currentDate = new Date();
	currentDate.setUTCHours(0, 0, 0, 0);
	return currentDate;
};

const getEndOfDay = () => {
	const currentDate = new Date();
	currentDate.setUTCHours(23, 59, 59, 999);
	return currentDate;
};

const getStartOfWeek = () => {
	const dayOfWeek = currentDate.getDay();
	const startOfWeek = new Date(currentDate.getTime() - (dayOfWeek > 0 ? dayOfWeek - 1 : 6) * 24 * 60 * 60 * 1000);

	startOfWeek.setUTCHours(0, 0, 0, 0);

	return startOfWeek;
};

const getEndOfWeek = () => {
	const dayOfWeek = currentDate.getDay();
	const daysUntilEndOfWeek = 7 - dayOfWeek;
	const endOfWeek = new Date(currentDate.getTime() + daysUntilEndOfWeek * 24 * 60 * 60 * 1000);

	endOfWeek.setUTCHours(23, 59, 59, 999);

	return endOfWeek;
};

const getStartOfMonth = () => {
	const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

	startOfMonth.setUTCHours(0, 0, 0, 0);

	return startOfMonth;
};

const getEndOfMonth = () => {
	const currentMonth = currentDate.getMonth();
	const nextMonth = currentMonth + 1;
	const nextMonthFirstDay = new Date(currentDate.getFullYear(), nextMonth, 1);
	const endOfMonth = new Date(nextMonthFirstDay.getTime() - 1);

	endOfMonth.setUTCHours(23, 59, 59, 999);

	return endOfMonth;
};

module.exports = { getStartOfDay, getEndOfDay, getStartOfWeek, getEndOfWeek, getStartOfMonth, getEndOfMonth };
