'use strict';

const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const Schema = mongoose.Schema;
const nanoidUtil = require('../utils/nanoid.util');
const { userStatus } = require('../config/constants');

const User = new Schema(
	{
		_id: { type: String, default: () => nanoidUtil(7) },
		email: { type: String, required: true },
		fullname: { type: String, required: true },
		username: { type: String, required: true },
		password: { type: String, required: true },
		status: { type: Number, default: userStatus.ACTIVED },
		avatar: { type: String, default: 'https://i.imgur.com/G5jDQjo.jpg' },
		descript: { type: String, default: '' },
		limit: {
			timesResetPassword: { type: [Date], default: [] },
			timesChangeInfo: { type: [Date], default: [] },
			timesChangeAvatar: { type: [Date], default: [] },
		},
		films: {
			history: [
				{
					_id: 0,
					epId: { type: String },
					date: { type: Date, default: Date.now },
				},
			],
			collection: [String],
			follow: [String],
		},
	},
	{
		timestamps: true,
	},
);

// middle ware handle error duplicate key
User.post('save', function (error, doc, next) {
	if (error.name === 'MongoServerError' && error.code === 11000) {
		const fieldWithError = Object.keys(error.keyPattern)[0];
		const fieldValue = error.keyValue[fieldWithError];

		switch (fieldWithError) {
			case 'email':
				next(new Error(`Email "${fieldValue}" is already exists in the system.`));
				break;
			case 'username':
				next(new Error(`Username "${fieldValue}" is already exists in the system.`));
				break;
			default:
				next(new Error(`Field "${fieldWithError}" with value "${fieldValue}" already exists in the system.`));
		}
	} else {
		next();
	}
});

User.plugin(mongooseDelete, {
	deletedAt: true,
	overrideMethods: 'all',
});

module.exports = mongoose.model('User', User);
