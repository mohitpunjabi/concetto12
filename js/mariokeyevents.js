/**
 *
 *	Mario World:
 *	written by Mohit Punjabi
 *
 **/

$(document).keydown(function(key) {

	if(key.keyCode == 27)
	{
		if(theatreOpen)
			closeTheatre();
	}
	if(key.keyCode == 17)
	{
		mario.maxvx = 0.3;
		mario.maxax = 0.0007;
		mario.maxvy = 0.3;
		mario.jumpvy = 0.8;
	}
	if(key.keyCode == 32)
	{
		mario.jump();
		if(mario.onGround)
			playSound('jump-super');
	}
	if(key.keyCode == 39)
		mario.moveForward();
	else if(key.keyCode == 37)
		mario.moveBackward();
	if(key.keyCode == 40)
		mario.sitDown();
});

$(document).keyup(function(key) {
	if(key.keyCode == 17)
	{
		mario.maxvx = 0.2;
		mario.maxvy = 0.3;
		mario.maxax = 0.0005;
		mario.jumpvy = 0.7;
	}
	if(key.keyCode == 39 || key.keyCode == 37)
		mario.stopMoving();
	if(key.keyCode == 40)
		mario.standUp();
});