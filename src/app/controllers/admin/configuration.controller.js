const Configurations = require('../../models/configuration.models');

// [GET] admin/configuration
const configuration = (req, res) => {
	Configurations.findOne()
		.then((config) => {
			res.render('admin/configuration', {
				user: { ...req.user._doc },
				config: { ...config._doc },
			});
		})
		.catch((error) => {
			res.status(500).json(error);
		});
};

// [PATCH] admin/configuration/update
const configurationUpdate = (req, res, next) => {
	Configurations.updateOne(
		{},
		{
			config_web_title: req.body.web_title,
			config_web_url: req.body.web_url,
			config_web_description: req.body.web_description,
			config_web_keyword: req.body.web_keys,
			config_web_servers: req.body.web_servers,
			config_web_tags: req.body.web_tags,
			config_timecache: req.body.timecache,
		},
	)
		.then(() => {
			res.status(200).json({ message: 'Update Configurations Success' });
		})
		.catch((error) => {
			res.status(500).json(error);
		});
};

module.exports = { configuration, configurationUpdate };
