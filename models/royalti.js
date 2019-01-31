var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var royaltiSchema = mongoose.Schema({

  _id: mongoose.Schema.Types.ObjectId,

  일자: { type: String},

  저자: { type: String },

  도서명: { type: String},

  서점명: { type: String},

  인세금액: { type: Number }

}, { collection: 'royalti'});
royaltiSchema.plugin(mongoosePaginate);
var Royalti  = mongoose.model('royalti', royaltiSchema);
module.exports = Royalti;