'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Episode = new Schema(
	{
		id: { type: String },
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
