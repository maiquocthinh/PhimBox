'use strict';

const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const mongooseDelete = require('mongoose-delete');
const Schema = mongoose.Schema;

const Country = new Schema({
    // _id: { type: Schema.ObjectId, },
    country_id: { type: Number },
    country_name: { type: String },
    country_slug: { type: String },
}, {
    timestamps: true,
});

Country.plugin(AutoIncrement,{
    inc_field: 'country_id',
    start_seq: 1,
});
Country.plugin(mongooseDelete,{
    deletedAt: true,
    overrideMethods: 'all',
});

module.exports = mongoose.model('Country', Country);