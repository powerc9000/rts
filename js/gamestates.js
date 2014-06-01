var $h = require("./head-on");
var drawMap = require("./mapTools").drawMap;
var getTile = require("./mapTools").getTile;
var map = require("./maps").one;
var blur = require("./blur").blur;
var percent = 0;

$h.events.listen("imagesLoadProgess", function(loaded, total){
  percent = (loaded/total);
});
exports.loadState = {
  update: function(entity){
    if($h.imagesLoaded){
      if(!this.done){
        setTimeout(function(){
          console.log("getting out of loading");
          entity.changeState(exports.gamePlay); 
        },2000);
      }
     
      this.done = true;
         
    }
  },
  render:function(){
    var background = $h.canvas("foreground");
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
    if(this.ignoreDelta){
      delta = 0;
      this.ignoreDelta = false;
    }
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
    var miniFow = $h.canvas("miniFoW");
    var background = $h.canvas("background");
    var fg = $h.canvas("foreground");
    var fow = $h.canvas("FoW");
    c.clear();
    m.clear();
    if(this.camMoved){
      this.camMoved = false;
      background.clear();
      drawMap(background, map, camera);
      //$h.canvas("darkness").canvas.canvas.style.top = -camera.position.y;
      //$h.canvas("darkness").canvas.canvas.style.left = -camera.position.x;
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
    
    fow.clear();
    fow.drawRect({
      x:0,
      y:0,
      width:fow.width,
      height:fow.height,
      camera:false,
      color:"rgba(0,0,0,.6)"
    });
    miniFow.clear();
    miniFow.drawRect({
      x:0,
      y:0,
      width:miniFow.width,
      height:miniFow.height,
      camera:false,
      color:"rgba(0,0,0,.6)"
    });
    
    fow.canvas.ctx.save();
    miniFow.canvas.ctx.save();
    fow.canvas.ctx.globalCompositeOperation = "destination-out";
    miniFow.canvas.ctx.globalCompositeOperation = "destination-out";
    $h.gamestate.units.forEach(function(dude){
      dude.render(c);
      dude.minimapRender(m);
      var tile = getTile(dude, map);
      this.grd = fow.createGradient({
        type:"radial",
        start: dude.position,
        end:dude.position,
        radius1:90,
        radius2:100,
      });
      this.grd.addColorStop(0, "white");
      this.grd.addColorStop(0.98, "transparent");
      fow.drawCircle(dude.position.x,dude.position.y,100, grd);
      
      $h.canvas("miniFoW").drawCircle({
        radius:100, 
        x:dude.position.x,
        y:dude.position.y, 
        color:"red",
      });
    });
    miniFow.canvas.ctx.restore();
    fow.canvas.ctx.restore();
    //$h.canvas("small").canvas.ctx.drawImage($h.canvas("darkness").canvas.canvas, 0, 0, 4000/4, 4000/4);
    //blur($h.canvas("FoW").canvas.canvas, 0,0, 1000,1000, 200, 1);
    //fow.canvas.ctx.drawImage($h.canvas("darkness").canvas.canvas, camera.position.x, camera.position.y, camera.width, camera.height, 0,0, 1000, 600);
    //if(++this.frames % 10 === 0){
    //m.canvas.ctx.drawImage($h.canvas("small").canvas.canvas, 0, 0, 200, 200);
    //}
    m.drawImage(miniFow.canvas.canvas, 0,0);
    m.drawRect(camera.width, camera.height, camera.position.x, camera.position.y, "transparent", {width:2, color:"white"});
    m.drawRect({
      x:0,
      y:0,
      width:200,
      height:200,
      camera:false,
      color:"transparent",
      stroke:{
        width:4,
        color:"white"
      }
    });
    if($h.gamestate.draging){
      c.drawRect($h.gamestate.box.width, $h.gamestate.box.height, $h.gamestate.box.x, $h.gamestate.box.y, "rgba(0,128, 0, .2)", {color:"green", width:2});
    }
   
    fg.clear();
    fg.drawImage($h.images("cursor"), mos.x, mos.y);
  },
  exit:function(){
    $h.events.unlisten("cameraMoved", this.event);
  },
  enter: function(){
    this.ignoreDelta = true;
    this.frames = 0;
    this.called = this.called || 0;
    var camera = $h.canvas("main").canvas.camera;
    var background = $h.canvas("background");
    var that = this;
    this.event = $h.events.listen("cameraMoved", function(cam){
      if(camera === cam){
        that.camMoved = true;
      }
    });
    $h.gamestate.canvasMouse.unpause();
    background.clear();
    //console.log(this.called++);
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