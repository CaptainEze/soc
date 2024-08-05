const mongoose = require('mongoose');
const config = require('../../../config/db.config');

const dbConn = async () =>{
    mongoose.connect(`${config.url}/${config.dbName}`, {})
    .then(() => {
        console.log('MongoDB connected...');
    })
    .catch(err => {
      console.error('MongoDB connection error:', err.message);
      process.exit(1);
    });
}


module.exports = dbConn;