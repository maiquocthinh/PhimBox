'use strict';

const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');
const Schema = mongoose.Schema;
const nanoidUtil = require('../utils/nanoid.util');

const Category = new Schema(
	{
		_id: { type: String, default: () => nanoidUtil(7) },
		name: { type: String },
		slug: { type: String, slug: 'name' },
	},
	{
		timestamps: true,
	},
);

Category.plugin(slug);
Category.plugin(mongooseDelete, {
	deletedAt: true,
	overrideMethods: 'all',
});

module.exports = mongoose.model('Category', Category);
