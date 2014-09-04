
function EmptyDiv(world, x1, y1, x2, y2, text, id, cls) {
	this.x1 = x1;
	this.x2 = x2;
	this.y1 = y1;
	this.y2 = y2;
	this.id = id;
	this.world = world;
	this.cls = cls;
	this.text = text;
	this.container = this.drawDiv();
};

EmptyDiv.prototype.drawDiv = function()
{
	this.world.container.innerHTML += "<div class=\"abs "+this.cls+"\" id=\""+this.id+"\">"+this.text+"</div>";

	var wallC = document.getElementById(""+this.id);
	var topLeft = this.world.getPixelValue(this.x1, this.y1);
	var botRight = this.world.getPixelValue(this.x2, this.y2);

	$(wallC).css("left", (topLeft[0])+"px");
	$(wallC).css("top", (topLeft[1])+"px");
	$(wallC).css("width", (botRight[0]-topLeft[0])+"px");
	$(wallC).css("height", (botRight[1]-topLeft[1])+"px");
	return wallC;
};


function Background(world, y1, y2)
{
	this.x1 = 0;
	this.y1 = y1;
	this.x2 = parseInt(world.rows);
	this.y2 = y2;
	this.world = world;
	this.container = this.drawBackground();
};

Background.prototype.drawBackground = function() {
	this.world.container.innerHTML += "<div class=\"abs background\" id=\"background\"> </div>";

	var wallC = document.getElementById("background");
	var topLeft = this.world.getPixelValue(this.x1, this.y1);
	$(wallC).css("left", "0px");
	$(wallC).css("top", (topLeft[1])+"px");
	$(wallC).css("width", (this.world.width)+"px");
	$(wallC).css("height", ((this.y2 - this.y1 + 1)*this.world.cellHeight)+"px");
	return wallC;
};

Background.prototype.addCloud = function(type, top, left, id) {
	
	this.container.innerHTML += "<div class=\"abs cloud"+type+"\" id=\"cloud"+id+"\"> </div>";
	var cloud = document.getElementById('cloud'+id);
	$(cloud).css('top', top+'px');
	$(cloud).css('left', left+'px');
};

Background.prototype.addTree = function(x, id) {
	this.container.innerHTML += "<div class=\"abs tree\" id=\"tree"+id+"\"> </div>";
	var tree = document.getElementById('tree'+id);
	$(tree).css('left', (x*this.world.cellWidth)+'px');
	$(tree).css('bottom', '0px');
};

Background.prototype.addFence = function(x, id) {
	this.container.innerHTML += "<div class=\"abs fence\" id=\"fence"+id+"\"> </div>";
	var fence = document.getElementById('fence'+id);
	$(fence).css('left', (x*this.world.cellWidth)+'px');
	$(fence).css('bottom', '0px');
};

Background.prototype.addBush = function(x, id, type) {
	this.container.innerHTML += "<div class=\"abs bush"+type+"\" id=\"bush"+id+"\"> </div>";
	var fence = document.getElementById('bush'+id);
	$(fence).css('left', (x*this.world.cellWidth)+'px');
	$(fence).css('bottom', '0px');
};

function Brick(world, x1, y1, type)
{
	this.x1 = x1;
	this.y1 = y1;
	this.world = world;
	this.type = type;
	this.coin = null;
	this.brickId = this.world.addBrick(this);
	this.container = this.drawBrick();
	this.container = document.getElementById('brick' + this.brickId);

	this.onHit = function() {	};
};

Brick.prototype.drawBrick = function() {
	this.world.container.innerHTML += "<div class=\"abs brick"+this.type+"\" id=\"brick"+this.brickId+"\"> </div>";

	var wallC = document.getElementById("brick"+this.brickId);
	var topLeft = this.world.getPixelValue(this.x1, this.y1);

	$(wallC).css("left", (topLeft[0])+"px");
	$(wallC).css("top", (topLeft[1])+"px");
	$(wallC).css("width", (this.world.cellWidth)+"px");
	$(wallC).css("height", (this.world.cellHeight)+"px");

	return wallC;
};

Brick.prototype.destroy = function() {
	this.setType(6);
};

Brick.prototype.setType = function(type) {
	this.type = type;
	$('#brick'+this.brickId).attr('class', 'abs brick'+type);
};

function Tunnel(world, x1, y1, height) {
	this.x1 = x1;
	this.x2 = x1 + 2;
	this.y1 = y1;
	this.y2 = y1 + height;
	this.world = world;
	this.tunnelId = this.world.addTunnel(this);
	this.container = this.drawTunnel();
	this.onMarioEnter = function() {};
	this.onMarioLand = function() {};
};

Tunnel.prototype.drawTunnel = function()
{
	this.world.container.innerHTML += "<div class=\"abs tunnel\" id=\"tunnel"+this.tunnelId+"\"> </div>";

	var wallC = document.getElementById("tunnel"+this.tunnelId);
	var topLeft = this.world.getPixelValue(this.x1, this.y1);
	var botRight = this.world.getPixelValue(this.x2, this.y2);

	$(wallC).css("left", (topLeft[0])+"px");
	$(wallC).css("top", (topLeft[1])+"px");
	$(wallC).css("width", (botRight[0]-topLeft[0]+1)+"px");
	$(wallC).css("height", (botRight[1]-topLeft[1])+"px");

	return wallC;
}

function Wall(world, x1, y1, x2, y2, type) {
	this.x1 = x1;
	this.x2 = x2;
	this.y1 = y1;
	this.y2 = y2;
	this.type = type;
	this.world = world;
	this.wallId = world.addWall(x1, y1, x2, y2);
	this.container = this.drawWall();
	//this.container.innerHTML="Wall #"+this.wallId;
};

Wall.prototype.drawWall = function()
{
	this.world.container.innerHTML += "<div class=\"abs wall"+this.type+"\" id=\"wall"+this.wallId+"\"> </div>";

	var wallC = document.getElementById("wall"+this.wallId);
	var topLeft = this.world.getPixelValue(this.x1, this.y1);
	var botRight = this.world.getPixelValue(this.x2, this.y2);

	$(wallC).css("left", (topLeft[0])+"px");
	$(wallC).css("top", (topLeft[1])+"px");
	$(wallC).css("width", (botRight[0]-topLeft[0])+"px");
	$(wallC).css("height", (botRight[1]-topLeft[1])+"px");

	return wallC;
}

function Grid(container, cellWidth, cellHeight, parentWidth)
{
	this.container = container;
	this.width = parseInt($(this.container).css('width').split('px')[0]);
	this.height = parseInt($(this.container).css('height').split('px')[0]);
	if(this.height == 0)
		this.height = 700;
	this.rows = parseInt(this.width/cellWidth) + 1;
	this.parentWidth = parentWidth;
	this.cols = parseInt(this.height/cellHeight);
	this.cellWidth = cellWidth;
	this.cellHeight = cellHeight;
	this.numWalls = 0;
	this.numTunnels = 0;
	this.numBricks = 0;
	this.numGoombas = 0;
	this.numIslands = 0;
	this.numCoins = 0;
	this.grid = new Array();
	this.tunnels = new Array();
	this.bricks = new Array();
	this.goombas = new Array();
	this.coins = new Array();
	this.mario = null;
	this.x = parseInt($(this.container).css('left'));
	this.bubbleVisible = false;

	for(var i = -7; i <= this.rows+1; i++)
	{
		this.grid[i] = new Array();
		for(var j = -7; j <= this.cols+2; j++)
			this.grid[i][j] = 0;
	}
};

Grid.prototype.tostring = function() {
	var str = "";
	for(var i = 0; i < this.rows; i++, str += "\n")
		for(var j = 0; j < this.cols; j++)
			str += this.grid[i][j];

	return str;
}

Grid.prototype.isPointInside = function(x1, y1) {
	return (x1 < this.rows && y1 < this.cols);
};

Grid.prototype.addWall = function(x1, y1, x2, y2) {
	this.numWalls++;
	for(var i = x1; i < x2; i++)
		for(var j = y1; j < y2; j++)
		{
			this.grid[i][j] = this.numWalls;
		}
	return this.numWalls;
};

Grid.prototype.addTunnel = function(tunnel) {
	this.numTunnels++;
	for(var i = tunnel.x1; i < tunnel.x2; i++)
		for(var j = tunnel.y1; j < tunnel.y2; j++)
			if(this.isPointInside(i, j))
				this.grid[i][j] = -(this.numTunnels);
	this.tunnels[this.numTunnels - 1] = tunnel;
	return -(this.numTunnels);
};

Grid.prototype.addBrick = function(brick) {
	this.numBricks++;
	this.grid[brick.x1][brick.y1] = 1000+(this.numBricks);
	this.bricks[this.numBricks - 1] = brick;
	return (1000+(this.numBricks));
};

Grid.prototype.addGoomba = function(goomba) {
	this.numGoombas++;
	this.goombas[this.numGoombas - 1] = goomba;
	return (-1000-(this.numGoombas));
};

Grid.prototype.addCoin = function(coin) {
	this.numCoins++;
	this.coins[this.numCoins - 1] = coin;
	return (this.numCoins);
};


Grid.prototype.addIsland = function(x, y, length, height) {
	this.container.innerHTML += "<div class=\"abs island\" id=\"island"+this.numIslands+"\"> </div>";
	var w1 = new Wall(this, x, y, x+length, y+1, -1);
	var w2 = new Wall(this, x+1, y+1, x+length-1, y+height, -1);

	var wallC = document.getElementById("island"+this.numIslands);
	wallC.innerHTML += "<div class=\"islandleft\"> </div><div class=\"islandbase\"><div class=\"islandtop\"> </div> </div><div class=\"islandright\"> </div>";
	var topLeft = this.getPixelValue(x, y);
	var botRight = this.getPixelValue(x+length, y+height);

	$(wallC).css("left", (topLeft[0])+"px");
	$(wallC).css("top", (topLeft[1])+"px");
	$(wallC).css("width", (botRight[0]-topLeft[0])+"px");
	$(wallC).css("height", (botRight[1]-topLeft[1])+"px");

	$("#island"+this.numIslands+" .islandbase").css('width', (botRight[0]-topLeft[0] - 64)+'px');
	$("#island"+this.numIslands+" .islandbase").css('height', (botRight[1]-topLeft[1])+'px');
	this.numIslands++;
};

Grid.prototype.getPixelValue = function(x1, y1) {
	var point = new Array(2);
	point[0] = this.cellWidth*x1;
	point[1] = this.cellHeight*y1;
	return point;
};

Grid.prototype.marioSatDown = function(mario) {
	var x1 = parseInt((mario.actualX)/mario.world.cellWidth);
	var x2 = parseInt((mario.actualX + mario.width)/mario.world.cellWidth);
	var y = parseInt((mario.actualY + mario.height + 1)/mario.world.cellHeight);

	if(x1 == 43 && x2 == 44)
	{
		mario.playGamingSound();
	}
	for(var i = 0; i < this.numTunnels; i++)
	{
		if(this.tunnels[i].x1 == x1 && this.tunnels[i].x1 == x2 - 1 && this.tunnels[i].y1 == y)
		{
			this.tunnels[i].onMarioEnter();
		}
	}
};

Grid.prototype.marioHitBrick = function(mario, wx, wy) {
	if(this.grid[wx][wy] > 0 && this.grid[wx][wy] < 1000)
		playSound('bump');
	for(var i = 0; i < this.numBricks; i++)
	{ 
		if(this.bricks[i].x1 == wx && this.bricks[i].y1 == wy)
		{
			this.bricks[i].onHit();
		}
	}	
};

Grid.prototype.marioLandedOn = function(mario, wx, wy) {
	for(var i = 0; i < this.numTunnels; i++)
	{ 
		if((this.tunnels[i].x1 == wx || this.tunnels[i].x1 == wx - 1 || this.tunnels[i].x1 == wx - 2) && this.tunnels[i].y1 == wy)
		{
			this.tunnels[i].onMarioLand();
		}
	}	
};



Grid.prototype.setX = function(x) {
	if(x > 0)
		x = 0;
	else if(x < this.parentWidth - this.width)
		x = this.parentWidth - this.width;

	this.x = x;
	$(this.container).css('left', x + 'px');
};

Grid.prototype.makeGrid = function() {

	for(var i = 0; i < this.rows; i++)
	{
		for(var j = 0; j < this.cols; j++)
		{
			if(this.grid[i][j] != 0)
			{
				this.container.innerHTML += "<div class=\"abs grid\" id=\""+(i*this.rows+j)+"\"></div>";
				var obj = document.getElementById(""+(i*this.rows+j));
				$(obj).css("left", (i*this.cellWidth)+"px");
				$(obj).css("top", (j*this.cellHeight)+"px");
				$(obj).css("width", this.cellWidth + "px");
				$(obj).css("height", this.cellHeight + "px");
				obj.innerHTML=""+this.grid[i][j];
			}
		}
	}
};

function Mario(world, startX, startY)
{
	this.world = world;
	this.x = startX;
	this.y = startY;
	this.actualX = parseFloat(this.x*this.world.cellWidth);
	this.actualY = parseFloat(this.y*this.world.cellHeight);
	this.width = this.world.cellWidth - 1;
	this.height = 2*this.world.cellHeight;
	this.world.mario = this;
	
	this.jumpvy = 0.7;
	this.maxvy = 0.30;
	this.maxvx = 0.20;
	this.maxax = 0.0005;
	this.gravity = 0.0016;

	this.vx = 0.0;
	this.vy = 0.0;
	this.ax = 0.0;
	this.ay = this.gravity;
	this.standing = true;
	this.onGround = true;
	this.direction = true;
	this.container = this.drawMario();
	this.bubbleContainer = document.getElementById('bubbleContainer');
	
	this.starActivated = false;
	this.starActivationPeriod = 0;

	this.onFallDown = function() {};
	this.gamingTime = 0;
	this.playGamingSound = function() {};
	this.pickedCoin = function() {
		playSound('coin');
	};

	this.stayInWorld = true;
	this.legPosCounter = 0;
	this.legPos = 0;
	this.ypos = 0;
};

Mario.prototype.drawMario = function()
{
	var bubbleText = "<table border=0 class=\"bubble\" cellspacing=\"0\" cellpadding=\"0\"><tr><td class=\"top\" id=\"left\"> </td><td colspan=\"3\" class=\"top\" id=\"center\"> </td><td class=\"top\" id=\"right\"> </td></tr><tr><td colspan=\"5\" class=\"text\"> <p id=\"marioBubbleText\"></p> </tr><tr><td class=\"bottom\" id=\"left\"><td class=\"bottom\" id=\"center\"> </td><td bgcolor=\"#FFFFFF\">  </td><td class=\"bottom\" id=\"center\"> </td><td class=\"bottom\" id=\"right\"> </td></tr><tr><td colspan=\"2\"> </td><td class=\"arrow\"> </td><td colspan=\"2\"> </td></tr></table>";
	this.world.container.innerHTML += "<div class=\"abs stand\" id=\"mario\"> <div id=\"bubbleContainer\"> "+bubbleText+" </div> </div>";

	var wallC = document.getElementById("mario");

	$(wallC).css("width", (this.width)+"px");
	$(wallC).css("height", (this.height)+"px");

	return "#mario";
};

Mario.prototype.move = function(dt)
{
	if(this.stayInWorld)
	{
		this.legPosCounter++;
		if(this.legPosCounter%2 == 0)
		{
			if(!this.standing && this.onGround)
			{
				$(this.container).css('background-position', '-' + (150 + (this.legPos*43)) + ' -'+this.ypos);
				this.legPos++;
				this.legPos %= 3;
			}
			else
			{
				$(".air").css('background-position', '-293 -'+this.ypos);
				$(".stand").css('background-position', '-58 -'+this.ypos);
				$(".sit").css('background-position', '-10 -'+this.ypos);
			}
			if(this.starActivated)
			{
				if(this.starActivationPeriod == 1)
				{
					pauseBackMusic();
					playStarMusic();
				}
				this.ypos = (this.legPosCounter/2 - 1)*70;
				this.starActivationPeriod++;
	//			if(this.starActivationPeriod%38 == 0)
	//				playSound('star');
				if(this.starActivationPeriod < 12)
				{
					$(this.container).css('background-position', '-103 -'+this.ypos);
					$(".air").css('background-position', '-103 -'+this.ypos);
					$(".stand").css('background-position', '-103 -'+this.ypos);
					$(".sit").css('background-position', '-103 -'+this.ypos);
				}
				if(this.starActivationPeriod > 200)
				{
					this.starActivated = false;
					this.ypos = 0;
					playBackMusic();
					pauseStarMusic();
				}
			}
		}
		this.legPosCounter %= 4;
	
		if(this.actualY >= this.world.height - this.height)
		{
			this.onFallDown();
		}
		if(this.x >= this.world.rows-1)
		{
			this.setActualX(0);
		}
		if(this.x < 0)
		{
			this.setActualX(this.world.cellWidth*(this.world.rows-1));
		}
		if(this.standing && this.ax != 0.0 && this.ax*this.vx > -0.00002)
		{
			this.ax = 0.0;
			this.vx = 0.0;
		}
			
		if((this.vx >= this.maxvx || this.vx <= -this.maxvx) && !this.standing)
		{
			this.vx = this.maxvx*this.vx/Math.abs(this.vx);
			this.ax = 0.0;
		}
		if(this.vy > this.maxvy)
			this.vy = this.maxvy;
	
		this.vx += this.ax*dt;
		this.setActualX(this.actualX + this.vx*dt);
	
		if(this.isWallAbove())
		{
			this.vy *= -0.9;
			var x1 = parseInt((this.actualX + 6)/this.world.cellWidth);
			var x2 = parseInt((this.actualX + this.width - 1)/this.world.cellWidth);
			var y1 = parseInt((this.actualY - 1)/this.world.cellHeight);
			while((this.world.grid[x1][y1] != 0 || this.world.grid[x2][y1] != 0))
			{
				y1 = parseInt((this.actualY - 1)/this.world.cellHeight);
				this.setActualY(this.actualY + 1);
			}
			this.setActualY(this.actualY + 1);
		}
	
	
		if(this.direction && this.isWallAhead())
		{
			this.ax = 0;
			this.vx = 0;
		}
		if(!this.direction && this.isWallBehind())
		{
			this.ax = 0;
			this.vx = 0;
		}
		if(!this.isWallBelow())
		{
			this.onGround = false;
			this.updateContainers('air');
			this.vy += this.ay*dt;
			this.setActualY(this.actualY + this.vy*dt);
		}
		if(!this.onGround && this.vy > 0 && this.isWallBelow())
		{
			this.onGround = true;
			if(this.vx == 0.0 || (this.vx*this.ax < 0))
			{
				this.updateContainers('stand');
			}
			else
				this.updateContainers('move');
			this.vy = 0;
		}
	
		this.placeMario();
	}
};

Mario.prototype.isWallAhead = function()
{
	var x1 = parseInt((this.actualX + this.world.cellWidth + 1)/this.world.cellWidth);
	var y1 = parseInt((this.actualY + 1)/this.world.cellHeight);
	var y2 = parseInt((this.actualY + this.world.cellHeight - 1)/this.world.cellHeight);
	var y3 = parseInt((this.actualY + this.height)/this.world.cellHeight);
	while(this.world.grid[x1][y1] != 0 || this.world.grid[x1][y2] != 0  || this.world.grid[x1][y3] != 0)
	{
		this.vx = 0;
		x1 = parseInt((this.actualX + this.world.cellWidth + 1)/this.world.cellWidth);
		this.setActualX(this.actualX - 1);
	}

	return (this.world.grid[x1][y1] != 0 || this.world.grid[x1][y2] != 0 || this.world.grid[x1][y3] != 0);
};

Mario.prototype.isWallBehind = function()
{
	var x1 = parseInt((this.actualX - 1)/this.world.cellWidth);
	var y1 = parseInt((this.actualY + 1)/this.world.cellHeight);
	var y2 = parseInt((this.actualY + this.world.cellHeight - 1)/this.world.cellHeight);
	var y3 = parseInt((this.actualY + this.height)/this.world.cellHeight);
	while(this.world.grid[x1][y1] != 0 || this.world.grid[x1][y2] != 0  || this.world.grid[x1][y3] != 0)
	{
		this.vx = 0;
		x1 = parseInt((this.actualX)/this.world.cellWidth);
		this.setActualX(this.actualX + 1);
	}

	return (this.world.grid[x1][y1] != 0 || this.world.grid[x1][y2] != 0 || this.world.grid[x1][y3] != 0);
};


Mario.prototype.isWallBelow = function()
{
	var x1 = parseInt((this.actualX)/this.world.cellWidth);
	var x2 = parseInt((this.actualX + this.width + 1)/this.world.cellWidth);
	var y1 = parseInt((this.actualY + this.height + 1)/this.world.cellHeight);
	while((this.world.grid[x1][y1] != 0 || this.world.grid[x2][y1] != 0))
	{
		this.vy = 0;
		y1 = parseInt((this.actualY + this.height)/this.world.cellHeight);
		this.setActualY(this.actualY - 1);
	}
	this.setActualY(this.actualY + 1);

	x2 = parseInt((this.actualX + this.world.cellWidth)/this.world.cellWidth);
	y1 = parseInt((this.actualY + this.height + 1)/this.world.cellHeight);
	return (this.world.grid[x1][y1] != 0 || this.world.grid[x2][y1] != 0);
};

Mario.prototype.isWallAbove = function()
{
	var toRet = false;
	if(this.vy < 0)
	{
		var x1 = parseInt((this.actualX + 6)/this.world.cellWidth);
		var x2 = parseInt((this.actualX + this.width - 5)/this.world.cellWidth);
		var y1 = parseInt((this.actualY - 8)/this.world.cellHeight);
		if(this.world.grid[x1][y1] != 0)
		{
			this.world.marioHitBrick(this, x1, y1);
			toRet = true;
		}
		if(this.world.grid[x2][y1] != 0)
		{
			this.world.marioHitBrick(this, x2, y1);
			toRet = true;
		}
	}
	return toRet;

};

Mario.prototype.placeMario = function()
{
	if(this.vx != 0.0)
	{
			this.world.setX(this.world.parentWidth/2 - this.actualX);
	}
	$(this.container).css({top: (this.actualY)+'px', left: (this.actualX)+'px'});
};

Mario.prototype.jump = function()
{
	if(this.onGround && this.isWallBelow())
	{
		this.vy = -this.jumpvy;
		this.updateContainers('air');
		this.setActualY(this.actualY - this.world.cellHeight/2);
	}
};

Mario.prototype.moveForward = function()
{
	if(this.stayInWorld)
	{
		if(!this.direction)
			this.vx = 0;
		this.direction = true;
		this.standing = false;
		if(this.onGround)
			this.updateContainers('move');
	
		this.ax = this.maxax;
	}
};

Mario.prototype.moveBackward = function()
{
	if(this.stayInWorld)
	{
		if(this.direction)
			this.vx = 0;
		this.direction = false;
		this.standing = false;
		if(this.onGround)
			this.updateContainers('move');
	
		this.ax = -this.maxax;
	}
};

Mario.prototype.stopMoving = function()
{
	if(this.stayInWorld)
	{
		this.standing = true;
		if(this.onGround)
			this.updateContainers('stand');
	
		this.ax = (this.direction)?-this.maxax:this.maxax;
	}
};

Mario.prototype.sitDown = function()
{
	if(this.stayInWorld)
		this.world.marioSatDown(this);
	
	if(this.onGround && this.stayInWorld)
		this.updateContainers('sit');
};

Mario.prototype.standUp = function()
{
	this.updateContainers('stand');
};

Mario.prototype.setActualX = function(x)
{
	this.actualX = x;
	this.x = parseInt(this.actualX/this.world.cellWidth);
};
/**
 *
 *	Mario World:
 *	written by Mohit Punjabi
 *
 **/
 
Mario.prototype.setActualY = function(y)
{
	this.actualY = y;
	this.y = parseInt(this.actualY/this.world.cellHeight);
};

Mario.prototype.updateContainers = function(attr)
{
	$(this.container).attr('class', 'abs '+attr);
	if(!this.direction)
	{
		$(this.container).attr('id', 'mario-right');
		this.container = '#mario-right';
	}
	else
	{
		$(this.container).attr('id', 'mario');
		this.container = '#mario';
	}
}

Mario.prototype.setBubbleText = function(text)
{
	document.getElementById('marioBubbleText').innerHTML = text;
};

Mario.prototype.showBubble = function()
{
	$("#bubbleContainer").show();
};

Mario.prototype.hideBubble = function()
{
	$("#bubbleContainer").hide();
};

Mario.prototype.activateStarPower = function()
{
	if(!this.starActivated)
	{
		playSound('powerup');
		pauseBackMusic();
	}
	$(this.container).css('background-position', '-105 -70');
	this.starActivated = true;
};



function Goomba(world, startX, startY, type)
{
	this.world = world;
	if(this.world.grid[startX][startY] != 0)
	{
		alert("ERROR: Goomba placed inside wall!");
		return;
	}

	this.x = startX;
	this.y = startY;
	this.type = type;
	this.actualX = parseFloat(this.x*this.world.cellWidth);
	this.actualY = parseFloat(this.y*this.world.cellHeight);
	this.width = this.world.cellWidth;
	this.height = this.world.cellHeight;

	this.gravity = 0.0005;
	this.vx = 0.075;
	this.vy = 0.0;
	this.ax = 0.0;
	this.ay = this.gravity;
	this.onGround = (this.world.grid[this.x][this.y] != 0);
	this.direction = true;
	this.goombaId = this.world.addGoomba(this);
	this.container = this.drawGoomba();

	this.stayInWorld = true;
	this.legPosCounter = 0;
	this.legPos = 0;
	this.deadCounter = 0;
}

Goomba.prototype.drawGoomba = function()
{
	this.world.container.innerHTML += "<div class=\"abs goomba"+this.type+"\" id=\"goomba"+this.goombaId+"\"> </div>";

	var wallC = document.getElementById("goomba"+this.goombaId);

	$(wallC).css("left", (this.actualX)+"px");
	$(wallC).css("top", (this.actualY)+"px");
	$(wallC).css("width", (this.width)+"px");
	$(wallC).css("height", (this.height)+"px");

	return wallC;
};



Goomba.prototype.move = function(dt)
{
	if(!this.stayInWorld)
	{
		this.deadCounter++;
		if(this.deadCounter > 100)
		{
			this.deadCounter = 0;
			this.stayInWorld = true;
		}
		return;
	}
	
	if(this.y > this.world.cols + 1)
	{
		$(this.container).hide();
		return;
	}
	this.legPosCounter++;
	if(this.legPosCounter%4 == 0)
	{
		$('#goomba'+this.goombaId).css('background-position', '-' + ((this.legPos*41)) + ' 0');
		this.legPos++;
		this.legPos %= 2;
	}
	this.legPosCounter %= 4;

	if(this.x >= this.world.rows-1)
	{
		this.setActualX(0);
	}
	
	if(this.vy > 0.4)
		this.vy = 0.4;
	
	
	if(this.x < 0)
	{
		this.setActualX(this.world.cellWidth*(this.world.rows-1));
	}

	if((this.world.mario.x == this.x-1 || this.world.mario.x == this.x) && this.world.mario.y == this.y - 2 && this.world.mario.vy > 0)
	{
		if(this.stayInWorld)
		{
			playSound('stomp');
			$('#goomba'+this.goombaId).css('background-position', '-82 0');
			this.world.mario.vy *= -2;
			this.stayInWorld = false;
		}
	}
	if(this.world.mario.starActivated && ((this.actualX >= this.world.mario.actualX && this.actualX <= this.world.mario.actualX+this.world.mario.width) && (this.actualY >= this.world.mario.actualY && this.actualY <= this.world.mario.actualY+this.world.mario.height)))
	{
		playSound('stomp');
		$('#goomba'+this.goombaId).css('background-position', '-82 0');
		this.stayInWorld = false;
	}
	if(!this.onGround && this.isWallBelow())
	{
		this.onGround = true;
		this.vy = 0;
		this.setActualY((parseInt((this.actualY + 1)/this.world.cellHeight))*this.world.cellHeight);
	}
	else if(!this.isWallBelow())
	{
		this.onGround = false;
		this.vy += this.ay*dt;
		this.actualY += this.vy*dt;
	}
	else
	{	
		if(this.isWallAhead() && this.direction)
		{
			this.vx *= -1;
			this.direction = !this.direction;
		}
		if(this.isWallBehind() && !this.direction)
		{
			this.vx *= -1;
			this.direction = !this.direction;
		}
	}
	this.setActualY(this.actualY);
	this.setActualX(this.actualX + this.vx*dt);
	this.placeGoomba();
};



Goomba.prototype.isWallAhead = function()
{
	var xm = this.world.mario.x;
	var ym = parseInt((this.world.mario.actualY)/this.world.cellHeight);
	var y1 = parseInt((this.actualY + this.world.cellHeight/2)/this.world.cellHeight);
	var x1 = parseInt((this.actualX + this.world.cellWidth + 3)/this.world.cellWidth);
	return (this.world.grid[x1][y1] != 0 || ((x1 == xm || x1 == xm+1) && (y1 == ym + 2 || y1 == ym + 1 )));
};

Goomba.prototype.isWallBehind = function()
{
	var y1 = parseInt((this.actualY + this.world.cellHeight/2)/this.world.cellHeight);
	var x1 = parseInt((this.actualX - 3)/this.world.cellWidth);
	var xm = this.world.mario.x + 1;
	var ym = this.world.mario.y;

	return (this.world.grid[x1][y1] != 0 || (x1 == xm && (y1 == ym || y1 == ym + 1 )));
};


Goomba.prototype.isWallBelow = function()
{
	var x1 = parseInt((this.actualX + 3)/this.world.cellWidth);
	var x2 = parseInt((this.actualX + this.cellWidth - 3)/this.world.cellWidth);
	var y1 = parseInt((this.actualY + this.world.cellHeight + 1)/this.world.cellHeight);
	return (this.world.grid[x1][y1] != 0 || this.world.grid[x1][y1] != 0);
};

Goomba.prototype.placeGoomba = function()
{
	$('#goomba'+this.goombaId).css({top: (this.actualY)+'px', left: (this.actualX)+'px'});
};

Goomba.prototype.setActualX = function(x)
{
	this.actualX = x;
	this.x = parseInt(this.actualX/this.world.cellWidth);
};

Goomba.prototype.setActualY = function(y)
{
	this.actualY = y;
	this.y = parseInt(this.actualY/this.world.cellHeight);
};




function Star(world, startX, startY)
{
	this.world = world;
	if(this.world.grid[startX][startY] != 0)
	{
		alert("ERROR: Star placed inside wall!");
		return;
	}

	this.x = startX;
	this.y = startY;
	this.actualX = parseFloat(this.x*this.world.cellWidth);
	this.actualY = parseFloat(this.y*this.world.cellHeight);
	this.width = this.world.cellWidth;
	this.height = this.world.cellHeight;

	this.gravity = 0.001;
	this.vx = 0.275;
	this.vy = 0.0;
	this.ax = 0.0;
	this.ay = this.gravity;
	this.onGround = (this.world.grid[this.x][this.y] != 0);
	this.direction = true;
	this.starId = 1;
	this.container = this.drawStar();
	this.stayInWorld = true;
	this.legPosCounter = 0;
	this.legPos = 0;
}

Star.prototype.drawStar = function()
{
	this.world.container.innerHTML += "<div class=\"abs star\" id=\"star"+this.starId+"\"> </div>";

	var wallC = document.getElementById("star"+this.starId);

	$(wallC).css("left", (this.actualX)+"px");
	$(wallC).css("top", (this.actualY)+"px");
	$(wallC).css("width", (this.width)+"px");
	$(wallC).css("height", (this.height)+"px");

	return wallC;
};



Star.prototype.move = function(dt)
{
	
	if(this.y > this.world.cols + 1)
	{
		$(this.container).hide();
		return;
	}
	this.legPosCounter++;
	if(this.legPosCounter%2 == 0)
	{
		$('#star'+this.starId).css('background-position', '-' + ((this.legPos*34)) + ' 0');
		this.legPos++;
		this.legPos %= 4;
	}
	this.legPosCounter %= 2;

	if((this.actualX >= this.world.mario.actualX && this.actualX <= this.world.mario.actualX+this.world.mario.width) && (this.actualY >= this.world.mario.actualY-this.world.cellHeight && this.actualY <= this.world.mario.actualY+this.world.mario.height))
	{
		this.stayInWorld = false;
		$('#star'+this.starId).hide();
		this.world.mario.activateStarPower();
		this.move = function() {};
	}
	if(this.x >= this.world.rows-1)
	{
		this.setActualX(0);
	}
	
	if(this.vy > 0.4)
		this.vy = 0.4;
	
	
	if(this.x < 0)
	{
		this.setActualX(this.world.cellWidth*(this.world.rows-1));
	}

	if(this.isWallBelow())
	{
		this.vy = -0.75;
		this.setActualY((parseInt((this.actualY - 1)/this.world.cellHeight))*this.world.cellHeight);
	}
	else if(!this.isWallBelow())
	{
		this.onGround = false;
		this.vy += this.ay*dt;
		this.actualY += this.vy*dt;
	}
	else
	{	
		if(this.isWallAhead() && this.direction)
		{
			this.vx *= -1.0;
			this.direction = !this.direction;
		}
		if(this.isWallBehind() && !this.direction)
		{
			this.vx *= -1.0;
			this.direction = !this.direction;
		}
	}
	this.setActualY(this.actualY);
	this.setActualX(this.actualX + this.vx*dt);
	this.placeStar();
};



Star.prototype.isWallAhead = function()
{
	var xm = this.world.mario.x;
	var ym = this.world.mario.y;
	var y1 = parseInt((this.actualY + this.world.cellHeight/2)/this.world.cellHeight);
	var x1 = parseInt((this.actualX + this.world.cellWidth + 2)/this.world.cellWidth);
	return (this.world.grid[x1][y1] != 0 || (x1 == xm && (y1 == ym || y1 == ym + 1 )));
};



Star.prototype.isWallBehind = function()
{
	var y1 = parseInt((this.actualY + this.world.cellHeight/2)/this.world.cellHeight);
	var x1 = parseInt((this.actualX - 2)/this.world.cellWidth);
	var xm = this.world.mario.x + 1;
	var ym = this.world.mario.y;

	return (this.world.grid[x1][y1] != 0 || (x1 == xm && (y1 == ym || y1 == ym + 1 )));
};


Star.prototype.isWallBelow = function()
{
	var x1 = parseInt((this.actualX + 3)/this.world.cellWidth);
	var x2 = parseInt((this.actualX + this.cellWidth - 3)/this.world.cellWidth);
	var y1 = parseInt((this.actualY + this.world.cellHeight + 1)/this.world.cellHeight);
	return (y1 > this.world.cols || this.world.grid[x1][y1] != 0 || this.world.grid[x1][y1] != 0);
};

Star.prototype.placeStar = function()
{
	$('#star'+this.starId).css({top: (this.actualY)+'px', left: (this.actualX)+'px'});
};

Star.prototype.setActualX = function(x)
{
	this.actualX = x;
	this.x = parseInt(this.actualX/this.world.cellWidth);
};

Star.prototype.setActualY = function(y)
{
	this.actualY = y;
	this.y = parseInt(this.actualY/this.world.cellHeight);
};




function Fish(world, startVx, startVy, id)
{
	this.world = world;
//	this.x = parseInt(Math.random()*(this.world.rows-20) + 10);
//	this.y = this.world.cols-2;

	this.x= 5;
	this.y= 5;
	this.actualX = parseFloat(this.x*this.world.cellWidth);
	this.actualY = parseFloat(this.y*this.world.cellHeight);
	this.width = this.world.cellWidth;
	this.height = this.world.cellHeight;

	this.gravity = 0.001;
	this.vx = startVx;
	this.vy = startVy;
	this.ax = 0.0;
	this.ay = this.gravity;
	this.fishId = id;
	this.type = 2;
	this.container = this.drawFish();
	this.stayInWorld = true;
	this.legPosCounter = 0;
	this.legPos = 0;
}

Fish.prototype.drawFish = function()
{
	this.world.container.innerHTML += "<div class=\"abs fish\" id=\"fish"+this.fishId+"\"> </div>";

	var wallC = document.getElementById("fish"+this.fishId);

	$(wallC).css("left", (this.actualX)+"px");
	$(wallC).css("top", (this.actualY)+"px");
	$(wallC).css("width", (this.width)+"px");
	$(wallC).css("height", (this.height)+"px");

	return wallC;
};



Fish.prototype.move = function(dt)
{

	if(this.y > this.world.cols + 1 || this.x >= this.world.rows-1 || this.x < 0)
	{
//		this.x = parseInt(Math.random()*(this.world.rows-20) + 10);
		this.x = 30;
		this.y = this.world.cols-5;
		this.setActualY(this.y*this.world.cellHeight);
		this.setActualY(this.x*this.world.cellWidth);
		this.placeFish();
		this.vy = -1.25*Math.random()-0.2;
		this.vx = -Math.random();
		this.type = parseInt(Math.random()*3);
		alert(this.type);
	}
	this.legPosCounter++;
	if(this.legPosCounter%2 == 0)
	{
		$('#fish'+this.fishId).css('background-position', '-' + (((this.legPos+2*this.type)*42)) + ' 0');
		this.legPos++;
		this.legPos %= 2;
	}
	this.legPosCounter %= 2;
	
	if(this.vy > 0.6)
		this.vy = 0.6;

	this.vy += this.ay*dt;
	this.setActualY(this.actualY + this.vy*dt);
	this.setActualX(this.actualX + this.vx*dt);
	this.placeFish();
};


Fish.prototype.placeFish = function()
{
	$('#fish'+this.fishId).css({top: (this.actualY)+'px', left: (this.actualX)+'px'});
};

Fish.prototype.setActualX = function(x)
{
	this.actualX = x;
	this.x = parseInt(this.actualX/this.world.cellWidth);
};

Fish.prototype.setActualY = function(y)
{
	this.actualY = y;
	this.y = parseInt(this.actualY/this.world.cellHeight);
};


function Coin(world, startX, startY)
{
	this.world = world;
	if(this.world.grid[startX][startY] != 0)
		return;

	this.x = startX;
	this.y = startY;
	this.actualX = parseFloat(this.x*this.world.cellWidth);
	this.actualY = parseFloat(this.y*this.world.cellHeight);
	this.width = this.world.cellWidth - 2;
	this.height = this.world.cellHeight;
	this.coinId = this.world.addCoin(this);
	this.container = this.drawCoin();
	this.brick = null;
	this.stayInWorld = true;
	this.legPosCounter = 0;
	this.legPos = 0;
	this.placeCoin();
}

Coin.prototype.drawCoin = function()
{
	this.world.container.innerHTML += "<div class=\"abs coin\" id=\"coin"+this.coinId+"\"> </div>";

	var wallC = document.getElementById("coin"+this.coinId);

	$(wallC).css("left", (this.actualX)+"px");
	$(wallC).css("top", (this.actualY)+"px");
	$(wallC).css("width", (this.width)+"px");
	$(wallC).css("height", (this.height)+"px");

	return wallC;
};



Coin.prototype.move = function(dt)
{
	
	this.legPosCounter++;
	if(this.legPosCounter == 1)
	{
		if(this.legPos == 3)
			this.legPos = 4;
		$('#coin'+this.coinId).css('background-position', '-' + (((this.legPos%3)*32)) + ' 0');
		this.legPos++;
		this.legPos %= 5;
	}
	this.legPosCounter %= 5;

	if((this.actualX >= this.world.mario.actualX && this.actualX <= this.world.mario.actualX+this.world.mario.width) && (this.actualY >= this.world.mario.actualY && this.actualY <= this.world.mario.actualY+this.world.mario.height))
	{
		this.destroy();
	}
};

Coin.prototype.destroy = function() {
		this.stayInWorld = false;
		$('#coin'+this.coinId).hide();
		this.world.mario.pickedCoin();
		if(this.brick)
		{
			this.brick.coin = null;
			this.brick = null;
		}
};

Coin.prototype.placeCoin = function()
{
	$('#coin'+this.coinId).css({top: (this.actualY)+'px', left: (this.actualX + 7)+'px'});
};

Coin.prototype.setActualX = function(x)
{
	this.actualX = x;
	this.x = parseInt(this.actualX/this.world.cellWidth);
};

Coin.prototype.setActualY = function(y)
{
	this.actualY = y;
	this.y = parseInt(this.actualY/this.world.cellHeight);
};




/**
 *	marioworld.js
 *	written by Mohit Punjabi.
 *
 **/