const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const payviewSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,

    바코드: [{ type: Schema.Types.ObjectId, ref: 'bookview' }],

    도서명: { type: String },

    서점: { type: String },

    판매부수: { type: String },

    금액: { type: String }
});

const bookviewSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,

    바코드: [{ type: Schema.Types.ObjectId, ref: 'payview' }],
    
    저자: { type: String}
});

const payview = mongoose.model('payview', payviewSchema);
const bookview = mongoose.model('bookview', bookviewSchema);