var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var roomNumber=0;
var playersCount=2;
var playerTurn=3;

var gameRooms = {};

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
//     if(playersCount<2){
//         playersCount++;
//         socket.join('room_'+roomNumber);
//         addRoomData(roomNumber,socket.id,playerTurn);
//         socket.emit('canPlay',{canPlay:playerTurn});
// //        console.log("playerTurn: "+playerTurn);
// //        console.log("room"+roomNumber);
//     }
//     else{
//         playersCount=1;
//         roomNumber++;
//         socket.join('room_'+roomNumber);
//         playerTurn=Math.floor((Math.random() * 2));
//
//         gameRooms['room_'+roomNumber]={roomID:'',players:[],turn:0};
//         addRoomData(roomNumber,socket.id,playerTurn);
//
        socket.emit('canPlay',{canPlay:playerTurn});
// //        console.log("playerTurn: "+playerTurn);
//
//         playerTurn==1 ? playerTurn=0 : playerTurn=1;
//
// //        console.log("room"+roomNumber);
//     }

    socket.emit('connection', { hello: 'CAO' });
    socket.on('attack', function (data) {
        socket.to(Object.keys(socket.rooms)[1]).emit('opponentAttack',data);
        if(gameRooms[''+Object.keys(socket.rooms)[1]].turn == 1){
            socket.to(Object.keys(socket.rooms)[1]).emit('canPlay',{canPlay:gameRooms[''+Object.keys(socket.rooms)[1]].turn});
            gameRooms[''+Object.keys(socket.rooms)[1]].turn=0;
            socket.emit('canPlay',{canPlay:gameRooms[''+Object.keys(socket.rooms)[1]].turn});
        }
        else{
            socket.emit('canPlay',{canPlay:gameRooms[''+Object.keys(socket.rooms)[1]].turn});
            gameRooms[''+Object.keys(socket.rooms)[1]].turn=1;
            socket.to(Object.keys(socket.rooms)[1]).emit('canPlay',{canPlay:gameRooms[''+Object.keys(socket.rooms)[1]].turn});
        }
    });
});

function addRoomData(roomNumber,id,playerTurn){
    gameRooms['room_'+roomNumber].roomID = 'id_room_'+roomNumber;
    gameRooms['room_'+roomNumber].players.push(id);
    gameRooms['room_'+roomNumber].turn=playerTurn;
    console.log("turn: "+gameRooms['room_'+roomNumber].turn);
}

server.listen(8080);
