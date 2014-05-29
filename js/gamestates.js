var $h = require("./head-on");
var drawMap = require("./mapTools").drawMap;
var getTile = require("./mapTools").getTile;
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
    var fow = $h.canvas("FoW");
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
    fow.clear();
    fow.drawRect({
      x:0,
      y:0,
      width:fow.width,
      height:fow.height,
      camera:false,
      color:"rgba(0,0,0,.6)"
    });
    m.drawRect(camera.width, camera.height, camera.position.x, camera.position.y, "transparent", {width:2, color:"black"});
    fow.canvas.ctx.save();
    fow.canvas.ctx.globalCompositeOperation = "destination-out";
    $h.gamestate.units.forEach(function(dude){
      dude.render(c);
      dude.minimapRender(m);
      var tile = getTile(dude, map);
      //clipArc(fow.canvas.ctx, dude.position.x,dude.position.y, dude.viewDistance, 40);
      fow.drawRect(60,60, dude.position.x-30,dude.position.y-30, "white");
     

    });
    fow.canvas.ctx.restore();
    if($h.gamestate.draging){
      c.drawRect($h.gamestate.box.width, $h.gamestate.box.height, $h.gamestate.box.x, $h.gamestate.box.y, "rgba(0,128, 0, .2)", {color:"green", width:2});
    }
   
    fg.clear();
    fg.drawImage($h.images("cursor"), mos.x, mos.y);
  },
  exit:function(){

  },
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
// var temp = document.createElement('canvas'),
//         tx = temp.getContext('2d');
//         temp.width = 1000;
//         temp.height = 600;
//         tx.translate(-1000, 0);
// function clipArc(ctx, x, y, r, f) {

    
    
//     tx.shadowOffsetX = temp.width;    
//     tx.shadowOffsetY = 0;
//     tx.shadowColor = '#000';
//     tx.shadowBlur = f;
    
//     tx.arc(x, y, r, 0, 2 * Math.PI);
//     tx.closePath();
//     tx.fill();


//     ctx.save();
//     ctx.globalCompositeOperation = 'destination-out';
//     ctx.drawImage(temp, 0, 0);
//     ctx.restore();
// }