'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const nanoidUtil = require('../utils/nanoid.util');

const Notification = new Schema(
	{
		_id: { type: String, default: () => nanoidUtil(7) },
		title: { type: String, required: true },
		image: { type: String, required: true },
		url: { type: String, default: '' },
		read: { type: Boolean, default: false },
		userId: { type: String, required: true },
	},
	{
		timestamps: true,
	},
);

module.exports = mongoose.model('Notification', Notification);
