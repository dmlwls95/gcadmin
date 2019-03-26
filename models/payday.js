const mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
const paydaySchema = mongoose.Schema({

  _id: mongoose.Schema.Types.ObjectId,

  일자: { type: Date},

  바코드: { type: String},

  도서명: { type: String },

  정가: { type: String },

  서점명: { type: String },

  제본소입고부수: { type: String },

  제본소_외_입고부수: { type: String },

  저자: {type: String},

  매출부수: { type: Number },

  매출금액: { type: Number },

  본사이동부수: { type: String },

  증정부수: { type: String },
  
  반품부수: { type: String },
  
  반품금액: { type: String },
  
  폐기부수: { type: String },
  
  현정품재고: { type: String },
  
  현반품재고: { type: String },
  
  순매출부수: { type: Number },
  
  순매출금액: { type: Number },

  신간일자: { type: String },
  
  
  
}, { collection: 'payday'});
paydaySchema.plugin(mongoosePaginate);
module.exports  = mongoose.model('payday', paydaySchema);
