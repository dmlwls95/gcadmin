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

  계약일: { type: String },

  발행일: { type: String },

  발행처: {type: String},

  정가: { type: String },

  계약기간: { type: String },

  상태: { type: String },

  인세율: { type: Number },

  인세주기: { type: String },

  판_쇄: { type: String },

  발행부수: { type :String },

  저술_번역: { type :String },
  
  에이전시: { type :String },
  
  원출판사: { type :String },
  
  로열티: { type :String },
  
  판형: { type :String },
  
  제본: { type :String },
  
  페이지: { type :String },
  
  비고: { type :String },

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