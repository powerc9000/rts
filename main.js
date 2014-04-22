(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./head-on":3}],2:[function(require,module,exports){
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
},{"./entity":1,"./head-on":3}],3:[function(require,module,exports){
//     __  __         __           _  
//    / / / /__  ____ _____/ /  ____  ____         (_)____
//   / /_/ / _ \/ __ `/ __  /_____/ __ \/ __ \    / / ___/
//  / __  /  __/ /_/ / /_/ /_____/ /_/ / / / /   / (__  ) 
// /_/ /_/\___/\__,_/\__,_/      \____/_/ /_(_)_/ /____/  
//                         /___/    
(function(window, undefined){
  "use strict";
  var headOn = (function(){
    var vectorProto;
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
        collides: function(poly1, poly2) {
          var points1 = this.getPoints(poly1),
            points2 = this.getPoints(poly2),
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

        getPoints: function (obj){
          if(obj.type === "circle"){
            return [];
          }
          var x = obj.position.x,
            y = obj.position.y,
            width = obj.width,
            height = obj.height,
            angle = obj.angle,
            that = this,
            points = [];

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
        onTick: function(then){
          var now = Date.now(),
          modifier = now - then;
            this.trueFps = 1/(modifier/1000);
          this._ticks+=1;
          this._update(modifier, this._ticks);
          this._render(modifier, this._ticks);
          this.gameTime += modifier;

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
          var vec = this.entity({x:x,y:y}, vectorProto);
          return vec;
        },
        run: function(){
          var that = this;
          var then = Date.now();

          window.requestAnimationFrame(aniframe);
          function aniframe(){
            if(that.imagesLoaded){
              that.onTick(then);
              then = Date.now();

            }
            window.requestAnimationFrame(aniframe);
          }

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
          ctx.lineWith = stroke.width;
          ctx.strokeStyle = stroke.color;
          ctx.stroke();
        }
        ctx.restore();
      },
      drawRect: function(width, height, x, y, color, stroke, rotation){
        var ctx = this.canvas.ctx, mod = 1, camera = this.canvas.camera;
        ctx.save();
        ctx.beginPath();

        if(rotation){
          ctx.translate(x,y);
          ctx.rotate(rotation);
          ctx.rect(0, 0, width, height);
        }
        else{
          //console.log(camera.position.x)
          ctx.rect((x - camera.position.x)/camera.zoomAmt , (y - camera.position.y)/camera.zoomAmt , width / camera.zoomAmt, height / camera.zoomAmt);
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
        try{
          ctx.drawImage(image,x,y); 
        }
        catch(e){
          console.log(image);
        }
        return this;
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
      moveTo: function(vec){
        this.position = vec.sub(this.dimensions.mul(0.5).mul(this.zoomAmt));
        this.center = vec;
      }
    };
    vectorProto = {
      normalize: function(){
        var len = this.length();
        return headOn.Vector(this.x/len, this.y/len);
      },

      normalizeInPlace: function(){
        var len = this.length();
        this.x /= len;
        this.y /= len;
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
},{}]},{},[2])