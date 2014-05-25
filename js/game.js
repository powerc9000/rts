var $h = require("./head-on");
var Entity = require("./entity");
var mouse = require("./mouse");
var camera = new $h.Camera(1000, 600);

var startPoint = {};
var box = {};
var draging;
var scroll = true;
var inputBox = document.createElement("input");
var minicam = new $h.Camera(200,200);
var minimap = $h.canvas.create("minimap",200,200, minicam);
var entities = [];
var selectedEntities = {
  units:[],
};
var canvasMouse;
var background;
$h.canvas.create("background", 1000, 600, camera);
background = $h.canvas("background");
background.append("#container");
inputBox = document.body.appendChild(inputBox);
$h.canvas.create("main", 1000, 600, camera);
canvasMouse = mouse($h.canvas("main").canvas.canvas, camera);
$h.canvas("main").append("#container");
$h.canvas("minimap").append("body");
$h.canvas("main").canvas.canvas.style.border = "1px black solid";
background.canvas.canvas.style.position = "absolute";
background.canvas.canvas.style["z-index"] = -1;
$h.canvas("main").canvas.canvas.style.position = "aboslute";
$h.canvas("main").canvas.canvas.style["z-index"] = 2;
$h.canvas("minimap").canvas.canvas.style.border = "1px black solid";
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
canvasMouse.listen("rightMouseDown", function(coords, button){
  //clone selected entities
  coords = camera.project(coords);
  var group = selectedEntities.units.slice(0);
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
  coords = camera.project(coords);
	startPoint = coords;
	draging = true;
});
canvasMouse.listen("scroll", function(direction){
  scroll = true;
  switch(direction){
    case "up":
      camera.move($h.Vector(0,-4));
      if(camera.position.y < 0){
        camera.move($h.Vector(0,4));
      }
      break;
    case "down":
      camera.move($h.Vector(0,4));
      if(camera.position.y + camera.height > map.height){
        camera.move($h.Vector(0,-4));
      }
      break;
    case "left":
      camera.move($h.Vector(-4,0));
      if(camera.position.x < 0){
        camera.move($h.Vector(4,0));
      }
      break;
    case "right":
      camera.move($h.Vector(4,0));
      if(camera.position.x + camera.width > map.width){
        camera.move($h.Vector(-4,0));
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
	if(button === 1){
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


	entities.forEach(function(dude){
    dude.update(delta);
  });

});
minicam.zoomOut(10);
minicam.moveTo($h.Vector(1000,1000));
$h.render(function(){
	var c = $h.canvas("main");
  var m = $h.canvas("minimap");
  var mos = camera.project(canvasMouse.mousePos());
	c.clear();
  m.clear();
  if(scroll){
    background.clear();
    drawMap(background, map, camera);
    scroll = false;
  }

  drawMap(m, map, minicam);
	entities.forEach(function(dude){
		dude.render(c);
    dude.render(m);
	});
	if(draging){
		c.drawRect(box.width, box.height, box.x, box.y, "rgba(0,128, 0, .2)", {color:"green", width:2});
	}
  
  c.drawImage($h.images("cursor"), mos.x, mos.y);

});
$h.loadImages(
  [
    {name:"cursor", src:"img/cursor.png"}
  ]
);
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
      if(tiles[y][x] === 0){
        topleft.x = x*map.tileWidth;
        topright.x = x*map.tileWidth + map.tileWidth;
        botleft.x = topleft.x;
        botright.x = topright.x;
          if(camera.inView(topleft) ||
            camera.inView(topright) ||
            camera.inView(botleft) ||
            camera.inView(botright)
            ){
            canvas.drawRect(map.tileWidth, map.tileHeight, x*map.tileWidth, y*map.tileHeight, "purple");
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
      var rand = $h.randInt(0,20);
      if(rand > 5){
        map[y][x] = 0;
      }else{
        map[y][x] = 1;
      }
    }
  }
  return map;
}
