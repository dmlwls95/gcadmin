const mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
const processSchema = mongoose.Schema({

  _id: mongoose.Schema.Types.ObjectId,

  바코드: {type: String},

  항목: {type: String},

  날짜: { type: String},

  담당자: { type: String},

  작업내용: { type: String }

}, { collection: 'process'});
processSchema.plugin(mongoosePaginate);
const Process  = mongoose.model('process', processSchema);
module.exports = Process;