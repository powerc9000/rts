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
    moveTries: 0,
    velocity: $h.Vector(),
    update:function(delta){
      var steering ;
      var lastPos = this.position;
      // if(!this.isLeader && this.leader){
      //   this.velocity = this.velocity.add(this.followLeader(this.leader));
      // }else if(this.isLeader){

      //   this.velocity = this.velocity.add(this.arrive(this.target, 50).add(this.separation()))
      // }
      //if(this.moving){
        steering = this.arrive(this.target, 70).add(this.flock()).add(this.collisionAvoidance());
        this.velocity = this.velocity.add(steering);
        this.velocity = this.velocity.truncate(this.max_velocity);
     // }
      
      if(this.velocity.length() < 20){
        this.moving = false;
        this.velocity = $h.Vector(0,0);
      }
      this.position = this.position.add(this.velocity.mul(delta/1000));
      $h.gamestate.units.forEach(function(u){
        var correction;
        if(u == this) return;
        if(correction = $h.collides(this, u, true)){
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
        stroke = {color:color, width:2};
      }
     
      if(this.moving){
        canvas.drawLine(this.position, this.target, "black");
      }
      canvas.drawRect(this.width, this.height, this.position.x - this.width/2, this.position.y - this.width/2, this.color, stroke);
      canvas.drawCircle(this.position.x, this.position.y, $h.variable.NEIGHBOR_RADIUS, "transparent", {width:1, color:this.color});
      canvas.drawLine(this.position, this.position.add(this.velocity), "red");
    },
    flock: function(){
      return this.alignment().add(this.separation()).add(this.cohesion());
    },
    collisionAvoidance: function(){
      var MAX_AVOID_FORCE = 70;
      var dynamicLength = this.velocity.length() / this.max_velocity;
      var ahead = this.position.add(this.velocity.normalize().mul(dynamicLength)); // calculate the ahead vector
      var ahead2 = ahead.mul(0.5); // calculate the ahead2 vector
    
      var mostThreatening  = this.findMostThreateningObstacle(ahead, ahead2);
     
      var avoidance = new $h.Vector(0,0);
    
      if (mostThreatening !== null) {
          
          avoidance = ahead.sub(mostThreatening);
          avoidance = avoidance.normalize();
          avoidance = avoidance.mul(MAX_AVOID_FORCE);
      } else {
          avoidance = avoidance.mul(0); // nullify the avoidance force
      }
    
       return avoidance;
    },
    findMostThreateningObstacle: function(ahead, ahead2){
      var mostThreatening = null;
      $h.gamestate.units.forEach(function(u){
        if(this.group.indexOf(u) > -1 || this === u) return;
        u = u.position;
        var collision  = ahead.distance(u) <= 30 || ahead2.distance(u) <= 30;
        //console.log(collision);
        //console.log(ahead)
        // "position" is the character's current position
        if (collision && (mostThreatening === null || this.position.distance(u) < this.position.distance(mostThreatening))) {
            mostThreatening = u;
        }
      }.bind(this));
      return mostThreatening;
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
      this.group = this.group || [];
      this.group.forEach(function(u){
        if(u != this){
          if(this.position.sub(u.position).length() <= $h.variable.NEIGHBOR_RADIUS){
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
      this.group.forEach(function(u){
        if(u != this){
          if(this.position.sub(u.position).length() <= $h.variable.NEIGHBOR_RADIUS){
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
      for (var i = 0; i < this.group.length; i++) {
          var b = this.group[i];
          if (b != this && this.position.sub(b.position).length() <= $h.variable.NEIGHBOR_RADIUS) {
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
      force = force.mul($h.variable.SEPARATION_CONST);
      return force;
    },

    setLeader: function(leader){
      this.leader = leader;
    }
   };

   return Entity;
}());
