var socket = io.connect();
socket.on('connection', function (data) {
	console.log(data.hello);
});
socket.on('opponentAttack',function(data){
//	console.log("Angle: " + data.shell.angle + "Power: "+data.shell.power);
    fireShell(data.shell,data.shooter);
});
socket.on('canPlay',function(data){
	// TREBA DA PROSLEDIM DA LI JE PLAYER 1 ILI 2 ZBOG SETOVANJ SNAGE DA IDE LEVO ILI DESNO
    console.log("Can player play: "+data.canPlay)
  //  if(data.canPlay){
       $('#crtanje').on('mousemove',function(){
            aiming(event);
	   });
	   $('#crtanje').on('mousedown',function(event){
            settingParameter(event);
	   });
	   $('#crtanje').on('mouseup',function(){
	       fireShell(null,null);
           socket.emit('attack',{shell:shell,shooter:shooter});
           shell.power=0;
	   });
  //  }
  //  else{
  //      $('#crtanje').off();
  //  }
});
