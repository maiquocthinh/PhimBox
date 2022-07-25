'use strict';

const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const mongooseDelete = require('mongoose-delete');
const Schema = mongoose.Schema;

const User = new Schema({
    // _id: { type: Schema.ObjectId, },
    user_id: { type: Number },
    user_email: { type: String },
    user_name: { type: String },
    user_pass: { type: String },
    user_level: { type: Number },
    user_status: { type: Number, default: 1 },
    user_avatar: { type: String },
}, {
    timestamps: true,
});

User.plugin(AutoIncrement,{
    inc_field: 'user_id',
    start_seq: 1,
});
User.plugin(mongooseDelete,{
    deletedAt: true,
    overrideMethods: 'all',
});

module.exports = mongoose.model('User', User);