const mongoose = require('mongoose')
mongoose.connect(process.env.mongo_url)

const connection = mongoose.connection;
connection.on('connected', ()=> {
  console.log('MongoDb connected successfully !')
});

connection.on('error', (err)=> {
  console.log('MongoDb connection faild !');
})

module.exports = connection;