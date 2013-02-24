var $h = headOn;
$h.canvas.create("main", 500, 500);
$h.canvas("main").append("body");
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
$h.events.listen("mouseClick", function(coords){
	dude.target = coords;
	dude.moving = true;
})
$h.update = function(){

	var current = $h.vector(dude.x, dude.y);
	var coords = $h.vector(dude.target.x, dude.target.y);
	if((dude.x > dude.target.x - 5 && dude.x < dude.target.x +5) && (dude.y > dude.target.y - 5 && dude.y < dude.target.y + 5)){
		console.log("hey!")
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
	$h.canvas("main").drawRect(500, 500, 0, 0, "green");
	$h.canvas("main").drawRect(dude.width, dude.height, dude.x, dude.y, dude.color)

}
$h.loadImages();
$h.run();