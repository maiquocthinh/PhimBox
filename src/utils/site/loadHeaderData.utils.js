const categoryModels = require('../../models/category.models');
const countryModels = require('../../models/country.models');
const configurationModels = require('../../models/configuration.models');
const redisClient = require('../../database/init.redis');
const toTime = require('to-time');

const loadFromDatabase = async () => {
	const { title, baseURL } = await configurationModels.findOne({}, { web_title: 1, web_url: 1 }).then((result) => {
		const { web_title: title, web_url: baseURL } = result;
		return { title, baseURL };
	});

	const categories = await categoryModels.find({}, { name: 1, slug: 1 }).then((results) =>
		results.map(({ name, slug }) => ({
			name,
			href: baseURL + '/category/' + slug,
		})),
	);

	const countries = await countryModels.find({}, { name: 1, slug: 1 }).then((results) =>
		results.map(({ name, slug }) => ({
			name,
			href: baseURL + '/country/' + slug,
		})),
	);

	return { title, baseURL, categories, countries };
};

const load = async () => {
	return await new Promise((resolve, reject) => {
		redisClient.get('site:header', async (error, result) => {
			if (error) reject(error);

			let headerData = result;
			if (headerData) {
				resolve(JSON.parse(headerData));
			} else {
				headerData = await loadFromDatabase();
				resolve(headerData);

				const { timecache: timeCache } = await configurationModels.findOne({}, { timecache: 1 });
				redisClient.set('site:header', JSON.stringify(headerData), 'EX', toTime(timeCache).seconds(), () => {});
			}
		});
	});
};

module.exports = { load };
