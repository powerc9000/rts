(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
      delta = delta/1000;
      //console.log(delta);
      var steering ;
      var lastPos = this.position;
      var correction;
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
      this.position = this.position.add(this.velocity.mul(delta));
      $h.gamestate.units.forEach(function(u){
        var correction;
        if(u == this) return;
        correction = $h.collides(this, u, true);
        if(correction){
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
      if($h.variable.DEBUG){
        canvas.drawCircle(this.position.x, this.position.y, $h.variable.NEIGHBOR_RADIUS, "transparent", {width:1, color:this.color});
        canvas.drawLine(this.position, this.position.add(this.velocity), "red");
      }
      
    },
    minimapRender: function(canvas){
      canvas.drawRect(this.width, this.height, this.position.x - this.width/2, this.position.y - this.width/2, "black");
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

},{"./head-on":3}],2:[function(require,module,exports){
var $h = require("./head-on");
var Entity = require("./entity");
var mouse = require("./mouse");
var camera = new $h.Camera(1000, 600);

var startPoint = {};
var box = {};
var draging;
var scroll = true;
var inputBox = document.createElement("input");
var checkbox = document.createElement("input");
var minicam = new $h.Camera(200,200);
var minimap = $h.canvas.create("minimap",200,200, minicam);
var entities = [];
var selectedEntities = {
  units:[],
};
var canvasMouse;
var minimapMouse;
var background;
var minimapClick;
$h.canvas.create("master", 1000, 600, camera);
$h.canvas.create("background", 1000, 600, camera);
background = $h.canvas("background");
//background.append("#container");
inputBox = document.body.appendChild(inputBox);
checkbox = document.body.appendChild(checkbox);
checkbox.type = "checkbox";
$h.canvas.create("main", 1000, 600, camera);

canvasMouse = mouse($h.canvas("master").canvas.canvas, camera);
minimapMouse = mouse($h.canvas("minimap").canvas.canvas, minicam);


$h.canvas("master").append("body");
//$h.canvas("main").append("#container");
//$h.canvas("minimap").append("body");
//$h.canvas("main").canvas.canvas.style.border = "1px black solid";
//background.canvas.canvas.style.position = "absolute";
//background.canvas.canvas.style["z-index"] = -1;
//$h.canvas("main").canvas.canvas.style.position = "aboslute";
//$h.canvas("main").canvas.canvas.style["z-index"] = 2;
//$h.canvas("minimap").canvas.canvas.style.border = "1px black solid";
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
checkbox.addEventListener("change", function(e){
  $h.variable.DEBUG = this.checked;
});
canvasMouse.listen("rightMouseDown", function(coords, button){
  //clone selected entities
  
  var group = selectedEntities.units.slice(0);
  //console.log(ocoords);
  if($h.collides({position:coords, width:1, height:1, angle:0}, {position:$h.Vector(800,400), width:200, height:200, angle:0})){
    coords = minicam.project($h.Vector(coords.x - 800, coords.y - 400));
  }else{
    coords = camera.project(coords);
  }
  
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
  if($h.collides({position:coords, width:1, height:1, angle:0}, {position:$h.Vector(800,400), width:200, height:200, angle:0})){
    camera.moveTo(minicam.project($h.Vector(coords.x - 800, coords.y - 400)));
    minimapClick = true;
  }else{
    coords = camera.project(coords);
    minimapClick = false;
  }
	startPoint = coords;
	draging = true;
});
canvasMouse.listen("scroll", function(direction){
  scroll = true;
  var scrollx  = 10;
  var scrolly = 10;
  switch(direction){
    case "up":
      camera.move($h.Vector(0,-scrolly));
      if(camera.position.y < 0){
        camera.move($h.Vector(0,scrolly));
      }
      break;
    case "down":
      camera.move($h.Vector(0,scrolly));
      if(camera.position.y + camera.height > map.height){
        camera.move($h.Vector(0,-scrolly));
      }
      break;
    case "left":
      camera.move($h.Vector(-scrollx,0));
      if(camera.position.x < 0){
        camera.move($h.Vector(scrollx,0));
      }
      break;
    case "right":
      camera.move($h.Vector(scrollx,0));
      if(camera.position.x + camera.width > map.width){
        camera.move($h.Vector(-scrollx,0));
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
	if(button === 1 && !minimapClick){
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
  var master = $h.canvas("master");
	var c = $h.canvas("main");
  var m = $h.canvas("minimap");
  var mos = camera.project(canvasMouse.mousePos());
  var zero;
	c.clear();
  m.clear();
  
  master.clear();

  if(scroll){
    background.clear();
    drawMap(background, map, camera);
    scroll = false;
  }
  m.drawRect({
    width:200,
    height:200,
    color:"white",
    x:0,
    y:0,
    camera:false
  });
  drawMap(m, map, minicam);
  m.drawRect(camera.width, camera.height, camera.position.x, camera.position.y, "transparent", {width:2, color:"black"});
	entities.forEach(function(dude){
		dude.render(c);
    dude.minimapRender(m);
	});
	if(draging){
		c.drawRect(box.width, box.height, box.x, box.y, "rgba(0,128, 0, .2)", {color:"green", width:2});
	}
  zero = camera.project($h.Vector(0,0));
  master.drawImage(background.canvas.canvas, zero.x, zero.y);
  master.drawImage(c.canvas.canvas, zero.x, zero.y);
  master.drawImage(m.canvas.canvas, zero.x + 800, zero.y + 400);
  master.drawImage($h.images("cursor"), mos.x, mos.y);

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

},{"./entity":1,"./head-on":3,"./mouse":4}],3:[function(require,module,exports){
//     __  __         __           _
//    / / / /__  ____ _____/ /  ____  ____         (_)____
//   / /_/ / _ \/ __ `/ __  /_____/ __ \/ __ \    / / ___/
//  / __  /  __/ /_/ / /_/ /_____/ /_/ / / / /   / (__  )
// /_/ /_/\___/\__,_/\__,_/      \____/_/ /_(_)_/ /____/
//                         /___/
(function(window, undefined){
  "use strict";
  var headOn = (function(){

    var headOn = {

        groups: {},
        _images: {},
        fps: 50,
        imagesLoaded: true,
        gameTime: 0,
        _update:"",
        _render:"",
        _ticks: 0,

        randInt: function(min, max) {
          return Math.floor(Math.random() * (max +1 - min)) + min;
        },
        randFloat: function(min, max) {
          return Math.random() * (max - min) + min;
        },
        events: {
          events: {},
          listen: function(eventName, callback){
            if(!this.events[eventName]){
              this.events[eventName] = [];
            }
            this.events[eventName].push(callback);
          },

          trigger: function(eventName){
            var args = [].splice.call(arguments, 1),
              e = this.events[eventName],
              l,
              i;
            if(e){
              l = e.length;
              for(i = 0; i < l; i++){
                e[i].apply(headOn, args);
              }
            }

          }
        },
        Camera: function(width, height, x, y, zoom){
          this.width = width;
          this.height = height;
          x = x || 0;
          y = y || 0;
          this.position = headOn.Vector(x, y);
          this.dimensions = headOn.Vector(width, height);
          this.center = headOn.Vector(x+width/2, y+height/2);
          this.zoomAmt = zoom || 1;
          return this;
        },
        animate: function(object,keyFrames,callback){
          var that, interval, currentFrame = 0;
          if(!object.animating){
            object.animating = true;
            object.image = keyFrames[0];
            that = this;

            interval = setInterval(function(){
              if(keyFrames.length === currentFrame){
                callback();
                object.animating = false;
                object.image = "";
                clearInterval(interval);
              }
              else{
                currentFrame += 1;
                object.image = keyFrames[currentFrame];
              }
            },1000/this.fps);
          }



        },

        update: function(cb){this._update = cb;},

        render: function(cb){this._render = cb;},

        entity: function(values, parent){
          var i, o, base;
          if (parent && typeof parent === "object") {
            o = Object.create(parent);
          }
          else{
            o = {};
          }
          for(i in values){
            if(values.hasOwnProperty(i)){
              o[i] = values[i];
            }
          }
          return o;
        },
        inherit: function (base, sub) {
          // Avoid instantiating the base class just to setup inheritance
          // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
          // for a polyfill
          sub.prototype = Object.create(base.prototype);
          // Remember the constructor property was set wrong, let's fix it
          sub.prototype.constructor = sub;
          // In ECMAScript5+ (all modern browsers), you can make the constructor property
          // non-enumerable if you define it like this instead
          Object.defineProperty(sub.prototype, 'constructor', {
            enumerable: false,
            value: sub
          });
        },

        extend: function(base, values){
          var i;
          for(i in values){
            if(values.hasOwnProperty(i)){
              base[i] = values[i];
            }
          }
        },
        clone: function (obj) {
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
        },
        collides: function(poly1, poly2, center) {
          var points1 = this.getPoints(poly1, center),
            points2 = this.getPoints(poly2, center),
            i = 0,
            l = points1.length,
            j, k = points2.length,
            normal = {
              x: 0,
              y: 0
            },
            length,
            min1, min2,
            max1, max2,
            interval,
            MTV = null,
            MTV2 = null,
            MN = null,
            dot,
            nextPoint,
            currentPoint;

          if(poly1.type === "circle" && poly2.type ==="circle"){
            return circleCircle(poly1, poly2);
          }else if(poly1.type === "circle"){
            return circleRect(poly1, poly2);
          }else if(poly2.type === "circle"){
            return circleRect(poly2, poly1);
          }


          //loop through the edges of Polygon 1
          for (; i < l; i++) {
            nextPoint = points1[(i == l - 1 ? 0 : i + 1)];
            currentPoint = points1[i];

            //generate the normal for the current edge
            normal.x = -(nextPoint[1] - currentPoint[1]);
            normal.y = (nextPoint[0] - currentPoint[0]);

            //normalize the vector
            length = Math.sqrt(normal.x * normal.x + normal.y * normal.y);
            normal.x /= length;
            normal.y /= length;

            //default min max
            min1 = min2 = -1;
            max1 = max2 = -1;

            //project all vertices from poly1 onto axis
            for (j = 0; j < l; ++j) {
              dot = points1[j][0] * normal.x + points1[j][1] * normal.y;
              if (dot > max1 || max1 === -1) max1 = dot;
              if (dot < min1 || min1 === -1) min1 = dot;
            }

            //project all vertices from poly2 onto axis
            for (j = 0; j < k; ++j) {
              dot = points2[j][0] * normal.x + points2[j][1] * normal.y;
              if (dot > max2 || max2 === -1) max2 = dot;
              if (dot < min2 || min2 === -1) min2 = dot;
            }

            //calculate the minimum translation vector should be negative
            if (min1 < min2) {
              interval = min2 - max1;

              normal.x = -normal.x;
              normal.y = -normal.y;
            } else {
              interval = min1 - max2;
            }

            //exit early if positive
            if (interval >= 0) {
              return false;
            }

            if (MTV === null || interval > MTV) {
              MTV = interval;
              MN = {
                x: normal.x,
                y: normal.y
              };
            }
          }

          //loop through the edges of Polygon 2
          for (i = 0; i < k; i++) {
            nextPoint = points2[(i == k - 1 ? 0 : i + 1)];
            currentPoint = points2[i];

            //generate the normal for the current edge
            normal.x = -(nextPoint[1] - currentPoint[1]);
            normal.y = (nextPoint[0] - currentPoint[0]);

            //normalize the vector
            length = Math.sqrt(normal.x * normal.x + normal.y * normal.y);
            normal.x /= length;
            normal.y /= length;

            //default min max
            min1 = min2 = -1;
            max1 = max2 = -1;

            //project all vertices from poly1 onto axis
            for (j = 0; j < l; ++j) {
              dot = points1[j][0] * normal.x + points1[j][1] * normal.y;
              if (dot > max1 || max1 === -1) max1 = dot;
              if (dot < min1 || min1 === -1) min1 = dot;
            }

            //project all vertices from poly2 onto axis
            for (j = 0; j < k; ++j) {
              dot = points2[j][0] * normal.x + points2[j][1] * normal.y;
              if (dot > max2 || max2 === -1) max2 = dot;
              if (dot < min2 || min2 === -1) min2 = dot;
            }

            //calculate the minimum translation vector should be negative
            if (min1 < min2) {
              interval = min2 - max1;

              normal.x = -normal.x;
              normal.y = -normal.y;
            } else {
              interval = min1 - max2;


            }

            //exit early if positive
            if (interval >= 0) {
              return false;
            }

            if (MTV === null || interval > MTV) MTV = interval;
            if (interval > MTV2 || MTV2 === null) {
              MTV2 = interval;
              MN = {
                x: normal.x,
                y: normal.y
              };
            }
          }

          return {
            overlap: MTV2,
            normal: MN
          };
          function circleRect(circle, rect){
            var newX = circle.position.x * Math.cos(-rect.angle);
            var newY = circle.position.y * Math.sin(-rect.angle);
            var circleDistance = {x:newX, y:newY};
            var cornerDistance_sq;
            circleDistance.x = Math.abs(circle.position.x - rect.position.x);
              circleDistance.y = Math.abs(circle.position.y - rect.position.y);

              if (circleDistance.x > (rect.width/2 + circle.radius)) { return false; }
              if (circleDistance.y > (rect.height/2 + circle.radius)) { return false; }

              if (circleDistance.x <= (rect.width/2)) { return true; }
              if (circleDistance.y <= (rect.height/2)) { return true; }

              cornerDistance_sq = Math.pow(circleDistance.x - rect.width/2,2) +
                                   Math.pow(circleDistance.y - rect.height/2, 2);

              return (cornerDistance_sq <= Math.pow(circle.radius,2));
          }
          function pointInCircle(point, circle){
            return Math.pow(point.x - circle.position.x ,2) + Math.pow(point.y - circle.position.y, 2) < Math.pow(circle.radius,2);
          }
          function circleCircle(ob1, ob2){
            return square(ob2.position.x - ob1.position.x) + square(ob2.position.y - ob1.position.y) <= square(ob1.radius + ob2.radius);
          }
        },

        getPoints: function (obj, center){
          if(obj.type === "circle"){
            return [];
          }
          var x = obj.position.x,
            y = obj.position.y,
            width = obj.width,
            height = obj.height,
            angle = obj.angle,
            that = this,
            h,
            w,
            points = [];
          if(!center){
            points[0] = [x,y];
            points[1] = [];
            points[1].push(Math.sin(-angle) * height + x);
            points[1].push(Math.cos(-angle) * height + y);
            points[2] = [];
            points[2].push(Math.cos(angle) * width + points[1][0]);
            points[2].push(Math.sin(angle) * width + points[1][1]);
            points[3] = [];
            points[3].push(Math.cos(angle) * width + x);
            points[3].push(Math.sin(angle) * width + y);
          }else{
            w = (width/2);
            h = (height/2);
            points[0] = [x-w, y-h];
            points[1] = [x+w, y-h];
            points[2] = [x+w, y+h];
            points[3] = [x-w, y+h];
          }

            //console.log(points);
          return points;

        },

        Timer: function(){
          this.jobs = [];
        },
        pause: function(){
          this.paused = true;
          this.events.trigger("pause");
        },
        unpause: function(){
          this.events.trigger("unpause");
          this.paused = false;
        },
        isPaused: function(){
          return this.paused;
        },
        group: function(groupName, entity){
          if(this.groups[groupName]){
            if(entity){
              this.groups[groupName].push(entity);
            }
          }
          else{
            this.groups[groupName] = [];
            if(entity){
              this.groups[groupName].push(entity);
            }
          }
          return this.groups[groupName];
        },

        loadImages: function(imageArray, imgCallback, allCallback){
          var args, img, total, loaded, timeout, interval, that, cb, imgOnload;
          that = this;
          this.imagesLoaded = false;
          total = imageArray.length;
          if(!total){
            this.imagesLoaded = true;
          }
          loaded = 0;
          imgOnload = function(){
            loaded += 1;
            imgCallback && imgCallback(image.name);
            if(loaded === total){
              allCallback && allCallback();
              that.imagesLoaded = true;
            }
          };
          imageArray.forEach(function(image){
            img = new Image();
            img.src = image.src;
            img.onload = imgOnload;

            that._images[image.name] = img;
          });
        },
        images: function(image){
          if(this._images[image]){
            return this._images[image];
          }
          else{
            return new Image();
          }
        },


        timeout: function(cb, time, scope){
          setTimeout(function(){
            cb.call(scope);
          }, time);
        },

        interval: function(cb, time, scope){
          return setInterval(function(){
            cb.call(scope);
          }, time);
        },
        canvas: function(name){
          if(this === headOn){
            return new this.canvas(name);
          }
          this.canvas = this.canvases[name];
          this.width = this.canvas.width;
          this.height = this.canvas.height;
          return this;
        },

        Vector: function(x, y){
          if(this === headOn){
            return new headOn.Vector(x,y);
          }
          if(typeof x !== "number"){
            if(x){
              this.x = x.x;
              this.y = x.y;
            }else{
              this.x = 0;
              this.y = 0;
            }

          }else{
            this.x = x;
            this.y = y;
          }
          return this;
        },
        run: function(){
          var that = this;
          var then = Date.now();
          var ltime;
          window.requestAnimationFrame(aniframe);
          function aniframe(){
            //We want the time inbetween frames not the time in between frames + time it took to do a frame
            ltime = then;
            if(that.imagesLoaded){
              then = Date.now();
              that.onTick(ltime);

            }
            window.requestAnimationFrame(aniframe);
          }

        },
        onTick: function(then){
          var now = Date.now(),
          modifier = now - then;
          this.trueFps = 1/(modifier/1000);
          this._ticks+=1;
          this._update(modifier, this._ticks);
          this._render(modifier, this._ticks);
          this.gameTime += modifier;

        },
        exception: function(message){
          this.message = message;
          this.name = "Head-on Exception";
          this.toString = function(){
            return this.name + ": " + this.message;
          };
        }
    };

    headOn.canvas.create = function(name, width, height, camera){
      var canvas, ctx;
      if(!camera || !(camera instanceof headOn.Camera)){
        throw new headOn.exception("Canvas must be intialized with a camera");
      }
      canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      ctx = canvas.getContext("2d");
      this.prototype.canvases[name] = {
        canvas: canvas,
        ctx: ctx,
        width: canvas.width,
        height: canvas.height,
        camera: camera
      };
    };
    headOn.canvas.prototype = {
      canvases: {},
      stroke: function(stroke){
        var ctx = this.canvas.ctx;
        ctx.save();
        if(stroke){
          ctx.lineWidth = stroke.width;
          ctx.strokeStyle = stroke.color;
          ctx.stroke();
        }
        ctx.restore();
      },
      drawRect: function(width, height, x, y, color, stroke, rotation){
        var ctx = this.canvas.ctx, mod = 1, camera = this.canvas.camera;
        var obj;
        if(arguments.length === 1 && typeof arguments[0] === "object"){
          obj = arguments[0];
          x = obj.x;
          y = obj.y;
          width = obj.width;
          height = obj.height;
          color = obj.color;
          stroke = obj.stroke;
          rotation = obj.rotation;
        }
        
        ctx.save();
        ctx.beginPath();

        if(rotation){
          ctx.translate(x,y);
          ctx.rotate(rotation);
          ctx.rect(0, 0, width, height);
        }
        else{
          //console.log(camera.position.x)
          if(obj && obj.camera === false){
            ctx.rect(x, y, width, height);
          }else{
            ctx.rect((x - camera.position.x)/camera.zoomAmt , (y - camera.position.y)/camera.zoomAmt , width / camera.zoomAmt, height / camera.zoomAmt);
          }
          
        }
        if(color){
          ctx.fillStyle = color;
        }

        ctx.fill();
        if(typeof stroke === "object" && !isEmpty(stroke)){
          this.stroke(stroke);
        }
        ctx.closePath();
        ctx.restore();
        return this;
      },
      drawCircle: function(x, y, radius, color, stroke){
        var ctx = this.canvas.ctx, camera = this.canvas.camera;
        ctx.save();
        ctx.beginPath();
        ctx.arc((x - camera.position.x)/camera.zoomAmt, (y - camera.position.y)/camera.zoomAmt, radius / camera.zoomAmt, 0, 2*Math.PI, false);
        ctx.fillStyle = color || "black";
        ctx.fill();
        this.stroke(stroke);
        ctx.restore();
        ctx.closePath();
        return this;
      },
      drawImage: function(image,x,y){
        var ctx = this.canvas.ctx;
        var camera = this.canvas.camera;
        var coords = camera.unproject(headOn.Vector(x,y));
        try{
          ctx.drawImage(image,coords.x,coords.y);
        }
        catch(e){
          console.log(image);
        }
        return this;
      },
      drawLine: function(start, end, color){
        var ctx = this.canvas.ctx;
        var camera = this.canvas.camera;
        start = camera.unproject(start);
        end = camera.unproject(end);
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.strokeStyle = color;
        ctx.stroke();
        ctx.restore();
      },
      drawImageRotated: function(image, rotation, x,y){
        var ctx = this.canvas.ctx;
        var radians = rotation * Math.PI / 180;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(radians);
        ctx.drawImage(image, 0-image.width, 0-image.height);
        ctx.restore();
        return this;
      },

      drawText: function(textString, x, y, fontStyle, color, alignment, baseline){
        var ctx = this.canvas.ctx;
        ctx.save();

        if(fontStyle){
          ctx.font = fontStyle + " sans-serif";
        }
        if(color){
          ctx.fillStyle = color;
        }
        if(alignment){
          ctx.textAlign = alignment;
        }
        if(baseline){
          ctx.textBaseline = baseline;
        }

        ctx.fillText(textString,x,y);

        ctx.restore();
        return this;
      },

      append: function(element){
        element = document.querySelector(element);
        if(element){
          element.appendChild(this.canvas.canvas);
        }
        else{
          document.body.appendChild(this.canvas.canvas);
        }
        return this;
      },
      clear: function(){
        var ctx = this.canvas.ctx;
        ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
      },
      setCamera: function(cam){
        this.canvas.camera = cam;
      }
    };
    headOn.Timer.prototype = {
      job: function(time, start){
        var jiff = {
          TTL: time,
          remaining: start || time
        };
        this.jobs.push(jiff);
        return {
          ready: function(){
            return jiff.remaining <= 0;
          },
          reset: function(){
            jiff.remaining = jiff.TTL;
          },
          timeLeft: function(){
            return jiff.remaining;
          }
        };
      },
      update: function(time){
        this.jobs.forEach(function(j){
          j.remaining -= time;
        });
      }
    };
    headOn.Camera.prototype = {
      zoomIn: function(amt){
        this.zoomAmt /= amt;
        this.position = this.center.sub(this.dimensions.mul(this.zoomAmt / 2));
        return this;
      },
      zoomOut: function(amt){
        this.zoomAmt *= amt;
        this.position = this.center.sub(this.dimensions.mul(this.zoomAmt / 2));

        return this;
      },
      move: function(vec){
        this.position = this.position.add(vec);
        this.center = this.position.add(headOn.Vector(this.width, this.height).mul(0.5));
        return this;
      },
      inView: function(vec){
        if(vec.x >= this.position.x && vec.x <= this.position.x + this.width *this.zoomAmt && vec.y >= this.position.y && vec.y <= this.position.y + this.height*this.zoomAmt){
          return true;
        }else{
          return false;
        }
      },
      moveTo: function(vec){
        this.position = vec.sub(this.dimensions.mul(0.5).mul(this.zoomAmt));
        this.center = vec;
      },
      project: function(vec){
        return vec.mul(this.zoomAmt).add(this.position);
      },
      unproject: function(vec){
        return vec.sub(this.position);
      }
    };
    headOn.Vector.prototype = {
      normalize: function(){
        var len = this.length();
        if(len === 0){
          return headOn.Vector(0,0);
        }
        return headOn.Vector(this.x/len, this.y/len);
      },

      normalizeInPlace: function(){
        var len = this.length();
        this.x /= len;
        this.y /= len;
      },
      distance: function(vec2){
        return this.sub(vec2).length();
      },
      dot: function(vec2){
        return vec2.x * this.x + vec2.y * this.y;
      },

      length: function(){
        return Math.sqrt(this.x*this.x + this.y*this.y);
      },

      sub: function(vec2){
        return headOn.Vector(this.x - vec2.x, this.y - vec2.y);
      },

      add: function(vec2){
        return headOn.Vector(this.x + vec2.x, this.y + vec2.y);
      },
      truncate: function(max){
        var i;
        i = max / this.length();
        i = i < 1 ? i : 1;
        return this.mul(i);
      },
      mul: function(scalar){
        return headOn.Vector(this.x * scalar, this.y * scalar);
      }
    };
    function sign(num){
      if(num < 0){
        return -1;
      }else{
        return 1;
      }
    }


    return headOn;
    function square(num){
      return num * num;
    }
    function isEmpty(obj){
      return Object.keys(obj).length === 0;
    }
  }());
  module.exports = headOn;
  window.headOn = headOn;
})(window);

},{}],4:[function(require,module,exports){
//Setup event listeners for the mouse
var $h = require("./head-on");
module.exports = function(obj, camera){
  "use strict";
  var listeners = {};
  obj = obj || window;
  var dragging;

  var mousePos = $h.Vector(obj.width/2, obj.height/2);
  obj.requestPointerLock = obj.requestPointerLock ||
             obj.mozRequestPointerLock ||
             obj.webkitRequestPointerLock;
             obj.requestPointerLock();
  function getCoords(e){
    try{
       var bounds = obj.getBoundingClientRect();
       return {x:e.pageX - bounds.left, y: e.pageY - bounds.top};
     }catch(err){
      return  {x:e.pageX, y: e.pageY};
     }
   
    
  }

  obj.addEventListener("mousedown", function(e){
    obj.requestPointerLock();
    var button = e.which || e.button;
    var coords = getCoords(e);
    if(button === 1){
      dragging = true;
    }
    if(listeners.mousedown){
      listeners.mousedown.call(null, mousePos, button);
    }
    if(listeners.leftmousedown && button === 1){
      listeners.leftmousedown.call(null, mousePos);
    }
    if(listeners.rightmousedown && button === 3){
      listeners.rightmousedown.call(null, mousePos);
    }
  });
  obj.addEventListener("contextmenu", function(e){
    var coords = getCoords(e);
    if(listeners.rightmousedown){
      listeners.rightmousedown.call(null, mousePos);
      e.preventDefault();
    }
  });
  obj.addEventListener("mouseup", function(e){
    var button = e.which || e.button;
    var coords = getCoords(e);
    if(button === 1){
      dragging = false;
    }
    
    if(listeners.mouseup){
      listeners.mouseup.call(null, mousePos, button);
    }
  });
  obj.addEventListener("mousemove", function(e){
    var vec = {x:e.webkitMovementX, y:e.webkitMovementY};
    var scroll = false;
    mousePos = mousePos.add(vec);
    if(mousePos.x > obj.width-5){
      scroll = "right";
      mousePos.x = obj.width-5 ;
    }
    else if(mousePos.x < 0){
      scroll = "left";
      mousePos.x = 0;
    }
    if(mousePos.y > obj.height -5){
      scroll = "down";
      mousePos.y = obj.height -5;
    }else if(mousePos.y < 0){
      scroll = "up";
      mousePos.y = 0;
    }
    if(scroll && listeners.scroll){
      listeners.scroll.call(null, scroll);
    }
    if(listeners.mousemove){
      listeners.mousemove.call(null, mousePos);
    }
    if(listeners.drag){
      if(dragging){
        listeners.drag.call(null, mousePos);
      }
    }
  });
  return{
    listen:function(type, cb){
      listeners[type.toLowerCase()] = cb;
    },
    mousePos:function(){
      return mousePos;
    }
  };

};

},{"./head-on":3}]},{},[2])