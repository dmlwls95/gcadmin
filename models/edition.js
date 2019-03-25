const mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
const editionSchema = mongoose.Schema({

  _id: mongoose.Schema.Types.ObjectId,

  바코드: {type: String},

  날짜: {type: String},

  쇄: { type: String},

  부수: { type: Number},

  인세: { type: String }

}, { collection: 'edition'});
editionSchema.plugin(mongoosePaginate);
const Edition  = mongoose.model('edition', editionSchema);
module.exports = Edition;