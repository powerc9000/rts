//Setup event listeners for the mouse
var $h = require("./head-on");
module.exports = function(obj, camera){
  "use strict";
  var listeners = {};
  obj = obj || window;
  var dragging;
  var paused = true;
  var mousePos = $h.Vector(obj.width/2, obj.height/2);
  obj.requestPointerLock = obj.requestPointerLock ||
             obj.mozRequestPointerLock ||
             obj.webkitRequestPointerLock;
             obj.requestPointerLock();
  function getCoords(e){
    try{
       var bounds = obj.getBoundingClientRect();
       return {x:e.pageX - bounds.left, y: e.pageY - bounds.top};
     }catch(err){
      return  {x:e.pageX, y: e.pageY};
     }
   
    
  }

  obj.addEventListener("mousedown", function(e){
    if(paused) return;
    obj.requestPointerLock();
    var button = e.which || e.button;
    var coords = getCoords(e);
    if(button === 1){
      dragging = true;
    }
    if(listeners.mousedown){
      listeners.mousedown.call(null, mousePos, button);
    }
    if(listeners.leftmousedown && button === 1){
      listeners.leftmousedown.call(null, mousePos);
    }
    if(listeners.rightmousedown && button === 3){
      listeners.rightmousedown.call(null, mousePos);
    }
  });
  obj.addEventListener("contextmenu", function(e){
    if(paused) return;
    var coords = getCoords(e);
    if(listeners.rightmousedown){
      listeners.rightmousedown.call(null, mousePos);
      e.preventDefault();
    }
  });
  obj.addEventListener("mouseup", function(e){
    if(paused) return;
    var button = e.which || e.button;
    var coords = getCoords(e);
    if(button === 1){
      dragging = false;
    }
    
    if(listeners.mouseup){
      listeners.mouseup.call(null, mousePos, button);
    }
  });
  var scroll = false;
  obj.addEventListener("mousemove", function(e){
    if(paused) return;
    var vec = {x:e.webkitMovementX, y:e.webkitMovementY};
    mousePos = mousePos.add(vec);
    if(mousePos.x > obj.width-10){
      scroll = "right";
    }
    else if(mousePos.x < 10){
      scroll = "left";
    }
    else if(mousePos.y > obj.height -10){
      scroll = "down";
    }else if(mousePos.y < 10){
      scroll = "up";
      
    }else{
      scroll = false;
    }
    keepMouseInBounds();
    if(listeners.scroll){
      listeners.scroll.call(null, scroll);
    }
    if(listeners.mousemove){
      listeners.mousemove.call(null, mousePos);
    }
    if(listeners.drag){
      if(dragging){
        listeners.drag.call(null, mousePos);
      }
    }
  });
  return{
    listen:function(type, cb){
      listeners[type.toLowerCase()] = cb;
    },
    mousePos:function(){
      return mousePos;
    },
    pause: function(){
      paused = true;
    },
    unpause: function(){
      paused = false;
    }
  };
  function keepMouseInBounds(){
    if(mousePos.x > obj.width){
      mousePos.x = obj.width;
    }
    if(mousePos.y > obj.height){
      mousePos.y = obj.height;
    }
    if(mousePos.x < 0){
      mousePos.x = 0;
    }
    if(mousePos.y < 0){
      mousePos.y = 0;
    }
  }

};
