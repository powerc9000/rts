var $h = headOn;
$h.canvas.create("main", 500, 500);
$h.canvas("main").append("body");
var startPoint = {};
var box = {};
var draging;
var dude = {
	x:10,
	y:10,
	width:20,
	height:20,
	color:"blue",
	target:{
		x:0,
		y:0
	},
	moving: false
};
var dude2 ={
	x:40,
	y:40,
	width:20,
	height:20,
	color:"green",
	target:{
		x:0,
		y:0
	},
}
var dude3 = {
	x:70,
	y:90,
	width:20,
	height:20,
	color:"red",
	target:{
		x:0,
		y:0
	},
}
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
$h.update = function(){
	
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
				}
				coords = $h.vector.apply(null, $h.vector.apply(null,current.sub(coords.value())).normalize())
				coords = $h.vector.apply(null, coords.multiply(3))
				current = current.add(coords.value());
				
				dude.x = current[0];
				dude.y = current[1];
				// if(colliding){
				// 	if($h.randInt(0, 1)){
				// 		dude.x = old.x - $h.randInt(1,2);
				// 		dude.y = old.y - $h.randInt(1,2);
				// 	}
				// 	else{
				// 		dude.x = old.x + $h.randInt(1,2);
				// 		dude.y = old.y + $h.randInt(1,2);
				// 	}
				// }

			}
			
		}
	})
	
	

}
$h.render = function(){
	var c = $h.canvas("main");
	c.drawRect(500, 500, 0, 0, "white");
	c.drawRect(dude.width, dude.height, dude.x, dude.y, dude.color);
	entities.forEach(function(dude){
		c.drawRect(dude.width, dude.height, dude.x, dude.y, dude.color);
	})
	if(draging){
		c.drawRect(box.width, box.height, box.x, box.y, "rgba(0,128, 0, .2)")
		c.strokeRect(box.width, box.height, box.x, box.y, 2, "green");
	}
	

}
$h.loadImages();
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
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        var copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        var copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        var copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}