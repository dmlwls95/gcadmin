const mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;
const payref = require('../models/payday.js');
const bookcodeSchema = mongoose.Schema({

  _id: mongoose.Schema.Types.ObjectId,

  바코드: { type: String},

  도서코드: { type: Number},

  도서명: { type: String },

  저자: { type: String },

  신간일: { type: String },

  발행처: { type: String },

  정가: { type: String },

  총재고: { type: String },

  본사재고: { type: String },

  정품재고: { type: String },

  반품재고: { type: String },

}, { collection: 'bookcode'});
bookcodeSchema.virtual('paydays', {
  ref: 'payday',
  localField: '바코드',
  foreignField: '바코드',
  justOne: false
});
bookcodeSchema.plugin(mongoosePaginate);
const Bookcode  = mongoose.model('bookcode', bookcodeSchema);
module.exports = Bookcode;