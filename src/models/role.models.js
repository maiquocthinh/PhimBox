'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const nanoidUtil = require('../utils/nanoid.util');

const Role = new Schema(
	{
		_id: { type: String, default: () => nanoidUtil(7) },
		name: { type: String },
		permissions: { type: Array },
	},
	{
		timestamps: true,
	},
);

module.exports = mongoose.model('Role', Role);
