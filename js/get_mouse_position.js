var mouseX = 0;
var mouseY = 0;


//
// grabbing the co-ordinates of the mouse
//

var IE = document.all?true:false;
if (!IE) document.captureEvents(Event.MOUSEMOVE);
document.onmousemove = getMouseXY;

function getMouseXY(e)
{
 // grab the x-y pos if browser is IE
  if (IE)
  {
    mouseX = event.clientX + document.body.scrollLeft;
    mouseY = event.clientY + document.body.scrollTop;
  }

// grab the x-y pos if browser is NS 
  else
  {
    mouseX = e.pageX;
    mouseY = e.pageY;
  }

  // catch possible negative values in NS4
  if (mouseX < 0)mouseX = 0;
  if (mouseY < 0)mouseY = 0;
}