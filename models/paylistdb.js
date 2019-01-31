var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var paylistSchema = mongoose.Schema({

  _id: mongoose.Schema.Types.ObjectId,

  일련번호: { type: String},

  통장명: { type: String},

  출판명: { type: String },

  날짜: { type: String },

  고객명: { type: String },

  구분: { type: String },

  계정과목: { type: String },

  출금액: { type: String },

  입금액: { type: String },

  통장내역: { type: String },

  내용: { type: String },

  세부내용: { type: String },

  비고: { type: String },

  ISBN: { type: String }

}, { collection: 'paylist'});

paylistSchema.plugin(mongoosePaginate);
var Paylist  = mongoose.model('paylist', paylistSchema);
module.exports = Paylist;