'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const nanoidUtil = require('../utils/nanoid.util');

const Episode = new Schema(
	{
		_id: { type: String, default: () => nanoidUtil(7) },
		name: { type: String },
		links: { type: Array },
		filmId: { type: String },
		language: { type: String },
		subtitle: { type: String },
		message: { type: String },
		isError: { type: Boolean, default: false },
	},
	{
		timestamps: true,
	},
);

module.exports = mongoose.model('Episode', Episode);
