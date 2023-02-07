'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Configuration = new Schema({
    // _id: { type: Schema.ObjectId, },
    config_web_title : { type: String },
    config_web_url: { type: String },
    config_web_description: { type: String },
    config_web_keyword: { type: String },
    config_web_servers: { type: String },
    config_web_tags: { type: String },
    config_timecache: { type: Number },
}, {
    timestamps: true,
});


module.exports = mongoose.model('Configuration', Configuration);