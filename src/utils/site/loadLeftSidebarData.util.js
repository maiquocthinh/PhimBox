const filmModels = require('../../models/film.models');
const configurationModels = require('../../models/configuration.models');
const redisClient = require('../../database/init.redis');
const toTime = require('to-time');

const loadFromDatabase = async () => {
	const projection = {
		_id: 0,
		id: 1,
		name: 1,
		originalName: 1,
		poster: 1,
		status: 1,
		year: 1,
		language: 1,
		duration: 1,
		imdb: 1,
		description: 1,
		slug: 1,
		category: 1,
		country: 1,
	};
	const promiseArray = [
		filmModels.find({ status: 'trailer' }, projection).limit(10),
		configurationModels.findOne({}, { web_tags: 1 }),
	];

	const [listFilmTrailer, { web_tags: webTags }] = await Promise.all(promiseArray);

	return { listFilmTrailer, webTags: webTags.split(',') };
};

const load = async () => {
	return await new Promise((resolve, reject) => {
		redisClient.get('site:leftSidebar', async (error, result) => {
			if (error) reject(error);

			let leftSidebarData = result;
			if (leftSidebarData) {
				resolve(JSON.parse(leftSidebarData));
			} else {
				const { timecache: timeCache } = await configurationModels.findOne({}, { timecache: 1 });

				leftSidebarData = await loadFromDatabase();
				resolve(leftSidebarData);

				redisClient.set(
					'site:leftSidebar',
					JSON.stringify(leftSidebarData),
					'EX',
					toTime(timeCache).seconds(),
					() => {},
				);
			}
		});
	});
};

module.exports = { load };
