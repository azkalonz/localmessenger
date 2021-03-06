require('dotenv').config()
var mysql = require('mysql');
module.exports = {
  connect : mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      charset : 'utf8mb4'
    }),
  getAllUsers : function(callback,db) {
    let result = [];
    db.query(`SELECT * FROM user`, (err, res)=>{
      if(err) callback(err,null);
      for(var i=0; i<res.length; i++){
        result.push(res[i]);
      }
      callback(null,result);
    })
  },
  sendMessage : function(callback,data,db) {
    db.query(`INSERT INTO messages SET receiver_id = ${data.receiver_id}, sender_id = ${data.sender_id}, content = '${data.message}', _time = '${data.time}'`, (err, res)=>{
      if(err) callback(err,null);
      else callback(null,'Success');
    })
  },
  login : function(callback,username,password,db){
    db.query(`SELECT * FROM user WHERE username = '${username}' AND password = '${password}'`, (err, result)=>{
      if(result[0]!=null) callback(null,true,result[0]);
      else callback(err, false, null);
    })
  },
  getMessages : function(callback,sid,rid,db) {
    let result = [];
    db.query(`SELECT * FROM messages WHERE (sender_id = ${sid} AND receiver_id = ${rid}) OR sender_id = ${rid} AND receiver_id = ${sid}`, (err, res)=>{
      if(err) callback(err);
      for(var i=0; i<res.length; i++){
        result.push(res[i]);
      }
      callback(result);
    })
  },
  updateLastLogin : function(callback,id,db) {
    let date = new Date();
    db.query(`UPDATE user SET last_login = '${date}' WHERE id = ${id}`, (err,res)=>{
      if(err) callback(err,null);
      else callback(null,'Last login saved.');
    })
  },
  getLastLogin : function(callback,id,db) {
    if(typeof(id)=='undefined'){return callback(null);}
    db.query(`SELECT last_login FROM user WHERE id = ${id}`, (err,res)=>{
      callback(res[0]);
    })
  }
}
