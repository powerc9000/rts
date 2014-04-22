//Setup event listeners for the mouse
module.exports = function(obj){
  "use strict";
  var listeners = {};
  obj = obj || window;
  var dragging;

  function getCoords(e){
    try{
       var bounds = obj.getBoundingClientRect();
       return {x:e.pageX - bounds.left, y: e.pageY - bounds.top};
     }catch(err){
      return  {x:e.pageX, y: e.pageY};
     }
   
    
  }

  obj.addEventListener("mousedown", function(e){
    var button = e.which || e.button;
    var coords = getCoords(e);
    if(button === 1){
      dragging = true;
    }
    if(listeners.mousedown){
      listeners.mousedown.call(null, coords, button);
    }
    if(listeners.leftmousedown && button === 1){
      listeners.leftmousedown.call(null, coords);
    }
  });
  obj.addEventListener("contextmenu", function(e){
    var coords = getCoords(e);
    if(listeners.rightmousedown){
      listeners.rightmousedown.call(null, coords);
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
      listeners.mouseup.call(null, coords, button);
    }
  });
  obj.addEventListener("mousemove", function(e){
    var coords = getCoords(e);
    if(listeners.mousemove){
      listeners.mousemove.call(null, coords);
    }
    if(listeners.drag){
      if(dragging){
        listeners.drag.call(null, coords);
      }
    }
  });
  return{
    listen:function(type, cb){
      listeners[type.toLowerCase()] = cb;
    }
  };

};
