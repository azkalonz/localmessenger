var express = require('express');
var router = express.Router();
var mysql = require('../db.js');
var db = mysql.connect;
 /* GET home page. */
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
  mysql.getAllUsers((err,users)=>{
    res.render('chat',{ title: 'Chat',isLoggedIn: req.session.loggedin, user: req.session.user, alluser: users});
  },db);
})
router.get('/single-view', (req, res)=>{
  req.query.user = req.session.user.id;
  mysql.getMessages((messages)=>{
    res.render('single-view',{user: req.query, messages: messages});
  },req.query.user,req.query.receiver,db);
})
module.exports = router;
