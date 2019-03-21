const mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
const counselSchema = mongoose.Schema({

  _id: mongoose.Schema.Types.ObjectId,

  저자: {type: String},

  연월일: { type: String},

  내용: { type: String},

  담당자: { type: String }

}, { collection: 'counsel'});
counselSchema.plugin(mongoosePaginate);
const Counsel  = mongoose.model('counsel', counselSchema);
module.exports = Counsel;