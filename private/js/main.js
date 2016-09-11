var power;
var angle;
var angl;
var ang;
var A;
var xx;
var yy;
var pomak=0;
var razdaljinaX,razdaljinaY,razdaljina;
var dmg=0;
var tacke=[];
var k=0;
var i=1;
var j=1;
var po=0;
var ter;
var m=0;

var clr;
var p=0;
var zbir=0;
var t;
var r;
var rupa;
var m,met;
var pvreme,pv;


var fps = 60;
var igrac_na_potezu = 2;
var emitPlayerChange;
var playerNumber;
var path;
var distance = 0;
var powerMAX,powerMIN;
var you = {};
var enemy = {};
var shooter = { x:0, y:0, poeni:0 };
var target = { x:0, y:0, poeni:0 };
var aim = { x:0, y:0};
var impact = { x:0, y:0 }
var shell = { trajectory:{
                x:0,
                y:0
            },
            angle:0,
            power:0,
            shellAnimate:{
                x:0,
                y:0,
                r:3
            }
          };
var crosshair, player1, player2;
var crosshairImage;

$(document).ready(function(){
	terrain();
  makeImages();
});

window.requestAnimFrame = (function(callback)
{
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame ||
	window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback)
	{
		window.setTimeout(callback, 1000 / fps);
       };
})();

// (function() {
//     var lastTime = 0;
//     var vendors = ['ms', 'moz', 'webkit', 'o'];
//     for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
//         window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
//         window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
//                                    || window[vendors[x]+'CancelRequestAnimationFrame'];
//     }

//     if (!window.requestAnimationFrame)
//         window.requestAnimationFrame = function(callback, element) {
//             var currTime = new Date().getTime();
//             var timeToCall = Math.max(0, 16 - (currTime - lastTime));
//             var id = window.setTimeout(function() { callback(currTime + timeToCall); },
//               timeToCall);
//             lastTime = currTime + timeToCall;
//             return id;
//         };

//     if (!window.cancelAnimationFrame)
//         window.cancelAnimationFrame = function(id) {
//             clearTimeout(id);
//         };
// }());

function terrain()
{
	rupa=document.getElementById("rupe").getContext("2d");
	ter=document.getElementById("teren").getContext("2d");
	met=document.getElementById("metak").getContext("2d");

	ter.beginPath();
	ter.moveTo(0,400);
	ter.lineTo(0,350);
	ter.lineTo(150,350);
	ter.lineTo(500,350);
	ter.lineTo(550,100);
	ter.lineTo(600,350);
	ter.lineTo(900,350);
	ter.lineTo(900,400);
	ter.lineTo(0,400);
	//ter.clip();
    ter.fillStyle = "green";
    ter.fill();
	ter.stroke();
}
function makeImages(){
  crosshairImage = document.getElementById("nisan").getContext("2d");
  crosshair = new Image();
  crosshair.src = 'private/images/crosshair.png';
  player1 = new Image();
  player1.src = 'private/images/character-mini.png';
  player2 = new Image();
  player2.src = 'private/images/character-mini-clockwise.png';
}

function drawPlayers(you, enemy){
  var can = document.getElementById("igraci").getContext("2d");
  console.log(you.x);
  if(you.x > 450){
    can.drawImage(player1, you.x - (player1.width/2), you.y - player1.height);
    can.drawImage(player2, enemy.x - (player2.width/2), enemy.y - player2.height);
  } else {
    can.drawImage(player2, you.x - (player1.width/2), you.y - player1.height);
    can.drawImage(player1, enemy.x - (player2.width/2), enemy.y - player2.height);

  }
}

//function ozezi()
//{
//	var power=parseInt(parametri.snaga.value);
//	var ang=parseInt(parametri.ugao.value);
//	/*var path=Math.sqrt(Math.pow(power,2)+Math.pow(angle,2));*/
//	var angle=ang*(Math.PI/180);
//	var y=Math.sin(angle)*(power*10);
//	var x=Math.cos(angle)*(power*10);
//	/*$("#igrac").animate({top:ang},"fast");
//	$("#igrac").animate({left:power},"fast");*/
//	var c=document.getElementById("crtanje");
//	var ctx=c.getContext("2d");
//	ctx.beginPath();
//	ctx.moveTo(50,350);
//	ctx.quadraticCurveTo(x+50,350-y,(x*2)+50,350);
//	ctx.stroke();
//}
function aiming(event){ //Mouse move
    // crosshairImage = document.getElementById("nisan").getContext("2d");
    crosshairImage.clearRect(shooter.x-70,shooter.y-70,shooter.x+140,shooter.y+140);

    calculateAngle(event);

    var angleX=Math.cos(shell.angle)*50;
    var angleY=Math.sin(shell.angle)*50;

    // ctx.beginPath();
    // ctx.moveTo(shooter.x,shooter.y);
    // ctx.lineTo(shooter.x+angleX,shooter.y-angleY);
    // ctx.stroke();
    crosshairImage.drawImage(crosshair, shooter.x + angleX - 10, shooter.y - angleY - 10);
}
function settingParameter(event){
    shell.power=0;
    $('#powerBar').show().offset({ top: shooter.y - 120, left: shooter.x - 50});
    calculateAngle(event);
    shell.trajectory.x = Math.cos(shell.angle);
    shell.trajectory.y = Math.sin(shell.angle);
    powerMIN = event.pageX;
    $("canvas").on('mousemove',function(event){
        powerMAX=event.pageX;

        shell.power=powerMAX-powerMIN;
        if(shell.power>100)
        {
            shell.power=100;
        }
        $('#power').width(shell.power+"%");
    });
}
function fireShell(shell,shooter) //Mouse Up
{
  $("canvas").off();
  $('#powerBar').hide();
  emitPlayerChange = false;
  if(shell == null && shooter == null){
    shell=this.shell;
    shooter=this.shooter;
    shell.trajectory.x=Math.ceil(shell.trajectory.x*shell.power*10);
	  shell.trajectory.y=Math.ceil(shell.trajectory.y*shell.power*10);
    emitPlayerChange = true;
  }
	if(shell.power > 5){
	   var ctx=document.getElementById("crtanje").getContext("2d");	//PRAVI PUTANJU

       impact.x = shell.trajectory.x*2 + shooter.x;    // najdalja tacka u odnosu na ispaljeni hitac
       impact.y=350;               // najniza tacka terena

	  //  ctx.clearRect(0,0,900,400);
	  //  ctx.beginPath();
	  //  ctx.moveTo(shooter.x,shooter.y);
	  //  ctx.quadraticCurveTo(shell.trajectory.x + shooter.x, shooter.y - shell.trajectory.y,(shell.trajectory.x * 2) + shooter.x, shooter.y);
	  //  ctx.lineTo((shell.trajectory.x * 2) + shooter.x, shooter.y);
	  //  ctx.quadraticCurveTo(shell.trajectory.x + shooter.x, shooter.y - shell.trajectory.y, shooter.x,shooter.y);
	  // //  ctx.stroke();

	   for(po=0;po<=1001;po++)
	   {
	   	var poz=po/1000;
	   	i=(1-poz) * shooter.x + poz * ((shell.trajectory.x * 2) + shooter.x);
	   	j=Math.pow((1-poz),2) * shooter.y + 2 * (1-poz) * poz * (shooter.y-shell.trajectory.y) + Math.pow(poz,2) * shooter.y;
	   	if(ter.isPointInPath(i,j) && !(rupa.isPointInPath(i,j)))	//sa ctx-om u upitu nece da udari u teren ali nece ni da animira samo prvi put kad puknem
	   	{
	   		impact.x=i;
	   		impact.y=j;
	   		ctx.clearRect(impact.x,0,900,400);
	   		break;
	   	}
	   }

     calculateDamage();

     pvreme=new Date().getTime();
	   animacija(shell,shooter,pvreme);
     distance=0;
   }
}

 function animacija(shell,shooter,pvreme)
 {
 	var animX,animY;
 	var te;
	// console.log("animacija radi");
 	requestAnimFrame(function(){
 		te=(new Date().getTime()-pvreme)/3000; //veci delilac,manja brzina
    // debugger;
 		animX=(1-te) * shooter.x + te*((shell.trajectory.x * 2) + shooter.x);
 		animY=Math.pow((1-te),2)*shooter.y + 2*(1-te)*te*(shooter.y - shell.trajectory.y) + Math.pow(te,2)*shooter.y;
    distance=Math.abs(impact.x-shooter.x) - Math.abs(animX-shooter.x);
// 		if((animX<=impX && igrac_na_potezu==2) || (animX>=impX && igrac_na_potezu==1))
 		if(distance>0)
 		{
 			shell.shellAnimate.x=animX;
 			shell.shellAnimate.y=animY;
 			metakF(shell.shellAnimate);
 			animacija(shell,shooter,pvreme);
 		}
    else{
        // $('#crtanje').on('mousemove',function(){
        //      aiming(event);
 	     //  });
       met.clearRect(0,0,900,400);
       drawHole();
       if(emitPlayerChange){
         socket.emit('playerChange');
       }
        $('#power').width('0px');
    }
 	});
 }
function metakF(hitac)
{
	// console.log("crata metak");
	met.clearRect(0,0,900,400);
	met.beginPath();
	met.arc(hitac.x,hitac.y,hitac.r,0,2*Math.PI);
	met.fill();
}

function calculateAngle(event){
    aim.x=event.pageX;
    aim.y=event.pageY;
    path=Math.sqrt(Math.pow(aim.x-shooter.x,2)+Math.pow(shooter.y-aim.y,2));
    shell.angle=Math.acos((aim.x-shooter.x)/path);
}
function drawHole(){
  rupa.clearRect(0,0,900,400);
  rupa.moveTo(impact.x,impact.y);
  rupa.arc(impact.x,impact.y,25,0,2*Math.PI);
  rupa.fillStyle="gray";
  rupa.fill();
  if(dmg>0)
  $("#damage").show();
  setTimeout(function(){
    $("#damage").hide();
  },2000);
//	rupa.stroke();
}
//function drawHole(){
//	ter.moveTo(impact.x,impact.y);
////	ter.arc(impact.x,impact.y,25,0,2*Math.PI);
//	ter.clearRect(impact.x-25,impact.y-25,50,50);
//    ter.arc(impact.x,impact.y,25,0,2*Math.PI);
//    ter.stroke();
//}

function calculateDamage(){
    razdaljinaX=Math.abs(Math.ceil(impact.x-target.x));
	  razdaljinaY=Math.abs(Math.ceil(impact.y-target.y));
    razdaljina=Math.sqrt(Math.pow(razdaljinaX,2)+Math.pow(razdaljinaY,2));
	if(razdaljina<100)
	{
		dmg=Math.ceil((1-(razdaljina/100))*40);
    $("#damage").css({ top: target.y-60, left:target.x-5 }).text(dmg);
	}
	else
	{
		dmg=0;
	}
}

function attachEvents(){
  console.log('pozvan attachEvents');
    $('#crtanje').on('mousemove',function(){
        aiming(event);
    });
    $('#crtanje').on('mousedown',function(event){
      $('#crtanje').off('mousemove');
      settingParameter(event);
    });
    $('#crtanje').on('mouseup',function(){
      crosshairImage.clearRect(shooter.x-70,shooter.y-70,shooter.x+140,shooter.y+140);
      fireShell(null,null);
      socket.emit('attack',{shell:shell,shooter:shooter});
      shell.power=0;
    });
  }
//function animacija()
//{
//		//console.log("ovo ne tereba da se vidi")
//		setTimeout(function()
//		{
//			vreme=new Date().getTime();
//			svreme=vreme-pvreme;
//			te=svreme/3000;
//			//console.log("animX: "+animX);
//
//			animX=((1-te)*shooter.x+te*((xx*2)+shooter.x));
//			animY=(Math.pow((1-te),2)*shooter.y+2*(1-te)*te*(shooter.y-yy)+Math.pow(te,2)*shooter.y);
//			hitac.x=animX;
//			hitac.y=animY;
//			metakF(hitac);
//			if((animX<=impX && igrac_na_potezu==2) || (animX>=impX && igrac_na_potezu==1))	//uslov ne radi za suprotan smer
//			{
//				window.requestAnimationFrame (animacija);
//			}
//			else
//			{
//				promena_igraca();
//			}
//			//pvreme=svreme;
//			//proveri dali bolje radi sa cail ili bez kad racuna pozociju
//			//racun izgleda ne valja,prijavnjuje da nije preso granicu ali na slici nije tako,ima ispod terena zeleni kontejner od prethodne verzije
//		},1000 / fps);
//}

function promena_igraca(canPlay)	//ovo radi kako treba ali nesto mi nije najasnije zasto!!!
{
	switch(canPlay)
	{
    case 0:
			shooter.x=enemy.x;
			shooter.y=enemy.y;
			target.x=you.x;
			target.y=you.y;
      console.log("promena u metu");
		break;

    case 1:
			shooter.x=you.x;
			shooter.y=you.y;
			target.x=enemy.x;
			target.y=enemy.y;
      console.log("promena u napadaca");
		break;
	}

}
