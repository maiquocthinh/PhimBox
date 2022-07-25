'use strict';

const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');
const Schema = mongoose.Schema;

const Film = new Schema({
    // _id: { type: Schema.ObjectId, },
    film_id: { type: Number, },
    film_name: { type: String, },
    film_originalname: { type: String, },
    film_status: { type: String, },
    film_img: { type: String, },
    film_imgbn: { type: String, },
    film_imgbn_canonical: { type: String, },
    film_category: { type: Array, },
    film_country: { type: Array, },
    film_episodes: { type: Array, },
    film_trailer: { type: String, },
    film_duration: { type: String, },
    film_quality: { type: String, },
    film_year: { type: Number, },
    film_imdb: { type: String, },
    film_language: { type: String, },
    film_cinema: { type: Boolean, },
    film_hot: { type: Boolean, },
    film_canonical: { type: Boolean, },
    film_type: { type: String, },
    film_message: { type: String, },
    film_description: { type: String, },
    film_info: { type: String, },
    film_tag: { type: Array, },
    film_tagascii: { type: Array, },
    film_slug: { type: String, slug: 'film_name', },
    film_viewed: { type: Number, },
    film_uploadby: { type: Number, },
    film_viewed_d: { type: Number, },
    film_viewed_w: { type: Number, },
    film_viewed_m: { type: Number, },
}, {
    timestamps: true,
});

mongoose.plugin(slug);
Film.plugin(AutoIncrement,{
    inc_field: 'film_id',
    start_seq: 1,
});
Film.plugin(mongooseDelete,{
    deletedAt: true,
    overrideMethods: 'all',
});


module.exports = mongoose.model('Film', Film);