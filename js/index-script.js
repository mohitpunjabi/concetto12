/**
 *
 *	Mario World:
 *	written by Mohit Punjabi
 *
 **/

loadingCallback = function enableButton()
{
	if(document.getElementById('proceedButton'))
	{
		document.getElementById('proceedButton').disabled = false;
		document.getElementById('proceedButton').innerHTML = "Click here to start";
	}
}

var wdt = parseInt($('#container').css('width').split('px'));
var world = new Grid(document.getElementById('mario-container'), 34, 34, wdt);


var background = new Background(world, 0, world.cols-2);
/*
background.addFence(14, 0);

for(var i = 0; i < 7; i++)
	background.addCloud(parseInt(Math.random()*2 + 1), Math.random()*(world.height - 300) + 20, Math.random()*world.width - 20, i);
*/

var concetto = new EmptyDiv(world, (world.rows - 19)/2, 4, (world.rows + 19)/2, 11, '', 'concettoHeader', 'concettoHeader');
var tunnel = new EmptyDiv(world, concetto.x2 - 4, world.cols - 4.9, concetto.x2+0.2, world.cols - 1, '', 'tunnelhor', 'tunnelhor'); 
var ground = new Wall(world, 0, world.cols-1, parseInt(tunnel.x2 + 5), world.cols+1, 5);
var ground2 = new Wall(world, parseInt(tunnel.x2 + 9), world.cols-1, world.rows, world.cols+1, 5);
var castle = new EmptyDiv(world, -1, world.cols - 12, 7.45, world.cols - 1, '', 'castle', 'castle'); 
var fireball = new EmptyDiv(world, parseInt(castle.x1+3), parseInt(castle.y1 - 1), parseInt(castle.x1+4), parseInt(castle.y1), '', 'fireball', 'fireball'); 

var text =  "<ul>"+
//			"<li class=selected><a href=\"#\" id=\"trailerLink\" onclick=\"playTrailer()\">PLAY TRAILER</a>" +
			"<li></li>" +
			"<li><a href=\"home.html\">ENTER WEBSITE</a>" +
			"</ul>";

var textdiv = new EmptyDiv(world, ((world.rows - 7)/2), 11.5, ((world.rows + 7)/2), 13, text, 'textDiv', 'textDiv');

if(ground2.x1 <= world.rows)
	var wall1 = new Wall(world, ground2.x1, ground2.y1 - 6, ground2.x1 + 1, ground2.y1, 2);
brick1 = new Brick(world, parseInt(concetto.x2 + 1), parseInt(concetto.y2 - 2), 1);
var wall2 = new Wall(world, parseInt(concetto.x1), parseInt(concetto.y1), parseInt(concetto.x2), parseInt(concetto.y2), -1);
var goomba1 = new Goomba(world, wall2.x1, wall2.y1-1, 1);
var mario = new Mario(world, parseInt(tunnel.x1 - 16), parseInt(world.cols-4));
mario.stayInWorld = true;
mario.placeMario();
mario.hideBubble();

openTheatre('instructions.html');

var s = 0;
var pressed = false;

$("#proceedButton").click(function() {
	$("#proceedButton").hide();
	closeTheatre();

	animateBrick1(41);
//	setInterval('moveClouds()', 55);
	moveGoombas(41);
	
	playSound('background', {from: 0, to: 2300});
	$("ul li:eq(0)").fadeOut('fast');
	burstFireball(1);
	moveMarioToTunnel(41);
	mario.maxvx = 0.2;
	mario.moveForward();

	
	/*
	$(document).keydown(function(key) {
		if(key.keyCode == 27)
		{
			if(theatreOpen)
				closeTheatre();
		}
		if(!pressed)
		{
			if(key.keyCode == 13)
			{
				var href = $("ul li:eq("+s+") a").attr('href');
				$('#bubbleContainer').hide();
				if(s == 1)
				{
					playSound('background');
					$("ul li:eq(0) a").fadeOut('fast');
					burstFireball(1);
					moveMarioToTunnel(41);
					mario.maxvx = 0.2;
					mario.moveForward();
				}
				if(s == 0)
				{
					playTrailer();
				}
				pressed = true;
			}
			if(key.keyCode == 38 || key.keyCode == 40)
			{
				s++;
				s %= 2;
				$("ul li:eq(0)").attr('class', (s == 0)?'selected':'');
				$("ul li:eq(1)").attr('class', (s == 1)?'selected':'');
				playSound('kick');
			}
		}
	});
	
	*/
});

var soundPlayed = false;
function moveMarioToTunnel(dt)
{
	if(!soundPlayed && mario.actualX >= parseInt(tunnel.x1-2)*world.cellWidth)
	{
		playSound('pipe');
		soundPlayed = true;
		mario.maxvx = 0.07;
		mario.vx = 0.07;
	}
	if(mario.actualX < parseInt(tunnel.x1)*world.cellWidth)
	{
		mario.move(41);
		setTimeout('moveMarioToTunnel('+dt+')', dt);
	}
	else
	{
		var href = $("ul li:eq(1) a").attr('href');
		document.location=href;
	}
}


function burstFireball(flag)
{
	var dt = 120;
	if(flag == 0)
	{
		$('.fireball').css('background-position', '0 100');
		dt = 150;
		$('.fireball').css('left', (Math.random()*10*world.cellWidth) + 'px');
		$('.fireball').css('top', ((Math.random()*8 + castle.y1 - 5)*world.cellHeight) + 'px');
	}
	if(flag == 1)
	{
		$('.fireball').css('background-position', '5 0');
//		playSound('fireworks');
	}

	if(flag == 2) $('.fireball').css('background-position', '-25 0');
	if(flag == 3) $('.fireball').css('background-position', '-64 0');
	if(flag == 4) $('.fireball').css('background-position', '-25 0');
	if(flag == 5) $('.fireball').css('background-position', '5 0');
	
	setTimeout('burstFireball('+((++flag)%6)+')', dt);
}


function playTrailer()
{
	$("ul li:eq(1) a").fadeOut('fast');
	$('.background, #container').css('background-color', '#000');
	$('.goomba1, #mario, .fence').fadeOut('slow');
	document.getElementById('concettoHeader').innerHTML="...VIDEO LOADS HERE...";
	$('#concettoHeader').css('background', '#FFF');
	document.getElementById('textDiv').innerHTML="<a href=\"home.html\">GO TO THE WEBSITE</a>";
}