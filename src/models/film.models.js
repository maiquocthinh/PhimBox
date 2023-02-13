'use strict';

const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');
const Schema = mongoose.Schema;

const Film = new Schema(
	{
		id: { type: String },
		name: { type: String },
		originalName: { type: String },
		status: { type: String },
		viewable: { type: Boolean },
		poster: { type: String },
		backdrops: { type: String },
		backdropsCanonical: { type: String },
		logo: { type: String },
		category: { type: Array },
		country: { type: Array },
		episodes: { type: Array },
		trailer: { type: String },
		duration: { type: String },
		quality: { type: String },
		year: { type: Number },
		imdb: { type: String },
		language: { type: String },
		inCinema: { type: String },
		recommend: { type: String },
		canonical: { type: String },
		type: { type: String },
		notify: { type: String },
		description: { type: String },
		info: { type: String },
		tag: { type: Array },
		tagAscii: { type: Array },
		slug: { type: String, slug: 'name' },
		viewed: { type: Number, default: 0 },
		viewedDay: { type: Number, default: 0 },
		viewedWeek: { type: Number, default: 0 },
		viewedMonth: { type: Number, default: 0 },
		createdBy: { type: String },
		updatedBy: { type: String },
	},
	{
		timestamps: true,
	},
);

Film.plugin(slug);
Film.plugin(mongooseDelete, {
	deletedAt: true,
	overrideMethods: 'all',
});

module.exports = mongoose.model('Film', Film);
