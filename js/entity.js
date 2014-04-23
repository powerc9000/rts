var $h = require("./head-on");

module.exports = (function(){
  "use strict";
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
    selected:false,
    max_velocity:200,
    velocity: $h.Vector(),
    update:function(delta){

      if(!this.isLeader && this.leader){
        this.velocity = this.velocity.add(this.followLeader(this.leader));
      }else if(this.isLeader){
        console.log("leader")
        this.velocity = this.velocity.add(this.arrive(this.target, 50));
      }
      
      this.position = this.position.add(this.velocity.mul(delta/1000));
    },
    render:function(canvas){
      var stroke = {};
      var color;
      if(this.selected){
        if(this.isLeader){
          color = "yellow";
        }else{
          color = "black";
        }
        stroke = {color:color, width:20};
      }
      canvas.drawRect(this.width, this.height, this.position.x, this.position.y, this.color, stroke);
    },
    followLeader: function(leader){
      var tv = leader.velocity;
      var force = $h.Vector(0,0);
   
      // Calculate the ahead point
      tv = tv.normalize();
      tv = tv.mul(30);
      var ahead = leader.position.add(tv);
   
      // Calculate the behind point
      tv = tv.mul(-1);
      var behind = leader.position.add(tv);
   
      // If the character is on the leader's sight, add a force
      // to evade the route immediately.
      // if (isOnLeaderSight(leader, ahead)) {
      //     force = force.add(this.evade(leader));
      // }
   
      // Creates a force to arrive at the behind point
      force = force.add(this.arrive(behind, 40)); // 50 is the arrive radius
   
      // Add separation force
      force = force.add(this.separation());
   
      return force;
    },
    arrive: function(target, radius){
      var desired_velocity = target.sub(this.position);
      var distance = desired_velocity.length();
       //console.log(distance)
      // Check the distance to detect whether the character
      // is inside the slowing area
      if (distance < radius) {
          // Inside the slowing area
          desired_velocity = desired_velocity.normalize().mul(this.max_velocity).mul(distance/radius);
      } else {
          // Outside the slowing area.
          desired_velocity = desired_velocity.normalize().mul(this.max_velocity);
      }
       
      // Set the steering based on this
      return desired_velocity.sub(this.velocity);
    },

    separation: function(){

      var force = $h.Vector(0,0);
      var neighborCount = 0;
      for (var i = 0; i < $h.gamestate.units.length; i++) {
          var b = $h.gamestate.units[i];
          if (b != this && this.position.sub(b.position).length() <= 30) {
              force.x += b.position.x - this.position.x;
              force.y += b.position.y - this.position.y;
              neighborCount++;
          }
      }
   
      if (neighborCount !== 0) {
          force.x /= neighborCount;
          force.y /= neighborCount;
   
          force = force.mul( -1);
      }
   
      force = force.normalize();
      force = force.mul(20);
      return force;
    },

    setLeader: function(leader){
      this.leader = leader;
    }
   };

   return Entity;
}());
