var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var payedSchema = mongoose.Schema({

  _id: mongoose.Schema.Types.ObjectId,

  일자: { type: Date},

  저자: { type: String },

  도서명: { type: String},

  서점명: { type: String},

  인세금액: { type: Number },
  
  payed: { type: Boolean },

  comment: { type: String }

}, { collection: 'payed'});
payedSchema.plugin(mongoosePaginate);
var Payed  = mongoose.model('payed', payedSchema);
module.exports = Payed;