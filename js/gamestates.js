var $h = require("./head-on");
var drawMap = require("./mapTools").drawMap;
var map = require("./maps").one;
var percent = 0;
$h.events.listen("imagesLoadProgess", function(loaded, total){
  percent = (loaded/total);
});
exports.loadState = {
  update: function(entity){
    if($h.imagesLoaded){
      setTimeout(function(){
        entity.changeState(exports.gamePlay); 
      },2000);
         
    }
  },
  render:function(){
    var background = $h.canvas("background");
    background.clear();
    background.drawRect({
      x:0,
      y:0,
      width:background.width,
      height:background.height,
      color:"purple",
      camera:false
    });
    background.drawText("Loading: "+(percent*100)+"%", background.width/2, background.height/2, false, "white", "center");
  },
  exit:function(){}
};
exports.gamePlay = {
  update: function(entity, delta){
    var camera = $h.canvas("main").canvas.camera;
    $h.gamestate.units.forEach(function(dude){
      dude.update(delta);
    });
    if($h.paused){
      entity.changeState(exports.pausedState);
    }
    var scrollx  = 10;
    var scrolly = 10;

    if($h.gamestate.scroll){
      switch($h.gamestate.scrollDirection){
        case "up":
          camera.move($h.Vector(0,-scrolly));
          if(camera.position.y < 0){
            camera.move($h.Vector(0,scrolly));
          }
          break;
        case "down":
          camera.move($h.Vector(0,scrolly));
          if(camera.position.y + camera.height > map.height){
            camera.move($h.Vector(0,-scrolly));
          }
          break;
        case "left":
          camera.move($h.Vector(-scrollx,0));
          if(camera.position.x < 0){
            camera.move($h.Vector(scrollx,0));
          }
          break;
        case "right":
          camera.move($h.Vector(scrollx,0));
          if(camera.position.x + camera.width > map.width){
            camera.move($h.Vector(-scrollx,0));
          }
          break;

      }
    }
   
  },
  render:function(){
    var camera = $h.canvas("main").canvas.camera;
    var c = $h.canvas("main");
    var m = $h.canvas("minimap");
    var mos = camera.project($h.gamestate.canvasMouse.mousePos());
    var zero;
    var background = $h.canvas("background");
    var fg = $h.canvas("foreground");
    c.clear();
    m.clear();
    
    

    if(scroll || minimapClick){
      background.clear();
      drawMap(background, map, camera);
      //scroll = false;
    }
    m.drawRect({
      width:200,
      height:200,
      color:"white",
      x:0,
      y:0,
      camera:false
    });
    //drawMap(m, map, minicam);
    m.drawImage($h.canvas("minibg").canvas.canvas, 0,0);
    m.drawRect({
      x:0,
      y:0,
      width:200,
      height:200,
      camera:false,
      color:"transparent",
      stroke:{
        width:4,
        color:"black"
      }
    });
    m.drawRect(camera.width, camera.height, camera.position.x, camera.position.y, "transparent", {width:2, color:"black"});
    $h.gamestate.units.forEach(function(dude){
      dude.render(c);
      dude.minimapRender(m);
    });
    if($h.gamestate.draging){
      c.drawRect($h.gamestate.box.width, $h.gamestate.box.height, $h.gamestate.box.x, $h.gamestate.box.y, "rgba(0,128, 0, .2)", {color:"green", width:2});
    }
    fg.clear();
    fg.drawImage($h.images("cursor"), mos.x, mos.y);
  },
  exit:function(){},
  enter: function(){

    var camera = $h.canvas("main").canvas.camera;
    var background = $h.canvas("background");
    $h.gamestate.canvasMouse.unpause();
    background.clear();
    drawMap(background, map, camera);
  }
};
exports.pausedState = {
  update:function(entity, delta){
    if(!$h.paused){
      entity.changeState(exports.gamePlay);
    }
  },
  render: function(entity){
  },
  enter:function(){
    var fg = $h.canvas("foreground");
    fg.drawRect({
      width:fg.width,
      height:fg.height,
      x:0,
      y:0,
      camera:false,
      color:"rgba(0,0,0,.9)"
    });
    fg.drawText("paused", fg.width/2, fg.height/2, false, "white", "center");
  },
  exit:function(){
    var fg = $h.canvas("foreground");
    fg.clear();
  }
};