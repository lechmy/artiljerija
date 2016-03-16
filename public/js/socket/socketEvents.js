var socket = io.connect();
socket.on('connection', function (data) {
	// console.log(data.hello);
	you=data.you;
	enemy=data.enemy;
	playerNumber=data.playerNumber;
	if(data.waitingForOponent){
		$('#waiting').fadeIn('fast');
	}
	else{
		socket.emit('gameReady');
		console.log("okinuo se 'gameReady'");
	}
	$('#playerNumber').text("You are player "+playerNumber);
});
socket.on('gameReady',function(){
	$('#waiting').fadeOut('fast');
	console.log('player number: '+playerNumber);
	if(playerNumber){
		attachEvents();
		promena_igraca(playerNumber);
	}
})
socket.on('opponentAttack',function(data){
    fireShell(data.shell,data.shooter);
});
socket.on('playerChange',function(data){
	// TREBA DA PROSLEDIM DA LI JE PLAYER 1 ILI 2 ZBOG SETOVANJ SNAGE DA IDE LEVO ILI DESNO
		promena_igraca(data.canPlay);
    console.log("Can player play: "+data.canPlay)
   if(data.canPlay){
      attachEvents();
		}
   else{
       $('#crtanje').off();
   }
});
socket.on('playerLeft',function(data){
	alert("Player "+data.playerNumber+" has left the game");
});
