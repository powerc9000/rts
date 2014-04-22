var $h = require("./head-on");
var Entity = require("./entity");
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
var selectedEntities = [];
$h.events.listen("rightMouseDown", function(coords, button){
	selectedEntities.forEach(function(dude){
		dude.target = coords;
		dude.moving = true;
	})
	
});
$h.events.listen("leftMouseDown", function(coords, button){
	startPoint = coords;
	draging = true;
})
$h.events.listen("mouseUp", function(coords, button){
	if(button == 0){
		selectEntitiesInSelection(box);
	}
	draging = false;
	startPoint = {};
	box = {};
})
$h.events.listen("drag", function(coords){
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
$h.update(function(){
	
	selectedEntities.forEach(function(dude){
		var current = $h.vector(dude.x, dude.y);
	var coords = $h.vector(dude.target.x, dude.target.y);
		if((dude.x > dude.target.x - 5 && dude.x < dude.target.x +5) && (dude.y > dude.target.y - 5 && dude.y < dude.target.y + 2)){
			dude.moving = false;
		}
		else{
			var colliding = false;
			selectedEntities.forEach(function(d){
				if(d !== dude){
					if($h.collides(dude, d)){
						colliding = true;
					}
					if(!d.moving){
						dude.target.x = d.x+20;
						dude.target.y = d.y+20;
					}
				}
			});
			if(dude.moving){
				var old = {
					x: dude.x,
					y: dude.y
				};
				coords = $h.vector.apply(null, $h.vector.apply(null,current.sub(coords.value())).normalize())
				coords = $h.vector.apply(null, coords.multiply(3))
				current = current.add(coords.value());
				
				dude.x = current[0];
				dude.y = current[1];
		

			}
		}
	});
});
$h.render(function(){
	var c = $h.canvas("main");
	c.drawRect(500, 500, 0, 0, "white");
	entities.forEach(function(dude){
		dude.render(c);
	});
	if(draging){
		c.drawRect(box.width, box.height, box.x, box.y, "rgba(0,128, 0, .2)");
		c.strokeRect(box.width, box.height, box.x, box.y, 2, "green");
	}
	

});
//$h.loadImages();
$h.run();


function selectEntitiesInSelection(box){
	selectedEntities.length = 0;
	console.log("hey!")
	box = normalizeBox(box);
	entities.forEach(function(dude){
		if($h.collides(dude, box)){
			selectedEntities.push(dude);
		}
	});
	console.log(selectedEntities)
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