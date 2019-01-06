//= require cable
//= require_self
//= require_tree .

this.App = {};
App.cable = ActionCable.createConsumer();
App.messages = App.cable.subscriptions.create('LineChannel', {
  received: function(data) {
    drawLine(data.fromx, data.fromy, data.tox, data.toy, data.color)
  }
});

color_input = 'black'

$(document).ready($(function(){
  //vars that should be globally accessed, the document, the canvas, and the canvas context.
  doc = $(document),
  canvas = $('#paper'),
  console.log(canvas)
  ctx = canvas[0].getContext('2d');

  //local vars, previous coords for the client, a random color, a boolean stating if the client is drawing or not, and the time since we last told the server we were drawing.
  var prev = {};
  color = color_input
  var drawing = false;
  var timeSinceLastSend = $.now();
  //event to fire if mouse down or touch on canvas element
  canvas.on("mousedown touchstart", function(e){
    color = color_input
    e.preventDefault();
    //get coords if mouse down
    var x = e.pageX;
    var y = e.pageY;
    //get coords if touch
    if ( e.originalEvent.changedTouches ) {
      e = e.originalEvent.changedTouches[0];
      x = e.pageX;
      y = e.pageY;
    }
    //set drawing to true and the coordinates for the prev object
    //the prev object is used for the start of the drawing line
    drawing = true;
    prev.x = x;
    prev.y = y;
  });
  //event to fire if the mouse is released/left or touched up
  doc.bind('mouseup mouseleave touchend',function(){
    drawing = false;
  });
  //event to fire as the mouse moves or finger is dragged
  doc.on('mousemove touchmove',function(e){
    //if we are drawing, and its been over 10ms since last update
    if(drawing && $.now() - timeSinceLastSend > 10){
      //get mouse coords
      var x = e.pageX;
      var y = e.pageY;
      //if touching, get touch coords
      if ( e.originalEvent.changedTouches ) {
        e = e.originalEvent.changedTouches[0];
        x = e.pageX;
        y = e.pageY;
      }
      //create ajax request to /updateline
      //data is prev coordinates and current coordinates and color
      $.ajax({
        method: "POST",
        url: "/updateline",
        data: {
          'fromx': prev.x,
          'fromy': prev.y,
          'tox': x,
          'toy': y,
          'color': color
        }
      });
      //reset time since last send
      timeSinceLastSend = $.now();
    }
    //draw the line and reset prev
    if(drawing && x && y){
      drawLine(prev.x, prev.y, x, y, color);
      prev.x = x;
      prev.y = y;
    }
  });
}));

//function to draw a line
function drawLine(fromx, fromy, tox, toy, color){
 ctx.beginPath();
 ctx.strokeStyle = color
 ctx.moveTo(fromx, fromy);
 ctx.lineTo(tox, toy);
 ctx.stroke();
}

function colors(obj) {
  switch (obj.id) {
      case "green":
          color_input = "green";
          break;
      case "blue":
          color_input = "blue";
          break;
      case "red":
          color_input = "red";
          break;
      case "yellow":
          color_input = "yellow";
          break;
      case "orange":
          color_input = "orange";
          break;
      case "black":
          color_input = "black";
          break;
  }
}
