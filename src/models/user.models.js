'use strict';

const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const Schema = mongoose.Schema;

const User = new Schema(
	{
		id: { type: String },
		email: { type: String },
		name: { type: String },
		password: { type: String },
		status: { type: Number, default: 1 },
		avatar: { type: String },
	},
	{
		timestamps: true,
	},
);

User.plugin(mongooseDelete, {
	deletedAt: true,
	overrideMethods: 'all',
});

module.exports = mongoose.model('User', User);
