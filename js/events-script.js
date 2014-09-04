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

var ground = new Wall(world, 0, world.cols-1, 2, world.cols+1, 6);
var ground = new Wall(world, 5, world.cols-1, world.rows - 7, world.cols+1, 6);
var ground = new Wall(world, world.rows - 4, world.cols-1, world.rows, world.cols+1, 6);

var portectBrick = new Brick(world, 1, ground.y1 - 1, 5);
var portectBrick = new Brick(world, 5, ground.y1 - 1, 5);
var portectBrick = new Brick(world, world.rows - 8, ground.y1 - 1, 5);
var portectBrick = new Brick(world, world.rows - 4, ground.y1 - 1, 5);
var home_link1 = new EmptyDiv(world, 2, ground.y1 - 1, 5, ground.y1 - 1, "<a href=\"home.html\">HOME</a>", 'homelink1' ,'center');
var home_link2 = new EmptyDiv(world, world.rows - 7, ground.y1 - 1, world.rows - 4, ground.y1 - 1, "<a href=\"home.html\">HOME</a>", 'homelink2' ,'center');
var home_arrow1 = new EmptyDiv(world, 3, ground.y1, 4, ground.y1, "<a href=\"home.html\"><img src=img/downarrow.png /></a>", 'homearrow1' ,'center');
var home_arrow2 = new EmptyDiv(world, world.rows - 6, ground.y1, world.rows - 5, ground.y1, "<a href=\"home.html\"><img src=img/downarrow.png /></a>", 'homearrow2' ,'center');

var types = new Array(	'ROBOTICA',
						'CODING',
						'DESIGN & BUILD',
						'QUIZZES',
						'ONLINE EVENTS',
						'E-SUMMIT',
						'GAMING',
						'CASE STUDY<br>PAPER MEET',
						'MISC.'
);

var typeslink = new Array('robotica.html',
						'coding.html',
						'design_build.html',
						'quizes.html',
						'online_events.html',
						'esummit.html',
						'gaming.html',
						'case_study.html',
						'miscellaneous.html'
);

var ht;
for(var i = 0; i < types.length; i++)
{
	ht = parseInt(Math.random()*4) + 3;
	if(i == 0)
		ht = 3;
	var wall1 = new Wall(world, 5*i + 12, ground.y1 - ht, 5*i + 13, ground.y1, 4);
	
	var events_tunnel =  new Tunnel(world, 5*i + 14, ground.y1 - ht + 1, ht - 1);
	events_tunnel.i = i;
	var events_link = new EmptyDiv(world, events_tunnel.x1 - 1, events_tunnel.y1 - ((types[i].length < 12)?1:2), events_tunnel.x1 + 3, events_tunnel.y1, "<a href=\"javascript:openTheatre('"+typeslink[i]+"')\">"+types[i]+"</a>", ''+types[i] ,'center');
	events_tunnel.inTunnel = false;
	events_tunnel.onMarioEnter = function() {
		if(!this.inTunnel)
		{
			var et = this;
			mario.stayInWorld = false;
			putMarioInTunnel('');
			this.inTunnel = true;
			
			setTimeout("openTheatre('"+typeslink[this.i]+"')", 1000);
			onTheatreClose = function() {
				if(et.inTunnel)
					pushMarioFromTunnel('startMovement');
				et.inTunnel = false;
			};
		}
	};

}
var wall1 = new Wall(world, 5*i + 12, ground.y1 - 3, 5*i + 13, ground.y1, 4);

for(var i = 10; i < world.rows - 5; i++)
{
	var brick = new Brick(world, i, 2, 4);
	brick.onHit = function() {breakBrick(this);};
}
var hb1 = new Brick(world, 13, ground.y1 - 8, -2);
var hb2 = new Brick(world, 14, ground.y1 - 12, -2);

hb1.onHit = function() {
	if(this.type != 6)
	{
		playSound('coin');
		animateBrick(this);
		this.setType(6);
	}
};
hb2.onHit = hb1.onHit;


var mario = new Mario(world, 6, ground.y1 - 19);
mario.placeMario();

mario.hideBubble();

mario.onFallDown = function() {
	docLocation('home.html');
	this.stayInWorld = false;
};

mario.gamingTime = 0;

mario.playGamingSound = function() {
	if(this.gamingTime == 0)
		this.showBubble();
	if(this.gamingTime == 100)
		playSound('bombplanted');
	if(this.gamingTime < 100)
	{
		mario.setBubbleText(this.gamingTime +"%");
	}
	if(this.gamingTime == 100)
	{
		mario.setBubbleText("Bomb has been planted.");
		setTimeout(mario.hideBubble, 200);
	}
	if(this.gamingTime < 160)
	{
		this.gamingTime++;
		return;
	}
	if(this.gamingTime == 160)
	{
		this.gamingTime = 0;
	}
};

$(document).ready(function() {
	moveMario(41);
});

var eventsHead = new EmptyDiv(world, (world.rows - 19)/2, 3, (world.rows + 19)/2, 10, 'Events', 'eventsHead', 'center');