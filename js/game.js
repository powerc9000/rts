var $h = require("./head-on");
var Entity = require("./entity");
var mouse = require("./mouse");
var camera = new $h.Camera(500, 500);
$h.canvas.create("main", 500, 500, camera);
$h.canvas("main").append("body");
var startPoint = {};
var box = {};
var draging;

var dude = new Entity(10,10, 20, 20, "blue");
var dude2 = new Entity(40, 40, 20, 20, "green");
var dude3 = new Entity(70, 90, 20, 20, "red");

var entities = [dude, dude2, dude3];
var selectedEntities = {
  units:[],
};
var canvasMouse = mouse($h.canvas("main").canvas.canvas);
$h.gamestate = {units:entities};
canvasMouse.listen("rightMouseDown", function(coords, button){
	selectedEntities.units.forEach(function(dude){
    if(dude === selectedEntities.leader){
      dude.isLeader = true;
      dude.target = $h.Vector(coords);
    }else{
      dude.isLeader = false;
      dude.setLeader(selectedEntities.leader);
    }
		
	});
	
});
canvasMouse.listen("leftMouseDown", function(coords, button){
	startPoint = coords;
	draging = true;
});
canvasMouse.listen("mouseUp", function(coords, button){
	if(button === 1){
		selectEntitiesInSelection(box);
    if(!selectedEntities.units.length){
      entities.forEach(function(dude){
        if($h.collides(dude, {position:$h.Vector(coords.x, coords.y), width:1, height:1, angle:0})){
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
canvasMouse.listen("drag", function(coords){
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
$h.update(function(delta){
	entities.forEach(function(dude){
    dude.update(delta);
  });
	
});
$h.render(function(){
	var c = $h.canvas("main");
	c.drawRect(500, 500, 0, 0, "white");
	entities.forEach(function(dude){
		dude.render(c);
	});
	if(draging){
		c.drawRect(box.width, box.height, box.x, box.y, "rgba(0,128, 0, .2)", {color:"green", width:2});
	}
	

});
//$h.loadImages();
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