/**
 *
 *	Mario World:
 *	written by Mohit Punjabi
 *
 **/

loadingCallback = function () {
//	console.log('Called Back');
	playBackMusic();
}

var wdt = parseInt($('#container').css('width').split('px'));
var world = new Grid(document.getElementById('mario-container'), 34, 34, wdt);


var background = new Background(world, 0, world.cols-2);

background.addTree(31, 0);
background.addFence(3, 0);
background.addBush(14, 0, 1);
background.addBush(18, 1, 3);
background.addBush(44, 2, 3);
background.addBush(34, 3, 2);
background.addTree(130, 1);

for(var i = 0; i < Math.random()*35 + 2; i++)
	background.addCloud(parseInt(Math.random()*2 + 1), Math.random()*(world.height - 300) + 20, Math.random()*world.width - 20, i);


var ground = new Wall(world, 2, world.cols-1, 50, world.cols+1, 5);
world.addIsland(50, ground.y1 - 2, 10, 4);
world.addIsland(55, ground.y1 - 6, 4, 4);
world.addIsland(60, ground.y1 - 7, 14, 9);

sponsors_screen = new EmptyDiv(world, 61, ground.y1 - 15, 73, ground.y1 - 7, "<div id=\"sponsorsImage\"></div>", 'sponsorsScreen' ,'center');


var water = new EmptyDiv(world, 73, world.cols - 1, 92, world.cols+1, "", 'water' ,'center');
for(var i = 1; i < 18; i++)
	var coin = new Coin(world, 73+i, world.cols - 3);

var tray1 = new Wall(world, 76, ground.y1 - 10, 81, ground.y1 - 9, 7); 
var tray2 = new Wall(world, 85, ground.y1 - 10, 90, ground.y1 - 9, 7); 

for(var i = 0; i <= 7; i++)
	new Wall(world, 92 + i, ground.y1 - 8 + i, 93 + i, ground.y1, 2);

var ground1 = new Wall(world, 92, world.cols-1, world.rows, world.cols+1, 5);

var aboutus_brick = new Brick(world, 7, ground.y1 - 7, 1);
var aboutus_link = new EmptyDiv(world, aboutus_brick.x1 - 2, aboutus_brick.y1 - 1.5, aboutus_brick.x1 + 3, aboutus_brick.y1-0.5, "<a href=\"javascript:openTheatre('aboutus.html')\">ABOUT US</a>", 'aboutus' ,'center');

var memories_brick = new Brick(world, 129, ground.y1 - 5, 2);
var memories_link = new EmptyDiv(world, memories_brick.x1 - 3, memories_brick.y1 - 1.5, memories_brick.x1 + 4, memories_brick.y1-0.5, "<a href=\"\">PAST MEMORIES</a>", 'memories' ,'center');

memories_screen = new EmptyDiv(world, 103, ground.y1 - 16, 125, ground.y1 - 1, "", 'memoriesScreen' ,'center');

var start_tunnel = new Tunnel(world, 12, ground.y1 - 2, 2);

var devs_tunnel =  new Tunnel(world, 136, ground.y1 - 2, 2);
var devs_tunnel_link = new EmptyDiv(world, devs_tunnel.x1 - 2, devs_tunnel.y1 - 1.5, devs_tunnel.x1 + 3, devs_tunnel.y1-0.5, "<a href=\"javascript:openTheatre('developers.html')\">DEVELOPERS</a>", 'devs' ,'center');

var events_tunnel =  new Tunnel(world, 22, ground.y1 - 4, 4);
var events_tunnel_link = new EmptyDiv(world, events_tunnel.x1 - 1, events_tunnel.y1 - 1.5, events_tunnel.x1 + 3, events_tunnel.y1-0.5, "<a href=\"events.html\">EVENTS</a>", 'events' ,'center');

var wall1 = new Wall(world, 30, ground.y1 - 5, 37, ground.y1 - 4, 2);

var guestlecture_brick = new Brick(world, 33, ground.y1 - 10, 1);
var guestlecture_link = new EmptyDiv(world, guestlecture_brick.x1 - 3, ground.y1 - 11.5, guestlecture_brick.x1 + 4, ground.y1 - 10.5, "<a href=\"javascript:openTheatre('guest.html')\">GUEST LECTURES </a>", 'guest_lecture' ,'center');
var wall2 = new Wall(world, 37, ground.y1 - 9, 44, ground.y1 - 8, 2);

var wall3 = new Wall(world, 29, ground.y1 - 14, 35, ground.y1 - 13, 2);
for(var i = 0; i < 6; i++)
{
	var brk = new Brick(world, 43+i, ground.y1 - 14, 2);
	brk.onHit = function() {
		breakBrick(this);
	};
}

var workshop_tunnel =  new Tunnel(world, 39, ground.y1 - 3, 3);
var workshop_tunnel_link = new EmptyDiv(world, workshop_tunnel.x1 - 1.5, workshop_tunnel.y1 - 1.5, workshop_tunnel.x1 + 3.5, workshop_tunnel.y1-0.5, "<a href=\"workshops.html\">WORKSHOPS</a>", 'workshops' ,'center');

var star_brick = new Brick(world, 17, ground.y1 - 8, -2);
var star;

var sidprotectionwall = new Brick(world, 50, ground.y1-1, -1);

var swapnil = new Goomba(world, 14, ground.y1 - 1, 1);
var nihit = new Goomba(world, 28, ground.y1 - 1, 1);
var sid = new Goomba(world, 70, ground.y1 - 11, 1);
var oebdesignr = new Goomba(world, 30, ground.y1 - 16, 1);
sid.vx *= -1;
sid.direction = false;

var mario = new Mario(world, start_tunnel.x1 + 0.5, start_tunnel.y1);
mario.setBubbleText("1000 tweets with hashtag #concetto, and something awesome will happen to me. <br><a href=\"http://concetto.co.in/athousandgoodtweets/\" class=blacklink target=_new>Click here</a> for progress.");
//mario.hideBubble();
mario.stayInWorld = false;

mario.onFallDown = function() {
	mario.setActualY(0);
};

aboutus_brick.onHit = function()
{
	if(this.type != 6)
	{
		playSound('coin');
		animateBrick(this);
		this.setType(6);
		openTheatre('aboutus.html');
		onTheatreClose = function() {
			aboutus_brick.setType(1);
		};
	}
	else
	{
		playSound('bump');
	}
};

guestlecture_brick.onHit = function()
{
	if(this.type != 6)
	{
		playSound('coin');
		animateBrick(this);
		this.setType(6);
		openTheatre('guest.html');
		onTheatreClose = function() {
			guestlecture_brick.setType(1);
		};
	}
	else
	{
		playSound('bump');
	}
};


memories_brick.counter = 0;
memories_brick.onHit = function()
{
	animateBrick(this);
	playSound('coin');
	if(this.counter == 0)
	{
		$("#mi24").hide();
		this.counter++;
	}
	$("#mi"+this.counter).hide();
	this.counter++;
	$("#mi"+this.counter).show();
	this.counter %= 25;
};



events_tunnel.onMarioEnter = function()
{
	href = 'events.html';
	putMarioInTunnel("docLocation('"+href+"')");
};

workshop_tunnel.inTunnel = false;
workshop_tunnel.onMarioEnter = function() {
	href = 'workshops.html';
	putMarioInTunnel("docLocation('"+href+"')");
};

devs_tunnel.onMarioEnter = function() {
	if(!this.inTunnel)
	{
		var et = this;
		mario.stayInWorld = false;
		putMarioInTunnel('');
		this.inTunnel = true;
		
		setTimeout("openTheatre('developers.html')", 1000);
		onTheatreClose = function() {
			if(et.inTunnel)
				pushMarioFromTunnel('startMovement');
			et.inTunnel = false;
		};
	}
};

star_brick.onHit = function()
{
	if(this.type != 6)
	{
		playSound('powerup_appears');
		animateBrick(this);
		this.setType(6);
		star = new Star(world, this.x1, this.y1 - 1);
		moveStar(41);
	}
};

$(document).ready(function() {
	
	setTimeout(mario.hideBubble, 10000);
	for(var i = 1; i < 25; i++)
	{
		$("#memoriesScreen").html(""+$("#memoriesScreen").html()+"<img src=\"img/memories/"+i+".jpg\" width=100% height=100% id=\"mi"+i+"\">");
		if(i != 1)
			$("#mi"+i).hide();
	}
	pushMarioFromTunnel('startMovement');
	$('#header').css('top', '-100px');	
	animateBrick1(41);
	moveGoombas(41);
	moveCoins(41);
	animateBrick1(0);
	showSponsors(0);
});

function showSponsors(curr)
{
	curr %= 12;
	$('#sponsorsImage').fadeOut('slow', function() {
	$('#sponsorsImage').html("<img src=\"img/sponsors/"+(curr+1)+".jpg\"> <img src=\"img/sponsors/"+(curr+2)+".jpg\">");
	});
	$('#sponsorsImage').fadeIn('slow');
	setTimeout('showSponsors('+(curr+2)+')', 5000);
}