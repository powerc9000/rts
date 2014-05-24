//Setup event listeners for the mouse
var $h = require("./head-on");
module.exports = function(obj, camera){
  "use strict";
  var listeners = {};
  obj = obj || window;
  var dragging;

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
    var coords = getCoords(e);
    if(listeners.rightmousedown){
      listeners.rightmousedown.call(null, mousePos);
      e.preventDefault();
    }
  });
  obj.addEventListener("mouseup", function(e){
    var button = e.which || e.button;
    var coords = getCoords(e);
    if(button === 1){
      dragging = false;
    }
    
    if(listeners.mouseup){
      listeners.mouseup.call(null, mousePos, button);
    }
  });
  obj.addEventListener("mousemove", function(e){
    var vec = {x:e.webkitMovementX, y:e.webkitMovementY};
    var scroll = false;
    mousePos = mousePos.add(vec);
    if(mousePos.x > obj.width-5){
      scroll = "right";
      mousePos.x = obj.width-5 ;
    }
    else if(mousePos.x < 0){
      scroll = "left";
      mousePos.x = 0;
    }
    if(mousePos.y > obj.height -5){
      scroll = "down";
      mousePos.y = obj.height -5;
    }else if(mousePos.y < 0){
      scroll = "up";
      mousePos.y = 0;
    }
    if(scroll && listeners.scroll){
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
    }
  };

};
