var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var PORT = 4000;
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var app = express();
var mysql = require('./db.js');
var db = mysql.connect;
db.connect();

var date = new Date();
var time = `${date.getHours()%12}:${date.getMinutes()} ${date.getHours()>=12? 'PM':'AM'}`;
console.log('\n\n\n');
var io = require('socket.io').listen(app.listen(PORT,(err)=>{
  console.log(`***Server running PORT: ${PORT} `);
}))
let sockets = {};
io.on('connection', (socket)=>{
  socket.on('send message',(data)=>{
    time = `${date.getHours()%12}:${date.getMinutes()<9?'0'+date.getMinutes():date.getMinutes()} ${date.getHours()>=12? 'PM':'AM'}`;
    data.time = time;
    mysql.sendMessage(function(err,result){
      if(!err) console.log(`[ MESSAGE SENT ] ${time}`);
      else console.log(err);
    },data,db);
    if(sockets[data.receiver_id]!=null){
    socket.broadcast.to(sockets[data.receiver_id]).emit('message',data.sender_id);}
    console.log(`[ NEW MESSAGE ] (${time}) MESSAGE FROM [${data.sender_id}] TO [${data.receiver_id}] : ${data.message}`,);
  })
  socket.on('sockets',(data)=>{
    sockets[data[0]] =data[1];
    console.log(`[ USER ID ${Object.keys(sockets).length} ]:`,sockets);
    io.emit('online users',[sockets,data]);
    io.emit('count users',sockets);
  })
  socket.on('disconnect', (data)=>{
    console.log(data);
    let user;
    for(let i in sockets){
      if(sockets[i]==socket.id){
        user = i;
        delete sockets[i];
      }
    }
    mysql.updateLastLogin(function(err,res){
      if(err) throw err;
      console.log(res);
    },user,db)
    io.emit('online users',sockets);
    console.log('[ ONLINE USERS ] ',sockets);
    console.log(`[ USER DISCONNECT ] ${socket.id}`);
  })
  socket.on('count',()=>{
    io.emit('count users',sockets);
  })
})
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(expressSession({secret: 'max', saveUninitialized: false, resave: false}));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
