/**
 *
 *	Mario World:
 *	written by Mohit Punjabi
 *
 **/

(function($){
	$(window).load(function(){
		$("#container").mCustomScrollbar({
			scrollButtons:{
				enable:true
			}
		});
	});
})(jQuery);

var curr = 0;
var total = 3;
var elemWidth;
$(document).ready(function() {
	var heads = document.getElementsByTagName('h1');
	var h = heads[0];
	var hnew = "";
	for(var i = 0; i < h.innerHTML.length; i++)
		hnew += "<span>"+h.innerHTML.charAt(i)+"</span>";
	h.innerHTML = hnew;
	glowText(0);
	if(typeof(showTiles) == 'function')
		showTiles(0);
});

function glowText(i)
{
	var l = $('h1 span').length;
	$('h1 span:eq('+((i + l - 3)%l)+')').attr('class', '');
	$('h1 span:eq('+(i-2)+')').attr('class', 'glow');
	$('h1 span:eq('+(i-1)+')').attr('class', 'glow');
	$('h1 span:eq('+(i)+')').attr('class', 'glow');
	setTimeout("glowText("+((i+1)%(l+6))+")", 125);
}