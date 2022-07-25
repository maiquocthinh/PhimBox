'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Episode = new Schema({
    _id: { type: Schema.ObjectId, },
    episode_id: { type: Number },
    episode_name: { type: String },
    episode_url: { type: Array },
    episode_film_id: { type: Number },
    episode_language: { type: Number },
    episode_subtitle: { type: String },
    episode_message: { type: String },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Episode', Episode);