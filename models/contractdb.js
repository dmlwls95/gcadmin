var mongoose = require('mongoose');

var contractSchema = mongoose.Schema({

  _id: mongoose.Schema.Types.ObjectId,

  인세번호: { type: String},

  ISBN: { type: String},

  출판사: { type: String },

  구분: { type: String },

  기간: { type: String },

  증정: { type: String },

  계약일: { type: String },

  저자: { type: String },

  원서저자: { type: String },

  인세구분: { type: String },

  도서명: { type: String },

  판쇄: { type: String },

  정가: { type: String },

  발행일: { type: String },

  발행부수: { type: String },

  인세율: { type: Number },

  정산액: { type: String },

  조정액: { type: String },

  에이전시: { type: String },

  해외출판사: { type: String },

  증정본발송: { type: String },

  비고: { type: String }


}, { collection: 'contract'});
var Contract  = mongoose.model('contract', contractSchema);
module.exports = Contract;