'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userRole = new Schema({
	userId: { type: String },
	roleId: { type: String },
});

module.exports = mongoose.model('user_role', userRole, 'user_role');
