var mongo = require('mongodb');
var MongoClient= mongo.MongoClient;
var URL = 'mongodb://127.0.0.1:27017/';
var db;

MongoClient.connect(URL,function(err,database){
  if(!err){
    db=database;
  }
  else{
    //do something
  }
});

module.exports = {db}