'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Role = new Schema(
	{
		name: { type: String },
		permissions: { type: Array },
	},
	{
		timestamps: true,
	},
);

module.exports = mongoose.model('Role', Role);
