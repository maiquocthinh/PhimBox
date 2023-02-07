'use strict';

const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const mongooseDelete = require('mongoose-delete');
const Schema = mongoose.Schema;

const Category = new Schema({
    // _id: { type: Schema.ObjectId, },
    category_id: { type: Number },
    category_name: { type: String },
    category_slug: { type: String },
}, {
    timestamps: true,
});

Category.plugin(AutoIncrement,{
    inc_field: 'category_id',
    start_seq: 1,
});
Category.plugin(mongooseDelete,{
    deletedAt: true,
    overrideMethods: 'all',
});

module.exports = mongoose.model('Category', Category);