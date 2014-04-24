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
    target: $h.Vector(50,50),
    selected:false,
    max_velocity:200,
    velocity: $h.Vector(),
    update:function(delta){

      // if(!this.isLeader && this.leader){
      //   this.velocity = this.velocity.add(this.followLeader(this.leader));
      // }else if(this.isLeader){

      //   this.velocity = this.velocity.add(this.arrive(this.target, 50).add(this.separation()))
      // }
      if(this.moving){
        this.velocity = this.velocity.add(this.arrive(this.target, 50).add(this.flock()));
      }
      
      if(this.velocity.length() < 30){
        this.moving = false;
        this.velocity = $h.Vector(0,0);
      }
      this.position = this.position.add(this.velocity.mul(delta/1000));
      $h.gamestate.units.forEach(function(u){
        var correction;
        if(u == this) return;
        if(correction = $h.collides(this, u)){
          if(correction.normal.x){
            this.velocity.x = 0;
          }
          if(correction.normal.y){
            this.velocity.y = 0;
          }
          this.position = this.position.sub($h.Vector(correction.normal.x, correction.normal.y).mul(correction.overlap));
        }
      }.bind(this));
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
      //canvas.drawCircle(this.position.x, this.position.y, 30, "transparent", {width:20, color:"purple"});
    },
    flock: function(){
      return this.alignment().add(this.separation()).add(this.cohesion());
    },

    followLeader: function(leader){
      var tv = leader.velocity;
      var force = $h.Vector(0,0);
   
      // Calculate the ahead point
      tv = tv.normalize();
      tv = tv.mul(50);
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
      force = force.add(this.arrive(behind, 50)); // 50 is the arrive radius
   
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
    alignment: function(){
      var force = $h.Vector(0,0);
      var neighborCount = 0;
      $h.gamestate.units.forEach(function(u){
        if(u != this){
          if(this.position.sub(u.position).length() <= 40){
            force = force.add(u.velocity);
            neighborCount++;
          }
        }
      }.bind(this));

      if(neighborCount !== 0){
        force = force.mul(1/neighborCount);
        force = force.normalize();
      }

      return force;
    },
    cohesion: function(){
      var force = $h.Vector(0,0);
      var neighborCount = 0;
      $h.gamestate.units.forEach(function(u){
        if(u != this){
          if(this.position.sub(u.position).length() <= 40){
            force = force.add(u.position);
            neighborCount++;
          }
        }
      }.bind(this));

      if(neighborCount !== 0){
        force = force.mul(1/neighborCount);
        force = force.sub(this.position);
        force = force.normalize();
      }

      return force;
    },
    separation: function(){

      var force = $h.Vector(0,0);
      var neighborCount = 0;
      for (var i = 0; i < $h.gamestate.units.length; i++) {
          var b = $h.gamestate.units[i];
          if (b != this && this.position.sub(b.position).length() <= 40) {
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
      force = force.mul(100);
      return force;
    },

    setLeader: function(leader){
      this.leader = leader;
    }
   };

   return Entity;
}());
