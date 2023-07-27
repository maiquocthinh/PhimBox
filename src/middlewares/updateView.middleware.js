const filmModels = require('../models/film.models');
const { getStartOfWeek, getEndOfWeek, getStartOfMonth, getEndOfMonth } = require('../utils/date.util');

module.exports = async (req, res) => {
	const { filmId } = req.params;

	const currentDate = new Date();

	filmModels
		.findOneAndUpdate(
			{
				_id: filmId,
			},
			[
				{
					$set: {
						viewed: { $add: ['$viewed', 1] },
						viewedDay: {
							$cond: {
								if: {
									$eq: [
										{ $dateToString: { format: '%Y-%m-%d', date: '$viewedDay.date' } },
										{ $dateToString: { format: '%Y-%m-%d', date: currentDate } },
									],
								},
								then: {
									viewed: { $add: ['$viewedDay.viewed', 1] },
									date: currentDate,
								},
								else: {
									viewed: 1,
									date: currentDate,
								},
							},
						},
						viewedWeek: {
							$cond: {
								if: {
									$and: [
										{ $gte: ['$viewedWeek.date', getStartOfWeek()] },
										{ $lte: ['$viewedWeek.date', getEndOfWeek()] },
									],
								},
								then: {
									viewed: { $add: ['$viewedWeek.viewed', 1] },
									date: currentDate,
								},
								else: {
									viewed: 1,
									date: currentDate,
								},
							},
						},
						viewedMonth: {
							$cond: {
								if: {
									$and: [
										{ $gte: ['$viewedMonth.date', getStartOfMonth()] },
										{ $lte: ['$viewedMonth.date', getEndOfMonth()] },
									],
								},
								then: {
									viewed: { $add: ['$viewedMonth.viewed', 1] },
									date: currentDate,
								},
								else: {
									viewed: 1,
									date: currentDate,
								},
							},
						},
					},
				},
			],
		)
		.catch((err) => {
			console.log(err);
		});
};
