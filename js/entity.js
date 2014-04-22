var $h = require("./head-on");

module.exports = (function(){
   function Entity(x, y, width, height, color){
    this.position = $h.Vector(x||0, y||0);
    this.width = width;
    this.height = height;
    this.color = color;
    return this;
   }

   Entity.prototype = {
    position: $h.Vector(0,0),
    angle:0,
    width:0,
    height:0,
    speed:0,
    a:0,
    target: $h.Vector(0,0),
    v: $h.Vector(0,0),
    update:function(){},
    render:function(canvas){
      canvas.drawRect(this.width, this.height, this.position.x, this.position.y, this.color);
    }
   };

   return Entity;
}());
