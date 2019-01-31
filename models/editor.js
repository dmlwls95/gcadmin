var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var bcrypt = require('bcrypt-nodejs');
var editorSchema = mongoose.Schema({

  _id: mongoose.Schema.Types.ObjectId,

  저자: { type: String},

  소속: { type: String},

  은행: { type: String },

  계좌번호: { type: String },

  연락처_01: { type: String },

  연락처_02: { type: String },

  팩스: { type: String},

  이메일: { type: String },

  주민번호: { type: String },

  주소: { type: String },

  비고_01: { type: String },

  비고_02: { type: String },

  비고_03: { type: String },

  구분: { type: String },

  id : { type: String },

  pw : { type: String}

}, { collection: 'editor'});

editorSchema.plugin(mongoosePaginate);
editorSchema.methods.comparePassword = function (passw, cb) {
  if (this._id == passw) {
    cb(null, true);
  }else{
    return cb(err);
  }
};

var Editor  = mongoose.model('editor', editorSchema);
module.exports = Editor;