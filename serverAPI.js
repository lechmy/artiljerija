var express = require('express');
var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser');

var cookieSession = require('cookie-session');

var router = express.Router();

var auth = require('./server/auth.js');

var statisticDB = require('./models/statisticSchema.js');
var playersDB = require('./models/playersSchema.js');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/players');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var roomNumber=0;
var playersCount=2;
var playerTurn=0;

var gameRooms = {'room_0':{players:[0,1]}};
var playersRooms = {};

app.use('/public', express.static('public'));
app.use('/private', express.static('private'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieSession({
  name: 'session',
  keys: ['artiljerija']
}));
// app.use(app.router);

app.all('/*', auth);
app.get('/', function (req, res) {
  res.redirect('/login');
});
app.get('/game', function (req,res){
  res.sendFile(__dirname + '/private/game.html');
  // req.sessionOptions.maxAge = req.session.maxAge || req.sessionOptions.maxAge
  statisticDB.findOne({ username: req.session.user }).exec().then(function(result){
    statisticDB.update({ username: result.username }, { $inc: { 'gamesPlayed': 1 }}).exec();
  });
});
app.get('/login', function (req, res){
  res.sendFile(__dirname + '/public/login.html');
});
app.post('/login', function (req, res){
  playersDB.findOne({ username: req.body.username }).exec().then(function(result){
    if(result!=null && result.password == req.body.password){
      req.session.user = req.body.username;

      // req.sessionOptions.maxAge = 1200000; // 20 minuta
      res.redirect('/menu');
    }
    else{
      res.json({status: 'fail', message: 'Pogrešno korisničko ime ili lozinka'});
    }
  },function(err){
    res.redirect('/login');
  });
});
app.get('/logout',function(req, res){
  req.session = null;
  res.redirect('/login');
})
app.get('/register', function(req, res){
  res.sendFile(__dirname + '/public/register.html');
});
app.post('/register', function(req, res){
  playersDB.findOne({username: req.body.username}).exec().then(function(result){
    if(result != null) return res.json({status: 'fail', message: 'Korisnicko ime vec postoji'});
    playersDB.create({ username: req.body.username, password: req.body.password }).then(function(){
      statisticDB.create({ username: req.body.username, gamesPlayed: 0});
      res.redirect('/game');
    });
  })
});
app.get('/menu', function(req, res){
  res.sendFile(__dirname + '/private/menu.html');
})

io.on('connection', function (socket) {
    playersRooms[socket.id]={};
    if(gameRooms['room_'+roomNumber].players.length < 2){
        // playersCount++;

        socket.join('room_'+roomNumber);
        addPlayerData(socket.id,roomNumber);
        addRoomData(roomNumber,socket.id,playerTurn);
        socket.emit('connection', { you:{ x:690,y:349,points:0 },enemy:{ x:80,y:349,points:0 },playerNumber: playerTurn, waitingForOponent: false});
        // console.log(Object.keys(socket.rooms));
//        console.log("playerTurn: "+playerTurn);
//        console.log("room"+roomNumber);
    }
    else{
        // playersCount=1;
        roomNumber++;
        playerTurn = Math.floor((Math.random() * 2));
        socket.join('room_'+roomNumber);
        gameRooms['room_'+roomNumber]={roomID:'',players:[],turn:0};
        addPlayerData(socket.id,roomNumber);
        addRoomData(roomNumber,socket.id,playerTurn);
        socket.emit('connection', { you:{ x:80,y:349,points:0 },enemy:{ x:690,y:349,points:0 }, playerNumber: playerTurn, waitingForOponent: true});
        playerTurn == 1 ? playerTurn = 0 : playerTurn = 1;
        // console.log(gameRooms['room_1']);
        // console.log(gameRooms[''+Object.keys(socket.rooms)[1]].roomID+'\n'+gameRooms[Object.keys(socket.rooms)[1]].players+'\n'+gameRooms[Object.keys(socket.rooms)[1]].turn);
//        console.log("playerTurn: "+playerTurn);
//        console.log("room"+roomNumber);
    }

    socket.on('gameReady',function(){
      socket.to(Object.keys(socket.rooms)[1]).emit('gameReady');
      socket.emit('gameReady');
    });

    socket.on('attack', function (data) {
      socket.to(Object.keys(socket.rooms)[1]).emit('opponentAttack',data);
    });

    socket.on('playerChange',function(){
      if(gameRooms[''+Object.keys(socket.rooms)[1]].turn == 1){
          socket.to(Object.keys(socket.rooms)[1]).emit('playerChange',{canPlay:gameRooms[''+Object.keys(socket.rooms)[1]].turn});
          gameRooms[''+Object.keys(socket.rooms)[1]].turn=0;
          socket.emit('playerChange',{canPlay:gameRooms[''+Object.keys(socket.rooms)[1]].turn});
      }
      else{
          socket.emit('playerChange',{canPlay:gameRooms[''+Object.keys(socket.rooms)[1]].turn});
          gameRooms[''+Object.keys(socket.rooms)[1]].turn=1;
          socket.to(Object.keys(socket.rooms)[1]).emit('playerChange',{canPlay:gameRooms[''+Object.keys(socket.rooms)[1]].turn});
      }
    });
    socket.on('disconnect',function(){
      console.log('\n');
      console.log("number of players in room: "+gameRooms[playersRooms[socket.id].roomID].players.length);
      if(gameRooms[playersRooms[socket.id].roomID].players.length < 2){
        delete gameRooms[playersRooms[socket.id].roomID]
        console.log(gameRooms);
        roomNumber--;
        console.log('roomNumber: '+roomNumber);
      }
      else {
        gameRooms[playersRooms[socket.id].roomID].players.forEach(function(item){
          if(socket.id == item.id){
            // gameRooms[playersRooms[socket.id].roomID].players.pop(item);
            socket.to(playersRooms[socket.id].roomID).emit('playerLeft',{'playerNumber':item.playerNumber});
            app.get('/menu');
          }
        });
      }
      // playerTurn
      // socket.to(Object.keys(socket.rooms)[1]).emit('playerLeft',{playerNumber:gameRooms[''+Object.keys(socket.rooms)[1]].players[socket.id].playerNumber});
      // if(gameRooms[''+Object.keys(socket.rooms)[1]].players.length == 0){
        // roomNumber--;
      // }
      // console.log("id: "+socket.id);
    });
});

function addRoomData(roomNumber,id,playerTurn){
    gameRooms['room_'+roomNumber].roomID = 'room_'+roomNumber;
    gameRooms['room_'+roomNumber].players.push({id:id,'playerNumber':playerTurn});
    // gameRooms['room_'+roomNumber].players.
    gameRooms['room_'+roomNumber].turn=playerTurn;
}
function addPlayerData(id,roomNumber){
    playersRooms[id].roomID = 'room_'+roomNumber;
}

server.listen(8080);
