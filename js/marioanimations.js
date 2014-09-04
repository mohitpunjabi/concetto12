/**
 *
 *	Mario World:
 *	written by Mohit Punjabi
 *
 **/

function animateBrick(brick)
{
	moveBrickUp(brick.brickId, brick.y1);
	setTimeout('moveBrickDown('+brick.brickId+', '+brick.y1+')', 100);
}

function moveBrickUp(brickId, y1)
{
	$('#brick'+brickId).css('top', (y1*world.cellHeight - 5) + 'px');
}

function moveBrickDown(brickId, y1)
{
	$('#brick'+brickId).css('top', (y1*world.cellHeight) + 'px');
}

function breakBrick(brick)
{
	var x = brick.x1*world.cellWidth;
	var y = brick.y1*world.cellHeight;

	$('#brick'+brick.brickId).hide();
	world.grid[brick.x1][brick.y1] = 0;
	playSound('breakblock');
	for(var i = 0; i < 4; i++)
	{
		world.container.innerHTML += "<div class=\"abs brickpiece"+brick.type+"\" id=\"brickpiece"+brick.brickId+''+i+"\"></div>";
		var p = document.getElementById('brickpiece'+i);
		var x0 = (x + (i%2)*17);
		var y0 = (y + (i/2)*17);
		$(p).css('top', y0+'px');
		$(p).css('left', x0+'px');
		projectBrickPiece('#brickpiece'+brick.brickId+''+i, x0, y0, (i-1.5)*0.5, -1);
	}
}

function projectBrickPiece(pieceId, x, y, vx, vy)
{
	var dt = 50;
	var _vy = parseFloat(vy);
	var _vx = parseFloat(vx);
	var _x = parseFloat(x);
	var _y = parseFloat(y);

	_vy += 0.005*dt;
	_x += _vx*dt;
	_y += _vy*dt;

	$(pieceId).css('top', _y+'px');
	$(pieceId).css('left', _x+'px');
	if(_y <= world.height)
		setTimeout("projectBrickPiece('"+pieceId+"', "+_x+", "+_y+", "+_vx+", "+_vy+")", dt);
	else
	{
		$(pieceId).hide();
	}
}

function pushMarioFromTunnel(callback)
{
	this.stayInWorld = false;
	playSound('pipe');
	pushMarioFromTunnelFor(30);
	setTimeout(callback+'()', 30*50);
}

function pushMarioFromTunnelFor(i)
{
	mario.setActualY(mario.actualY-3);
	mario.placeMario();
	if(i >= 0)
		setTimeout('pushMarioFromTunnelFor('+(--i)+')', 50);
};

function putMarioInTunnel(callback)
{
	playSound('pipe');
	mario.stayInWorld = false;
	mario.updateContainers('stand');

	putMarioInTunnelFor(20);
	setTimeout(callback+'()', 1000);
}

function putMarioInTunnelFor(i)
{
	mario.setActualY(mario.actualY+3);
	mario.placeMario();
	if(i >= 0)
		setTimeout('putMarioInTunnelFor('+(--i)+')', 50);
};

function moveMario(dt)
{
	if(mario.stayInWorld)
	{
		setTimeout("moveMario("+dt+")", dt);
	}
	mario.move(dt);
}

function moveGoombas(dt)
{
	for(var i = 0; i < world.numGoombas; i++)
	{
			world.goombas[i].move(dt);
	}

	setTimeout("moveGoombas("+dt+")", dt);
}

function moveCoins(dt)
{
	for(var i = 0; i < world.numCoins; i++)
	{
		if(world.coins[i].stayInWorld)
			world.coins[i].move(dt);
	}

	setTimeout("moveCoins("+dt+")", dt);
}


function moveFish(dt)
{
//	for(var i = 0; i < 1; i++)
	//{
		fish.move(dt);
	//}

	setTimeout("moveFish("+dt+")", dt);
}

function moveStar(dt)
{
	if(star.stayInWorld)
	{
		setTimeout("moveStar("+dt+")", dt);
	}
	star.move(dt);
}

function animateBrick1(pos)
{
	if(pos == 3)
		pos++;
	$(".brick1").css('background-position', '-' + (((pos)%3)*34) + ' 0');
	setTimeout('animateBrick1('+((++pos)%(5))+')', 200);
}


function startMovement()
{
	mario.stayInWorld = true;
	moveMario(41);
}

function goto(href)
{
	setTimeout("docLocation('"+href+"')", 300);
}

function docLocation(href)
{
	document.location = href;
}

var theatreOpen = false;
var onTheatreClose = function()
{
};

function closeTheatre()
{
	$('#theatre').fadeOut(500);
	theatreOpen = false;
	onTheatreClose();
}

function openTheatre(href)
{
	if(theatreOpen)
		onTheatreClose();
	$('#theatre').fadeIn(500);
	document.getElementById('theatreFrame').src = href;
	theatreOpen = true;
}
	var backMusic;
	var starMusic;
	var underworldMusic;
	var sound_count = Array();
	var smReady = false;
	var imagesLoaded = false;
	var soundLoaded = false;
	var sounds = Array();
	sounds = ['smb_background', 'smb_coin', 'smb_breakblock', 'smb_jump-super', 'smb_pipe', 'smb_powerup_appears', 'smb_stomp', 'smb_bump', 'smb_star', 'smb_powerup', 'smb_underworld', 'smb_bombplanted'];
	

	var numLoaded = 0;
	var loadingCallback = function() {};

	if(jQuery.imgpreload)
	{
		var the_images = [];
		the_images.push('./img/dark-grid.png');
		the_images.push('./img/mario-sprite.png');
		the_images.push('./img/brick1.png');
		the_images.push('./img/brick2.png');
		the_images.push('./img/brick3.png');
		the_images.push('./img/brick4.png');
		the_images.push('./img/brick5.png');
		the_images.push('./img/brick6.png');
		the_images.push('./img/brick7.png');
		the_images.push('./img/water.png');
		the_images.push('./img/brickpiece2.png');
		the_images.push('./img/brickpiece4.png');
		the_images.push('./img/bush1.png');
		the_images.push('./img/bush2.png');
		the_images.push('./img/bush3.png');
		the_images.push('./img/cloud1.png');
		the_images.push('./img/cloud2.png');
		the_images.push('./img/coin1.png');
		the_images.push('./img/fence.png');
		the_images.push('./img/goomba1.png');
		the_images.push('./img/goomba2.png');
		the_images.push('./img/ground1.png');
		the_images.push('./img/ground2.png');
		the_images.push('./img/islandbase.png');
		the_images.push('./img/islandleft.png');
		the_images.push('./img/islandtop.png');
		the_images.push('./img/logo.png');
		the_images.push('./img/logobig.png');
		the_images.push('./img/mario-right-sprite.png');
		the_images.push('./img/mario-sprite.png');
		the_images.push('./img/star.png');
		the_images.push('./img/tunnel.png');
		the_images.push('./img/tunneltop.png');
		for(var sc = 1; sc <= 12; sc++)
			the_images.push("./img/sponsors/"+sc+".jpg");
	
		jQuery.imgpreload(the_images,
		{
			all: function()
			{
//				console.log("Images loaded");
				imagesLoaded = true;
				if(soundLoaded)
					loadingCallback();
			}
		});
	}
	else
		imagesLoaded = true;
	
	var sm = soundManager.setup({
		url: './soundmanager2/swf/',
		flashVersion: 9,
		useHighPerformance: true,
		flashLoadTimeout: 1000,
		useHTML5Audio: true,
		waitForWindowLoad: false,
		
		onready: function() {
			smReady =  true;
			var i;
			for(i = 0; i < sounds.length; i++)
			{
				sound_count[''+sounds[i]] = 0;
				var preload = soundManager.createSound({
					id: ''+sounds[i],
					url: './sound/'+sounds[i]+'.wav',
					type: 'audio/wav',
					onload: function() {
						sound_count[''+this.id] = 1;
						var percent = parseInt((++numLoaded)*100/sounds.length);
						percent = (percent > 100)? 99: percent;
						if(document.getElementById('proceedButton'))
							document.getElementById('proceedButton').innerHTML = "Loading: "+percent+"%";
						if(numLoaded == sounds.length)
						{
//							console.log("Sounds loaded: "+numLoaded);
							soundLoaded = true;
							if(imagesLoaded)
							{
								loadingCallback();
							}
						}
					}
				});
				preload.load();
				if(sounds[i] == 'smb_background')
					backMusic = preload;
				if(sounds[i] == 'smb_star')
					starMusic = preload;
				if(sounds[i] == 'smb_underworld')
					underworldMusic = preload;
			}
		}
	});
	
function playUnderworldMusic()
{
	if(soundLoaded)
		underworldMusic.play({onfinish: playUnderworldMusic});
}

function playBackMusic()
{
	if(soundLoaded)
		backMusic.play({onfinish: playBackMusic});
}

function pauseBackMusic()
{
	if(soundLoaded)
		backMusic.pause();
}	
function playStarMusic()
{
	if(soundLoaded)
		starMusic.play({onfinish: playStarMusic});
}

function pauseStarMusic()
{
	if(soundLoaded)
		starMusic.pause();
}

function playSound(sid, obj)
{
	var id = 'smb_'+sid;
	if(smReady && sound_count[''+id] == 1){
		if(obj)
			soundManager.play(id, obj);
		else
			soundManager.play(id);
	}
}

/**
 *	marioanimations.js
 *	written by Mohit Punjabi.
 *
 **/