'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Configuration = new Schema(
	{
		web_title: { type: String },
		web_url: { type: String },
		web_description: { type: String },
		web_keyword: { type: String },
		web_servers: { type: String },
		web_tags: { type: String },
		timecache: { type: String },
	},
	{
		timestamps: true,
	},
);

module.exports = mongoose.model('Configuration', Configuration);
