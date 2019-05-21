var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var royaltiSchema = mongoose.Schema({

  _id: mongoose.Schema.Types.ObjectId,

  일자: { type: Date},

  저자: { type: String },

  도서명: { type: String},

  서점명: { type: String},

  인세금액: { type: Number },
  
  payed: { type: Boolean },
  
  은행: { type: String },
  
  계좌번호: { type: String},
  
  예금주: { type: String},

  연락처: {type: String}

}, { collection: 'royalti'});
royaltiSchema.plugin(mongoosePaginate);
var Royalti  = mongoose.model('royalti', royaltiSchema);
module.exports = Royalti;