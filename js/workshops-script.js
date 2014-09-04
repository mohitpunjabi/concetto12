/**
 *
 *	Mario World:
 *	written by Mohit Punjabi
 *
 **/

loadingCallback = loopMusic;

function loopMusic()
{
	playUnderworldMusic();
}

var wdt = parseInt($('#container').css('width').split('px'));
var world = new Grid(document.getElementById('mario-container'), 34, 34, wdt);


var background = new Background(world, 0, world.cols-2);

var ground = new Wall(world, 0, world.cols-1, world.rows, world.cols+1, 6);
var wallleft = new Wall(world, 0, ground.y1 - 16, 1, ground.y1, 4);
var wallright = new Wall(world, world.rows - 1, ground.y1 - 16, world.rows, ground.y1, 4);
var walltop = new Wall(world, 7, ground.y1 - 16, world.rows - 3, ground.y1 - 15, 3);


var start_tunnel = new Tunnel(world, 3, ground.y1 - 4, 4);

var back_tunnel = new Tunnel(world, world.rows - 4, ground.y1 - 3, 3);
var back_link = new EmptyDiv(world, back_tunnel.x1 - 1, back_tunnel.y1 - 1, back_tunnel.x1 + 3, back_tunnel.y1, "<a href=\"home.html\">HOME</a>", 'back' ,'center');

for(var i = 7; i < world.rows - 3; i++)
{
	var brick1 = new Brick(world, i, ground.y1 - 15, 4);
	var brick2 = new Brick(world, i, ground.y1 - 14, 4);
	if(i < world.rows - 4)
		var coin2 = new Coin(world, i, ground.y1 - 1);
	
	brick1.onHit = function() {
		breakBrick(this);
	};
	brick2.onHit = brick1.onHit;
}

var ethical_brick = new Brick(world, 10, ground.y1 - 7, 1);
var ethical_link = new EmptyDiv(world, ethical_brick.x1 - 2, ethical_brick.y1 - 1.5, ethical_brick.x1 + 3, ethical_brick.y1-0.5, "<a href=\"javascript:openTheatre('ethicalhacking.html')\">ETHICAL HACKING</a>", 'ethical' ,'center');

var mecabot_brick = new Brick(world, 16, ground.y1 - 7, 1);
var mecabot_link = new EmptyDiv(world, mecabot_brick.x1 - 2, mecabot_brick.y1 - 1.5, mecabot_brick.x1 + 3, mecabot_brick.y1-0.5, "<a href=\"javascript:openTheatre('imacbotz.html')\">I-MECABOTZ</a>", 'mecabot' ,'center');

var game_brick = new Brick(world, 22, ground.y1 - 7, 1);
var game_link = new EmptyDiv(world, game_brick.x1 - 2, game_brick.y1 - 1.5, game_brick.x1 + 3, game_brick.y1-0.5, "<a href=\"javascript:openTheatre('gamedesign.html')\">GAME DESIGNING &amp; SCRIPTING</a>", 'game' ,'center');

var lean_brick = new Brick(world, 28, ground.y1 - 7, 1);
var lean_link = new EmptyDiv(world, lean_brick.x1 - 2, lean_brick.y1 - 1.5, lean_brick.x1 + 3, lean_brick.y1-0.5, "<a href=\"downloads/lean_six_sigma.pdf\" target=\"_new\">LEAN SIX SIGMA</a>", 'lean' ,'center');



ethical_brick.onHit = function()
{
	if(this.type != 6)
	{
		playSound('coin');
		animateBrick(this);
		this.setType(6);
		openTheatre('ethicalhacking.html');
		onTheatreClose = function() {
			this.setType(1);
		};
	}
	else
	{
		playSound('bump');
	}
};

mecabot_brick.onHit = function()
{
	if(this.type != 6)
	{
		playSound('coin');
		animateBrick(this);
		this.setType(6);
		openTheatre('imacbotz.html');
		onTheatreClose = function() {
			this.setType(1);
		};
	}
	else
	{
		playSound('bump');
	}
};

game_brick.onHit = function()
{
	if(this.type != 6)
	{
		playSound('coin');
		animateBrick(this);
		this.setType(6);
		openTheatre('gamedesign.html');
		onTheatreClose = function() {
			this.setType(1);
		};
	}
	else
	{
		playSound('bump');
	}
};

lean_brick.onHit = function()
{
		playSound('coin');
		animateBrick(this);
		document.location="downloads/lean_six_sigma.pdf";
};
var mario = new Mario(world, start_tunnel.x1 + 0.5, start_tunnel.y1 - 0.4);
mario.hideBubble();
mario.stayInWorld = false;

back_tunnel.onMarioEnter = function() {
	href = 'home.html';
	putMarioInTunnel("docLocation('"+href+"')");
}

$(document).ready(function() {
	pushMarioFromTunnel('startMovement');
	moveGoombas(41);
	moveCoins(41);
	animateBrick1(0);
});