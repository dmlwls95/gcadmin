// AdUnit.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for GcUnits
let GcUnit = new Schema({
  unit_name: {
    type: String
  },
  unit_price: {
    type: Number
  }
},{
    collection: 'gcunits'
});

module.exports = mongoose.model('GcUnit', GcUnit);