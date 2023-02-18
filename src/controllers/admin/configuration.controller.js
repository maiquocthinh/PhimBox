const Configurations = require('../../models/configuration.models');

// ###### API ######

// [PATCH] admin/configuration/update
const configurationUpdate = (req, res) => {
	Configurations.updateOne(
		{},
		{
			web_title: req.body.web_title,
			web_url: req.body.web_url,
			web_description: req.body.web_description,
			web_keyword: req.body.web_keys,
			web_servers: req.body.web_servers,
			web_tags: req.body.web_tags,
			timecache: req.body.timecache,
		},
	)
		.then(() => {
			res.status(200).json({ message: 'Update Configurations Success' });
		})
		.catch((error) => {
			res.status(500).json(error);
		});
};

// ###### PAGE ######

// [GET] admin/configuration
const configuration = (req, res) => {
	Configurations.findOne()
		.then((config) => {
			const timecache = config._doc.timecache;
			console.log(timecache[timecache.length - 1]);
			res.render('admin/configuration', {
				user: req.session.user,
				config: {
					...config._doc,
					timecacheNum: timecache.substr(0, timecache.length - 1),
					timecacheUnit: timecache[timecache.length - 1],
				},
			});
		})
		.catch((error) => {
			res.status(500).json(error);
		});
};

module.exports = { configuration, configurationUpdate };
