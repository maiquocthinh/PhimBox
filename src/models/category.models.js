'use strict';

const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');
const Schema = mongoose.Schema;

const Category = new Schema(
	{
		id: { type: String },
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
