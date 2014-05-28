var $h = require("./head-on");
var Entity = require("./entity");
var mouse = require("./mouse");
var camera = new $h.Camera(1000, 600);

var startPoint = {};
var box = {};
var draging;
var scroll = true;
var inputBox = document.createElement("input");
var checkbox = document.createElement("input");
var minicam = new $h.Camera(200,200);
var minimap = $h.canvas.create("minimap",200,200, minicam);
var entities = [];
var selectedEntities = {
  units:[],
};
var canvasMouse;
var minimapMouse;
var background;
var minimapClick;
var percent;
var gameState = {
  init: function(){
    this.state = loadState;
  },
  changeState: function(state){
    this.state = state;
  },
  update: function(delta){
    this.state.update(this, delta);
  },
  render: function(){
    this.state.render();
  }
};
var loadState = {
  update: function(entity){
    if($h.imagesLoaded){
      setTimeout(function(){
        entity.changeState(gamePlay); 
      },2000);
         
    }
  },
  render:function(){
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
var gamePlay = {
  update: function(entity, delta){
    entities.forEach(function(dude){
      dude.update(delta);
    });
  },
  render:function(){
    var c = $h.canvas("main");
    var m = $h.canvas("minimap");
    var mos = camera.project(canvasMouse.mousePos());
    var zero;
    c.clear();
    m.clear();
    
    

    if(scroll || minimapClick){
      background.clear();
      drawMap(background, map, camera);
      scroll = false;
    }
    m.drawRect({
      width:200,
      height:200,
      color:"white",
      x:0,
      y:0,
      camera:false
    });
    drawMap(m, map, minicam);
    m.drawRect(camera.width, camera.height, camera.position.x, camera.position.y, "transparent", {width:2, color:"black"});
    entities.forEach(function(dude){
      dude.render(c);
      dude.minimapRender(m);
    });
    if(draging){
      c.drawRect(box.width, box.height, box.x, box.y, "rgba(0,128, 0, .2)", {color:"green", width:2});
    }
  },
  exit:function(){}
};
$h.canvas.create("master", 1000, 600, camera);
$h.canvas.create("background", 1000, 600, camera);
background = $h.canvas("background");
//background.append("#container");
inputBox = document.body.appendChild(inputBox);
checkbox = document.body.appendChild(checkbox);
checkbox.type = "checkbox";
$h.canvas.create("main", 1000, 600, camera);

canvasMouse = mouse($h.canvas("master").canvas.canvas, camera);
minimapMouse = mouse($h.canvas("minimap").canvas.canvas, minicam);


$h.canvas("master").append("body");
//$h.canvas("main").append("#container");
//$h.canvas("minimap").append("body");
//$h.canvas("main").canvas.canvas.style.border = "1px black solid";
//background.canvas.canvas.style.position = "absolute";
//background.canvas.canvas.style["z-index"] = -1;
//$h.canvas("main").canvas.canvas.style.position = "aboslute";
//$h.canvas("main").canvas.canvas.style["z-index"] = 2;
//$h.canvas("minimap").canvas.canvas.style.border = "1px black solid";
entities.push(
  new Entity(10,10, 20, 20, "blue"),
  new Entity(40, 40, 20, 20, "green"),
  new Entity(70, 90, 40, 40, "red"),
  new Entity(0, 100, 20, 20, "purple"),
  new Entity(0, 150, 20, 20, "black"),
  new Entity(0, 200, 20, 20, "orange"),
  new Entity(60, 110, 20, 20, "pink"),
  new Entity(40, 100, 20, 20, "brown"),
  new Entity(70, 150, 20, 20, "grey"),
  new Entity(70, 150, 20, 20, "grey"),
  new Entity(70, 150, 20, 20, "grey"),
  new Entity(70, 150, 20, 20, "grey"),
  new Entity(70, 150, 20, 20, "grey"),
  new Entity(70, 150, 20, 20, "grey"),
  new Entity(70, 150, 20, 20, "grey"),
  new Entity(70, 150, 20, 20, "grey"),
  new Entity(70, 150, 20, 20, "grey"),
  new Entity(70, 150, 20, 20, "grey"),
  new Entity(70, 150, 20, 20, "grey"),
  new Entity(70, 150, 20, 20, "grey"),
  new Entity(70, 150, 20, 20, "grey"),
  new Entity(70, 150, 20, 20, "grey"),
  new Entity(70, 150, 20, 20, "grey"),
  new Entity(70, 150, 20, 20, "grey"),
  new Entity(70, 150, 20, 20, "grey"),
  new Entity(70, 150, 20, 20, "grey"),
  new Entity(70, 150, 20, 20, "grey"),
  new Entity(70, 150, 20, 20, "grey"),
  new Entity(70, 150, 20, 20, "grey"),
  new Entity(70, 150, 20, 20, "grey"),
  new Entity(70, 150, 20, 20, "grey")
);
entities[2].max_velocity = 300;
var map = {
  width:2000,
  height:2000,
  tileWidth:20,
  tileHeight:20,
  map:genMap(2000,2000,20,20)
};
$h.gamestate = {units:entities};
$h.variable = {
  SEPARATION_CONST: 70,
  NEIGHBOR_RADIUS: 40,
};
inputBox.value = 40;
inputBox.addEventListener("change", function(e){
  $h.variable.NEIGHBOR_RADIUS = parseInt(this.value, 10);
});
checkbox.addEventListener("change", function(e){
  $h.variable.DEBUG = this.checked;
});
canvasMouse.listen("rightMouseDown", function(coords, button){
  //clone selected entities
  
  var group = selectedEntities.units.slice(0);
  //console.log(ocoords);
  if($h.collides({position:coords, width:1, height:1, angle:0}, {position:$h.Vector(800,400), width:200, height:200, angle:0})){
    coords = minicam.project($h.Vector(coords.x - 800, coords.y - 400));
  }else{
    coords = camera.project(coords);
  }
  
	selectedEntities.units.forEach(function(dude){
      var g = dude.group;
      //Remove from old group
      if(g){
        g.splice(g.indexOf(dude), 1);
      }

      dude.target = $h.Vector(coords);
      dude.moving = true;
      dude.group = group;

	});

});
//camera.zoomIn(2);
canvasMouse.listen("leftMouseDown", function(coords, button){
  var c;
  var cpy;
  if($h.collides({position:coords, width:1, height:1, angle:0}, {position:$h.Vector(800,400), width:200, height:200, angle:0})){
    c = minicam.project($h.Vector(coords.x - 800, coords.y - 400));
    //Get the top left of where the camera would be in I clicked there.
    //Camera.moveTo moves the center of the camera to where you clicked
    //We want to bounds check on the top left and bottom right
    cpy = c.sub($h.Vector(camera.width/2, camera.height/2));
    if(cpy.x + camera.width > map.width){
      console.log("hey");
      c.x = map.width - (camera.width/2);
    }else if(cpy.x < 0){
      c.x = (camera.width/2);

    }
    if(cpy.y + camera.height > map.height){
      c.y = map.height - (camera.height/2);
    }else if(cpy.y < 0){
      c.y = (camera.height/2);
    }
    camera.moveTo(c);
    minimapClick = true;
  }else{
    coords = camera.project(coords);
    minimapClick = false;
  }
	startPoint = coords;
	draging = true;
});
canvasMouse.listen("scroll", function(direction){
  scroll = true;
  var scrollx  = 10;
  var scrolly = 10;
  switch(direction){
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
});
canvasMouse.listen("drag", function(coords){
  coords = camera.project(coords);
  box.x = startPoint.x;
  box.y = startPoint.y;
  if(coords.x > startPoint.x){
    box.width = Math.abs(startPoint.x - coords.x);
  }
  else{

    box.width = Math.abs(startPoint.x - coords.x) *-1;
  }
  if(coords.y > startPoint.y){
    box.height = Math.abs(startPoint.y - coords.y);
  }
  else{

    box.height = Math.abs(startPoint.y - coords.y) *-1;
  }

});
canvasMouse.listen("mouseUp", function(coords, button){
  coords = camera.project(coords);
	if(button === 1 && !minimapClick){
		selectEntitiesInSelection(box);
    if(!selectedEntities.units.length){
      entities.forEach(function(dude){
        if($h.collides(dude, {position:$h.Vector(coords.x, coords.y), width:1, height:1, angle:0}, true)){
          dude.selected = true;
          selectedEntities.units.push(dude);
        }
      });
    }
	}
	draging = false;
	startPoint = {};
	box = {};
});


document.addEventListener("webkitpointerlockchange", function(e){
  console.log(e);
}, false);


$h.update(function(delta){
  gameState.update(delta);
});
minicam.zoomOut(10);
minicam.moveTo($h.Vector(1000,1000));
$h.render(function(){
  var master = $h.canvas("master");
  var c = $h.canvas("main");
  var m = $h.canvas("minimap");
  var mos = camera.project(canvasMouse.mousePos());
  var zero;
	gameState.render();
  zero = camera.project($h.Vector(0,0));
  master.clear();
  master.drawImage(background.canvas.canvas, zero.x, zero.y);
  master.drawImage(c.canvas.canvas, zero.x, zero.y);
  master.drawImage(m.canvas.canvas, zero.x + 800, zero.y + 400);
  master.drawRect({
    x:799,
    y:399,
    width:200,
    height:200,
    camera:false,
    color:"transparent",
    stroke:{
      width:4,
      color:"black"
    }
  });
  master.drawImage($h.images("cursor"), mos.x, mos.y);

});
$h.loadImages(
  [
    {name:"cursor", src:"img/cursor.png"},
    

  ],
  function(loaded, total){
  percent = loaded/total;
});
gameState.init();
$h.run();


function selectEntitiesInSelection(box){
  var leader;
	selectedEntities.units.length = 0;
  box = box || {};
	box = normalizeBox(box);

  if(Object.keys(box).length === 0){
    entities.forEach(function(dude){
      dude.selected = false;
    });
    return;
  }

	entities.forEach(function(dude){
		if($h.collides(dude, {width:box.width, height:box.height, angle:0, position:$h.Vector(box.x, box.y)})){
			selectedEntities.units.push(dude);
      dude.selected = true;
		}else{
      dude.selected = false;
    }
	});
  leader = $h.randInt(0, selectedEntities.units.length-1);
  selectedEntities.leader = selectedEntities.units[leader];
}

function normalizeBox(box){
	box = clone(box);
	if(box.height <0){
		box.y += box.height;
		box.height *= -1;
	}
	if(box.width < 0){
		box.x += box.width;
		box.width *= -1;
	}
	return box;
}

function clone(obj) {
    // Handle the 3 simple types, and null or undefined
    if (null === obj || "object" != typeof obj) return obj;
    var copy;
    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}

function drawMap(canvas, map, camera){
  var tileColor ={
    1:"#777CC9",
    0:"#8045BF"
  };
  var tiles = map.map;
  var topleft = {x:0,y:0};
  var topright = {x:0,y:0};
  var botleft = {x:0,y:0};
  var botright = {x:0, y:0};
  for(var y = 0; y < tiles.length; y++){
    topleft.y = y*map.tileHeight;
    topright.y = topleft.y;
    botleft.y = y*map.tileHeight + map.tileHeight;
    botright.y = botleft.y;
    for(var x = 0; x<tiles[y].length; x++){
      if(tiles[y][x] === 0 || tiles[y][x] === 1){
        topleft.x = x*map.tileWidth;
        topright.x = x*map.tileWidth + map.tileWidth;
        botleft.x = topleft.x;
        botright.x = topright.x;
          if(camera.inView(topleft) ||
            camera.inView(topright) ||
            camera.inView(botleft) ||
            camera.inView(botright)
            ){
            canvas.drawRect(map.tileWidth, map.tileHeight, x*map.tileWidth, y*map.tileHeight, tileColor[tiles[y][x]]);
          }
      }
    }
  }
}

function genMap(width, height, tileW, tileH){
  var rows = height/tileH;
  var cols = width/tileW;
  var map = [];
  for(var y = 0; y < rows; y++){
    map[y] = [];
    for(var x = 0; x < cols; x++){
      var rand = $h.randInt(0,100);
      if(rand > 20){
        map[y][x] = 0;
      }else if(rand > 5){
        map[y][x] = 1;
      }else{
        map[y][x] = 2;
      }
    }
  }
  return map;
}
