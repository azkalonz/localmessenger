var express = require('express');
var router = express.Router();
var mysql = require('../db.js');
var db = mysql.connect;

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home',isLoggedIn: req.session.loggedin, user: req.session.user });
});
router.get('/login', (req, res)=>{
  res.render('login', { title: 'Login',isLoggedIn: req.session.loggedin, user: req.session.user });
})
router.post('/login', (req, res)=>{
  let user = req.body.username;
  let pass = req.body.password;
  mysql.login((err,result,user)=>{
    if(result){
      req.session.loggedin = true;
      req.session.user = user;
      res.redirect('/chat');
    } else {
      req.session.loggedin = false;
      res.redirect('/login');
    }
  },user,pass,db)
})
router.get('/chat', (req, res)=>{
  if(req.session.loggedin==null) res.redirect('/login');
  mysql.getAllUsers((err,users)=>{
    res.render('chat',{ title: 'Chat',isLoggedIn: req.session.loggedin, user: req.session.user, alluser: users});
  },db);
})
router.get('/single-view/:receiver_id', (req, res)=>{
  if(req.session.loggedin==null){res.render('login-to-continue');}
  let data = {
    user : req.session.user.id,
    receiver : req.params.receiver_id,
  }
  console.log(data);
  mysql.getMessages((messages)=>{
    mysql.getLastLogin(function(date){
      res.render('single-view',{user: data, messages: messages,lastLogin: date.last_login});
    },data.receiver,db);
  },data.user,data.receiver,db);
})
router.get('/logout', (req,res)=>{
  req.session.destroy();
  res.send(`<script>window.location="/login";</script>`);
})
module.exports = router;
