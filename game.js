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
$h.events.listen("mouseDown", function(coords){
	dude.target = coords;
	
	startPoint = coords;
	
});
$h.events.listen("mouseUp", function(coords){
	
	if(!draging){
		dude.moving = true;
	}
	draging = false;
	startPoint = {};
	box = {};
})
$h.events.listen("drag", function(coords){
	draging = true;
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

	var current = $h.vector(dude.x, dude.y);
	var coords = $h.vector(dude.target.x, dude.target.y);

	if((dude.x > dude.target.x - 2 && dude.x < dude.target.x +2) && (dude.y > dude.target.y - 2 && dude.y < dude.target.y + 2)){
		dude.moving = false;
	}
	else{
		if(dude.moving){
			coords = $h.vector.apply(null, $h.vector.apply(null,current.sub(coords.value())).normalize())
			coords = $h.vector.apply(null, coords.multiply(3))
			current = current.add(coords.value());
			dude.x = current[0];
			dude.y = current[1];
		}
		
	}
	

}
$h.render = function(){
	var c = $h.canvas("main");
	c.drawRect(500, 500, 0, 0, "green");
	c.drawRect(dude.width, dude.height, dude.x, dude.y, dude.color);
	c.drawRect(10,10, -5, -5, "red")
	if(draging){
		c.strokeRect(box.width, box.height, box.x, box.y, 2, "red");
		console.log(c);
	}
	

}
$h.loadImages();
$h.run();