// DB.js
const mongoose = require('mongoose');

module.exports = () => {
    function connect() {
        mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/admin',{ useNewUrlParser: true}, function(err){
            if(err) {
                console.error('mongodb connection err', err);
            }
            console.log('mongodb connected');
        });
    }
    connect();
    mongoose.connection.on('disconnected', connect);
    require('./models/editor.js');
    require('./models/bookcode.js');
    require('./models/contractdb.js');
    require('./models/paylistdb.js');
    require('./models/royalti.js');
    require('./models/payday.js');
 };