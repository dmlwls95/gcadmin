var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var bcrypt = require('bcrypt-nodejs');
var editorSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,

    저자: { type: String },

    소속: { type: String },

    직위: { type: String },

    연락처_휴대전화: { type: String },

    연락처_02: { type: String },

    팩스: { type: String },

    이메일: { type: String },

    사업자번호: { type: String },

    구분: { type: String },

    은행: { type: String },

    계좌번호: { type: String },

    예금주: { type: String },

    주소_직장: { type: String },

    주소_자택: { type: String },

    비고_01: { type: String },

    비고_02: { type: String },

    전공: { type: String },

    기념일: { type: String },

    id: { type: String },

    pw: { type: String }
  },
  { collection: 'editor' }
);

editorSchema.plugin(mongoosePaginate);
editorSchema.methods.comparePassword = function(passw, cb) {
  if (this.pw == passw) {
    cb(null, true);
  } else {
    return cb(null, false);
  }
};

var Editor = mongoose.model('editor', editorSchema);
module.exports = Editor;
