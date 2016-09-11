var socket = io.connect();
socket.on('connection', function (data) {
	// console.log(data.hello);
	you=data.you;
	enemy=data.enemy;
	playerNumber=data.playerNumber;
	drawPlayers(you, enemy);
	if(data.waitingForOponent){
		$('#waiting').fadeIn('fast');
	}
	else{
		socket.emit('gameReady');
		console.log("okinuo se 'gameReady'");
	}
	if(playerNumber){
		$('#playerNumber').text("You are player 1");
	} else {
		$('#playerNumber').text("You are player 2");
	}

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
	if(data.playerNumber == 1){
		toast("Player 1 has left the game");
	} else {
		toast("Player 2 has left the game");
	}
	setTimeout(function(){
		window.location = window.location.origin+"/menu";
	},2000)
});
