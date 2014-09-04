/**
 *
 *	Mario World:
 *	written by Mohit Punjabi
 *
 **/

$('#header').css('top', '-100px');
$('#header #logo-big').fadeOut('fast');
$('#header #logo-small').fadeIn('fast');

$('#show-button').mouseenter(function() {
	$('#header #logo-small').fadeOut('fast');
	$('#header #logo-big').fadeIn('fast');
	$('#header').css('top', '0px');	
});


$('#container').mousemove(function(e) {
		if(mario.vx == 0.0)
		{
				if(e.clientX > world.parentWidth - 100)
			{
				world.setX(world.x - 20);
			}
			else if(e.clientX < 100)
			{
				world.setX(world.x + 20);
			}
		}
});

$('#container').mouseenter(function(e) {
	$('#header').css('top', '-100px');
	$('#header #logo-big').fadeOut('fast');
	$('#header #logo-small').fadeIn('fast');
});