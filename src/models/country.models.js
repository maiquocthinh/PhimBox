'use strict';

const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');
const Schema = mongoose.Schema;

const Country = new Schema(
	{
		id: { type: String },
		name: { type: String },
		slug: { type: String, slug: 'name' },
	},
	{
		timestamps: true,
	},
);

Country.plugin(slug);
Country.plugin(mongooseDelete, {
	deletedAt: true,
	overrideMethods: 'all',
});

module.exports = mongoose.model('Country', Country);
