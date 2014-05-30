(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* StackBoxBlur - a fast almost Box Blur For Canvas

// Version:  0.3
// Author:   Mario Klingemann
// Contact:  mario@quasimondo.com
// Website:  http://www.quasimondo.com/
// Twitter:  @quasimondo

// In case you find this class useful - especially in commercial projects -
// I am not totally unhappy for a small donation to my PayPal account
// mario@quasimondo.de

// Copyright (c) 2010 Mario Klingemann

// Permission is hereby granted, free of charge, to any person
// obtaining a copy of this software and associated documentation
// files (the "Software"), to deal in the Software without
// restriction, including without limitation the rights to use,
// copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the
// Software is furnished to do so, subject to the following
// conditions:

// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
// OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
// WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
// OTHER DEALINGS IN THE SOFTWARE.
*/
/*
var mul_table = [ 1,57,41,21,203,34,97,73,227,91,149,62,105,45,39,137,241,107,3,173,39,71,65,238,219,101,187,87,81,151,141,133,249,117,221,209,197,187,177,169,5,153,73,139,133,127,243,233,223,107,103,99,191,23,177,171,165,159,77,149,9,139,135,131,253,245,119,231,224,109,211,103,25,195,189,23,45,175,171,83,81,79,155,151,147,9,141,137,67,131,129,251,123,30,235,115,113,221,217,53,13,51,50,49,193,189,185,91,179,175,43,169,83,163,5,79,155,19,75,147,145,143,35,69,17,67,33,65,255,251,247,243,239,59,29,229,113,111,219,27,213,105,207,51,201,199,49,193,191,47,93,183,181,179,11,87,43,85,167,165,163,161,159,157,155,77,19,75,37,73,145,143,141,35,138,137,135,67,33,131,129,255,63,250,247,61,121,239,237,117,29,229,227,225,111,55,109,216,213,211,209,207,205,203,201,199,197,195,193,48,190,47,93,185,183,181,179,178,176,175,173,171,85,21,167,165,41,163,161,5,79,157,78,154,153,19,75,149,74,147,73,144,143,71,141,140,139,137,17,135,134,133,66,131,65,129,1];
        
   
var shg_table = [0,9,10,10,14,12,14,14,16,15,16,15,16,15,15,17,18,17,12,18,16,17,17,19,19,18,19,18,18,19,19,19,20,19,20,20,20,20,20,20,15,20,19,20,20,20,21,21,21,20,20,20,21,18,21,21,21,21,20,21,17,21,21,21,22,22,21,22,22,21,22,21,19,22,22,19,20,22,22,21,21,21,22,22,22,18,22,22,21,22,22,23,22,20,23,22,22,23,23,21,19,21,21,21,23,23,23,22,23,23,21,23,22,23,18,22,23,20,22,23,23,23,21,22,20,22,21,22,24,24,24,24,24,22,21,24,23,23,24,21,24,23,24,22,24,24,22,24,24,22,23,24,24,24,20,23,22,23,24,24,24,24,24,24,24,23,21,23,22,23,24,24,24,22,24,24,24,23,22,24,24,25,23,25,25,23,24,25,25,24,22,25,25,25,24,23,24,25,25,25,25,25,25,25,25,25,25,25,25,23,25,23,24,25,25,25,25,25,25,25,25,25,24,22,25,25,23,25,25,20,24,25,24,25,25,22,24,25,24,25,24,25,25,24,25,25,25,25,22,25,25,25,24,25,24,25,18];
*/

var mul_table = [ 1,171,205,293,57,373,79,137,241,27,391,357,41,19,283,265,497,469,443,421,25,191,365,349,335,161,155,149,9,278,269,261,505,245,475,231,449,437,213,415,405,395,193,377,369,361,353,345,169,331,325,319,313,307,301,37,145,285,281,69,271,267,263,259,509,501,493,243,479,118,465,459,113,446,55,435,429,423,209,413,51,403,199,393,97,3,379,375,371,367,363,359,355,351,347,43,85,337,333,165,327,323,5,317,157,311,77,305,303,75,297,294,73,289,287,71,141,279,277,275,68,135,67,133,33,262,260,129,511,507,503,499,495,491,61,121,481,477,237,235,467,232,115,457,227,451,7,445,221,439,218,433,215,427,425,211,419,417,207,411,409,203,202,401,399,396,197,49,389,387,385,383,95,189,47,187,93,185,23,183,91,181,45,179,89,177,11,175,87,173,345,343,341,339,337,21,167,83,331,329,327,163,81,323,321,319,159,79,315,313,39,155,309,307,153,305,303,151,75,299,149,37,295,147,73,291,145,289,287,143,285,71,141,281,35,279,139,69,275,137,273,17,271,135,269,267,133,265,33,263,131,261,130,259,129,257,1];
        
   
var shg_table = [0,9,10,11,9,12,10,11,12,9,13,13,10,9,13,13,14,14,14,14,10,13,14,14,14,13,13,13,9,14,14,14,15,14,15,14,15,15,14,15,15,15,14,15,15,15,15,15,14,15,15,15,15,15,15,12,14,15,15,13,15,15,15,15,16,16,16,15,16,14,16,16,14,16,13,16,16,16,15,16,13,16,15,16,14,9,16,16,16,16,16,16,16,16,16,13,14,16,16,15,16,16,10,16,15,16,14,16,16,14,16,16,14,16,16,14,15,16,16,16,14,15,14,15,13,16,16,15,17,17,17,17,17,17,14,15,17,17,16,16,17,16,15,17,16,17,11,17,16,17,16,17,16,17,17,16,17,17,16,17,17,16,16,17,17,17,16,14,17,17,17,17,15,16,14,16,15,16,13,16,15,16,14,16,15,16,12,16,15,16,17,17,17,17,17,13,16,15,17,17,17,16,15,17,17,17,16,15,17,17,14,16,17,17,16,17,17,16,15,17,16,14,17,16,15,17,16,17,17,16,17,15,16,17,14,17,16,15,17,16,17,13,17,16,17,17,16,17,14,17,16,17,16,17,16,17,9
];

function stackBoxBlurImage( imageID, canvasID, radius, blurAlphaChannel, iterations )
{
      
  var img = document.getElementById( imageID );
  var w = img.naturalWidth;
    var h = img.naturalHeight;
       
  var canvas = document.getElementById( canvasID );
      
    canvas.style.width  = w + "px";
    canvas.style.height = h + "px";
    canvas.width = w;
    canvas.height = h;
    
    var context = canvas.getContext("2d");
    context.clearRect( 0, 0, w, h );
    context.drawImage( img, 0, 0 );

  if ( isNaN(radius) || radius < 1 ) return;
  
  if ( blurAlphaChannel )
    stackBoxBlurCanvasRGBA( canvasID, 0, 0, w, h, radius, iterations );
  else 
    stackBoxBlurCanvasRGB( canvasID, 0, 0, w, h, radius, iterations );
}


function stackBoxBlurCanvasRGBA( canvas, top_x, top_y, width, height, radius, iterations )
{
  if ( isNaN(radius) || radius < 1 ) return;
  radius |= 0;
  
  if ( isNaN(iterations) ) iterations = 1;
  iterations |= 0;
  if ( iterations > 3 ) iterations = 3;
  if ( iterations < 1 ) iterations = 1;
  
  var context = canvas.getContext("2d");
  var imageData;
  
  try {
    try {
    imageData = context.getImageData( top_x, top_y, width, height );
    } catch(e) {
    
    // NOTE: this part is supposedly only needed if you want to work with local files
    // so it might be okay to remove the whole try/catch block and just use
    // imageData = context.getImageData( top_x, top_y, width, height );
    try {
      netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
      imageData = context.getImageData( top_x, top_y, width, height );
    } catch(e) {
      alert("Cannot access local image");
      throw new Error("unable to access local image data: " + e);
      return;
    }
    }
  } catch(e) {
    alert("Cannot access image");
    throw new Error("unable to access image data: " + e);
  }
      
  var pixels = imageData.data;
      
  var x, y, i, p, yp, yi, yw, r_sum, g_sum, b_sum, a_sum, 
  r_out_sum, g_out_sum, b_out_sum, a_out_sum,
  r_in_sum, g_in_sum, b_in_sum, a_in_sum, 
  pr, pg, pb, pa, rbs;
      
  var div = radius + radius + 1;
  var w4 = width << 2;
  var widthMinus1  = width - 1;
  var heightMinus1 = height - 1;
  var radiusPlus1  = radius + 1;
  
  var stackStart = new BlurStack();
  
  var stack = stackStart;
  for ( i = 1; i < div; i++ )
  {
    stack = stack.next = new BlurStack();
    if ( i == radiusPlus1 ) var stackEnd = stack;
  }
  stack.next = stackStart;
  var stackIn = null;
  
  
  
  var mul_sum = mul_table[radius];
  var shg_sum = shg_table[radius];
  while ( iterations-- > 0 ) {
    yw = yi = 0;
    for ( y = height; --y > -1; )
    {
      r_sum = radiusPlus1 * ( pr = pixels[yi] );
      g_sum = radiusPlus1 * ( pg = pixels[yi+1] );
      b_sum = radiusPlus1 * ( pb = pixels[yi+2] );
      a_sum = radiusPlus1 * ( pa = pixels[yi+3] );
      
      stack = stackStart;
      
      for( i = radiusPlus1; --i > -1; )
      {
        stack.r = pr;
        stack.g = pg;
        stack.b = pb;
        stack.a = pa;
        stack = stack.next;
      }
      
      for( i = 1; i < radiusPlus1; i++ )
      {
        p = yi + (( widthMinus1 < i ? widthMinus1 : i ) << 2 );
        r_sum += ( stack.r = pixels[p]);
        g_sum += ( stack.g = pixels[p+1]);
        b_sum += ( stack.b = pixels[p+2]);
        a_sum += ( stack.a = pixels[p+3]);
        
        stack = stack.next;
      }
      
      stackIn = stackStart;
      for ( x = 0; x < width; x++ )
      {
        pixels[yi++] = (r_sum * mul_sum) >>> shg_sum;
        pixels[yi++] = (g_sum * mul_sum) >>> shg_sum;
        pixels[yi++] = (b_sum * mul_sum) >>> shg_sum;
        pixels[yi++] = (a_sum * mul_sum) >>> shg_sum;
        
        p =  ( yw + ( ( p = x + radius + 1 ) < widthMinus1 ? p : widthMinus1 ) ) << 2;
        
        r_sum -= stackIn.r - ( stackIn.r = pixels[p]);
        g_sum -= stackIn.g - ( stackIn.g = pixels[p+1]);
        b_sum -= stackIn.b - ( stackIn.b = pixels[p+2]);
        a_sum -= stackIn.a - ( stackIn.a = pixels[p+3]);
        
        stackIn = stackIn.next;
        
      }
      yw += width;
    }

    
    for ( x = 0; x < width; x++ )
    {
      yi = x << 2;
      
      r_sum = radiusPlus1 * ( pr = pixels[yi]);
      g_sum = radiusPlus1 * ( pg = pixels[yi+1]);
      b_sum = radiusPlus1 * ( pb = pixels[yi+2]);
      a_sum = radiusPlus1 * ( pa = pixels[yi+3]);
      
      stack = stackStart;
      
      for( i = 0; i < radiusPlus1; i++ )
      {
        stack.r = pr;
        stack.g = pg;
        stack.b = pb;
        stack.a = pa;
        stack = stack.next;
      }
      
      yp = width;
      
      for( i = 1; i <= radius; i++ )
      {
        yi = ( yp + x ) << 2;
        
        r_sum += ( stack.r = pixels[yi]);
        g_sum += ( stack.g = pixels[yi+1]);
        b_sum += ( stack.b = pixels[yi+2]);
        a_sum += ( stack.a = pixels[yi+3]);
         
        stack = stack.next;
      
        if( i < heightMinus1 )
        {
          yp += width;
        }
      }
      
      yi = x;
      stackIn = stackStart;
      for ( y = 0; y < height; y++ )
      {
        p = yi << 2;
        pixels[p+3] = pa =(a_sum * mul_sum) >>> shg_sum;
        if ( pa > 0 )
        {
          pa = 255 / pa;
          pixels[p]   = ((r_sum * mul_sum) >>> shg_sum ) * pa; 
          pixels[p+1] = ((g_sum * mul_sum) >>> shg_sum ) * pa;
          pixels[p+2] = ((b_sum * mul_sum) >>> shg_sum ) * pa;
        } else {
          pixels[p] = pixels[p+1] = pixels[p+2] = 0
        }
        
        p = ( x + (( ( p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1 ) * width )) << 2;
        
        r_sum -= stackIn.r - ( stackIn.r = pixels[p]);
        g_sum -= stackIn.g - ( stackIn.g = pixels[p+1]);
        b_sum -= stackIn.b - ( stackIn.b = pixels[p+2]);
        a_sum -= stackIn.a - ( stackIn.a = pixels[p+3]);
         
        stackIn = stackIn.next;
        
        yi += width;
      }
    }
  }
  context.putImageData( imageData, top_x, top_y );
  
}


function stackBoxBlurCanvasRGB( id, top_x, top_y, width, height, radius, iterations )
{
  if ( isNaN(radius) || radius < 1 ) return;
  radius |= 0;
  
  if ( isNaN(iterations) ) iterations = 1;
  iterations |= 0;
  if ( iterations > 3 ) iterations = 3;
  if ( iterations < 1 ) iterations = 1;
  
  var canvas  = document.getElementById( id );
  var context = canvas.getContext("2d");
  var imageData;
  
  try {
    try {
    imageData = context.getImageData( top_x, top_y, width, height );
    } catch(e) {
    
    // NOTE: this part is supposedly only needed if you want to work with local files
    // so it might be okay to remove the whole try/catch block and just use
    // imageData = context.getImageData( top_x, top_y, width, height );
    try {
      netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
      imageData = context.getImageData( top_x, top_y, width, height );
    } catch(e) {
      alert("Cannot access local image");
      throw new Error("unable to access local image data: " + e);
      return;
    }
    }
  } catch(e) {
    alert("Cannot access image");
    throw new Error("unable to access image data: " + e);
  }
      
  var pixels = imageData.data;
      
  var x, y, i, p, yp, yi, yw, r_sum, g_sum, b_sum,
  r_out_sum, g_out_sum, b_out_sum,
  r_in_sum, g_in_sum, b_in_sum,
  pr, pg, pb, rbs;
      
  var div = radius + radius + 1;
  var w4 = width << 2;
  var widthMinus1  = width - 1;
  var heightMinus1 = height - 1;
  var radiusPlus1  = radius + 1;
  
  var stackStart = new BlurStack();
  var stack = stackStart;
  for ( i = 1; i < div; i++ )
  {
    stack = stack.next = new BlurStack();
    if ( i == radiusPlus1 ) var stackEnd = stack;
  }
  stack.next = stackStart;
  var stackIn = null;
  
  
  
  var mul_sum = mul_table[radius];
  var shg_sum = shg_table[radius];
  
  while ( iterations-- > 0 ) {
    yw = yi = 0;
    
    for ( y = height; --y >-1; )
    {
      r_sum = radiusPlus1 * ( pr = pixels[yi] );
      g_sum = radiusPlus1 * ( pg = pixels[yi+1] );
      b_sum = radiusPlus1 * ( pb = pixels[yi+2] );
      
      stack = stackStart;
      
      for( i = radiusPlus1; --i > -1; )
      {
        stack.r = pr;
        stack.g = pg;
        stack.b = pb;
        stack = stack.next;
      }
      
      for( i = 1; i < radiusPlus1; i++ )
      {
        p = yi + (( widthMinus1 < i ? widthMinus1 : i ) << 2 );
        r_sum += ( stack.r = pixels[p++]);
        g_sum += ( stack.g = pixels[p++]);
        b_sum += ( stack.b = pixels[p]);
        
        stack = stack.next;
      }
      
      stackIn = stackStart;
      for ( x = 0; x < width; x++ )
      {
        pixels[yi++] = (r_sum * mul_sum) >>> shg_sum;
        pixels[yi++] = (g_sum * mul_sum) >>> shg_sum;
        pixels[yi++] = (b_sum * mul_sum) >>> shg_sum;
        yi++;
        
        p =  ( yw + ( ( p = x + radius + 1 ) < widthMinus1 ? p : widthMinus1 ) ) << 2;
        
        r_sum -= stackIn.r - ( stackIn.r = pixels[p++]);
        g_sum -= stackIn.g - ( stackIn.g = pixels[p++]);
        b_sum -= stackIn.b - ( stackIn.b = pixels[p]);
        
        stackIn = stackIn.next;
      }
      yw += width;
    }

    
    for ( x = 0; x < width; x++ )
    {
      yi = x << 2;
      
      r_sum = radiusPlus1 * ( pr = pixels[yi++]);
      g_sum = radiusPlus1 * ( pg = pixels[yi++]);
      b_sum = radiusPlus1 * ( pb = pixels[yi]);
      
      stack = stackStart;
      
      for( i = 0; i < radiusPlus1; i++ )
      {
        stack.r = pr;
        stack.g = pg;
        stack.b = pb;
        stack = stack.next;
      }
      
      yp = width;
      
      for( i = 1; i <= radius; i++ )
      {
        yi = ( yp + x ) << 2;
        
        r_sum += ( stack.r = pixels[yi++]);
        g_sum += ( stack.g = pixels[yi++]);
        b_sum += ( stack.b = pixels[yi]);
        
        stack = stack.next;
      
        if ( i < heightMinus1 ) yp += width;
      }
      
      yi = x;
      stackIn = stackStart;
      for ( y = 0; y < height; y++ )
      {
        p = yi << 2;
        pixels[p]   = (r_sum * mul_sum) >>> shg_sum;
        pixels[p+1] = (g_sum * mul_sum) >>> shg_sum;
        pixels[p+2] = (b_sum * mul_sum) >>> shg_sum;
        
        p = ( x + (( ( p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1 ) * width )) << 2;
        
        r_sum -= stackIn.r - ( stackIn.r = pixels[p]);
        g_sum -= stackIn.g - ( stackIn.g = pixels[p+1]);
        b_sum -= stackIn.b - ( stackIn.b = pixels[p+2]);
        
        stackIn = stackIn.next;
        
        yi += width;
      }
    }
  }
  context.putImageData( imageData, top_x, top_y );
  
}

function BlurStack()
{
  this.r = 0;
  this.g = 0;
  this.b = 0;
  this.a = 0;
  this.next = null;
}

exports.blur = stackBoxBlurCanvasRGBA;
},{}],2:[function(require,module,exports){
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
    viewDistance:100,
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
      canvas.drawRect(this.width, this.height, Math.floor(this.position.x - this.width/2), Math.floor(this.position.y - this.width/2), this.color, stroke);
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

},{"./head-on":5}],3:[function(require,module,exports){
var $h = require("./head-on");
var Entity = require("./entity");
var mouse = require("./mouse");
var camera = new $h.Camera(1000, 600);
var keys = require("./keys");
var gamestates = require("./gamestates");
var drawMap = require("./mapTools").drawMap;
var genMap = require("./mapTools").genMap;
var startPoint = {};
var box = {};
var draging;
var scroll = true;
var inputBox = document.createElement("input");
var checkbox = document.createElement("input");
var minicam = new $h.Camera(200,200);
var minimap = $h.canvas.create("minimap",200,200, minicam);
var minimapBG = $h.canvas.create("minibg", 200,200, minicam);
var entities = [];
var selectedEntities = {
  units:[],
};
var canvasMouse;
var minimapMouse;
var background;
var minimapClick;
var percent;
var scrollDirection;
var map = require("./maps").one;
console.log(map);
var gameState = {
  init: function(){
    this.state = gamestates.loadState;
  },
  changeState: function(state){
    if(this.state){
      this.state.exit();
      this.pState = this.state;
    }
    this.state = state;
    this.state.enter();
  },
  update: function(delta){
    this.state.update(this, delta);
  },
  render: function(){
    this.state.render(this);
  }
};
$h.canvas.create("master", 1000, 600, camera);
$h.canvas.create("background", 1000, 600, camera);
$h.canvas.create("foreground", 1000, 600, camera);
$h.canvas.create("FoW", 1000, 600, camera);
$h.canvas.create("darkness", map.width, map.height, camera);

$h.canvas("darkness").drawRect({
  x:0,
  y:0,
  width:map.width,
  height:map.height,
  camera:false,
  color:"black"
});
$h.canvas("darkness").canvas.ctx.globalCompositeOperation = "destination-out";
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
// entities[2].max_velocity = 300;
// entities[2].viewDistance = 300;
$h.gamestate = {units:entities};
$h.gamestate.canvasMouse = canvasMouse;
$h.gamestate.box = box;
$h.gamestate.dragging = draging;
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
window.addEventListener("blur", function(){
  $h.pause();
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
  var c;
  var cpy;
  if($h.collides({position:coords, width:1, height:1, angle:0}, {position:$h.Vector(800,400), width:200, height:200, angle:0})){
    c = minicam.project($h.Vector(coords.x - 800, coords.y - 400));
    //Get the top left of where the camera would be in I clicked there.
    //Camera.moveTo moves the center of the camera to where you clicked
    //We want to bounds check on the top left and bottom right
    cpy = c.sub($h.Vector(camera.width/2, camera.height/2));
    if(cpy.x + camera.width > map.width){
      console.log("hey");
      c.x = map.width - (camera.width/2);
    }else if(cpy.x < 0){
      c.x = (camera.width/2);

    }
    if(cpy.y + camera.height > map.height){
      c.y = map.height - (camera.height/2);
    }else if(cpy.y < 0){
      c.y = (camera.height/2);
    }
    camera.moveTo(c);
    $h.gamestate.minimapClick = true;
  }else{
    coords = camera.project(coords);
    $h.gamestate.minimapClick = false;
  }
	$h.gamestate.startPoint = startPoint = coords;
	$h.gamestate.draging = draging = true;
});
canvasMouse.listen("scroll", function(direction){
  if(direction){
    $h.gamestate.scroll = true;
  }else{
    $h.gamestate.scroll = false; 
  }
  $h.gamestate.scrollDirection = direction;
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
	if(button === 1 && !$h.gamestate.minimapClick){
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
  $h.gamestate.minimapClick = false;
	$h.gamestate.startPoint = startPoint = {};
	$h.gamestate.box = box = {};
});


document.addEventListener("webkitpointerlockchange", function(e){
  console.log(e);
}, false);


$h.update(function(delta){
  gameState.update(delta);
});
minicam.zoomOut(20);
minicam.moveTo($h.Vector(2000,2000));
drawMap($h.canvas("minibg"), map, minicam);
$h.render(function(){
  var master = $h.canvas("master");
  var c = $h.canvas("main");
  var m = $h.canvas("minimap");
  var fg = $h.canvas("foreground");
  var mos = camera.project(canvasMouse.mousePos());
  var zero;
	gameState.render();
  zero = camera.project($h.Vector(0,0));
  master.clear();
  master.drawImage(background.canvas.canvas, zero.x, zero.y);
  master.drawImage(c.canvas.canvas, zero.x, zero.y);
  master.drawImage($h.canvas("FoW").canvas.canvas, zero.x, zero.y);
  master.drawImage(m.canvas.canvas, zero.x + 800, zero.y + 400);
  master.drawImage(fg.canvas.canvas, zero.x, zero.y);
  

});
$h.loadImages(
  [
    {name:"cursor", src:"img/cursor.png"},
    

  ],
  function(loaded, total){
  $h.events.trigger("imagesLoadProgess", loaded, total);
});
gameState.init();
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




},{"./entity":2,"./gamestates":4,"./head-on":5,"./keys":6,"./mapTools":7,"./maps":8,"./mouse":9}],4:[function(require,module,exports){
var $h = require("./head-on");
var drawMap = require("./mapTools").drawMap;
var getTile = require("./mapTools").getTile;
var map = require("./maps").one;
var blur = require("./blur").blur;
var percent = 0;

$h.events.listen("imagesLoadProgess", function(loaded, total){
  percent = (loaded/total);
});
exports.loadState = {
  update: function(entity){
    if($h.imagesLoaded){
      if(!this.done){
        setTimeout(function(){
          console.log("getting out of loading");
          entity.changeState(exports.gamePlay); 
        },2000);
      }
     
      this.done = true;
         
    }
  },
  render:function(){
    var background = $h.canvas("background");
    background.clear();
    background.drawRect({
      x:0,
      y:0,
      width:background.width,
      height:background.height,
      color:"purple",
      camera:false
    });
    background.drawText("Loading: "+(percent*100)+"%", background.width/2, background.height/2, false, "white", "center");
  },
  exit:function(){}
};
exports.gamePlay = {
  update: function(entity, delta){
    var camera = $h.canvas("main").canvas.camera;
    $h.gamestate.units.forEach(function(dude){
      dude.update(delta);
    });
    if($h.paused){
      console.log("pauses are killing me?");
      entity.changeState(exports.pausedState);
    }
    var scrollx  = 10;
    var scrolly = 10;

    if($h.gamestate.scroll){
      switch($h.gamestate.scrollDirection){
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
    }
   
  },
  render:function(){
    var camera = $h.canvas("main").canvas.camera;
    var c = $h.canvas("main");
    var m = $h.canvas("minimap");
    var mos = camera.project($h.gamestate.canvasMouse.mousePos());
    var zero;
    var background = $h.canvas("background");
    var fg = $h.canvas("foreground");
    var fow = $h.canvas("FoW");
    c.clear();
    m.clear();
    if(this.camMoved){
      this.camMoved = false;
      console.log("how often am I being called?", $h.gamestate.minimapClick);
      background.clear();
      drawMap(background, map, camera);
      //scroll = false;
    }
    m.drawRect({
      width:200,
      height:200,
      color:"white",
      x:0,
      y:0,
      camera:false
    });
    //drawMap(m, map, minicam);
    m.drawImage($h.canvas("minibg").canvas.canvas, 0,0);
    
    fow.clear();
    fow.drawRect({
      x:0,
      y:0,
      width:fow.width,
      height:fow.height,
      camera:false,
      color:"rgba(0,0,0,.6)"
    });
    
    fow.canvas.ctx.save();
    fow.canvas.ctx.globalCompositeOperation = "destination-out";
    $h.gamestate.units.forEach(function(dude){
      dude.render(c);
      dude.minimapRender(m);
      var tile = getTile(dude, map);
      this.grd = fow.createGradient({
        type:"radial",
        start: dude.position,
        end:dude.position,
        radius1:90,
        radius2:100,
      });
      this.grd.addColorStop(0, "white");
      this.grd.addColorStop(0.98, "transparent");
      //clipArc(fow.canvas.ctx, dude.position.x,dude.position.y, dude.viewDistance, 40);
      //fow.drawCircle(dude.position.x,dude.position.y,100, "white");
      
      
      
      $h.canvas("darkness").drawCircle({
        radius:100, 
        x:dude.position.x,
        y:dude.position.y, 
        color:"red",
        camera:false
      });
    });
    
    fow.canvas.ctx.restore();
    //blur($h.canvas("FoW").canvas.canvas, 0,0, 1000,1000, 200, 1);
    //fow.canvas.ctx.drawImage($h.canvas("darkness").canvas.canvas, camera.position.x, camera.position.y, camera.width, camera.height, 0,0, 1000, 600);
    m.canvas.ctx.drawImage($h.canvas("darkness").canvas.canvas, 0, 0, 4000, 4000, 0,0, 200, 200);
    m.drawRect(camera.width, camera.height, camera.position.x, camera.position.y, "transparent", {width:2, color:"white"});
    m.drawRect({
      x:0,
      y:0,
      width:200,
      height:200,
      camera:false,
      color:"transparent",
      stroke:{
        width:4,
        color:"white"
      }
    });
    if($h.gamestate.draging){
      c.drawRect($h.gamestate.box.width, $h.gamestate.box.height, $h.gamestate.box.x, $h.gamestate.box.y, "rgba(0,128, 0, .2)", {color:"green", width:2});
    }
   
    fg.clear();
    fg.drawImage($h.images("cursor"), mos.x, mos.y);
  },
  exit:function(){
    $h.events.unlisten("cameraMoved", this.event);
  },
  enter: function(){
    this.called = this.called || 0;
    var camera = $h.canvas("main").canvas.camera;
    var background = $h.canvas("background");
    var that = this;
    this.event = $h.events.listen("cameraMoved", function(cam){
      if(camera === cam){
        that.camMoved = true;
      }
    });
    $h.gamestate.canvasMouse.unpause();
    background.clear();
    console.log(this.called++);
    drawMap(background, map, camera);
  }
};
exports.pausedState = {
  update:function(entity, delta){
    if(!$h.paused){
      entity.changeState(exports.gamePlay);
    }
  },
  render: function(entity){
  },
  enter:function(){
    var fg = $h.canvas("foreground");
    fg.drawRect({
      width:fg.width,
      height:fg.height,
      x:0,
      y:0,
      camera:false,
      color:"rgba(0,0,0,.9)"
    });
    fg.drawText("paused", fg.width/2, fg.height/2, false, "white", "center");
  },
  exit:function(){
    var fg = $h.canvas("foreground");
    fg.clear();
  }
};
// var temp = document.createElement('canvas'),
//         tx = temp.getContext('2d');
//         temp.width = 1000;
//         temp.height = 600;
//         tx.translate(-1000, 0);
// function clipArc(ctx, x, y, r, f) {

    
    
//     tx.shadowOffsetX = temp.width;    
//     tx.shadowOffsetY = 0;
//     tx.shadowColor = '#000';
//     tx.shadowBlur = f;
    
//     tx.arc(x, y, r, 0, 2 * Math.PI);
//     tx.closePath();
//     tx.fill();


//     ctx.save();
//     ctx.globalCompositeOperation = 'destination-out';
//     ctx.drawImage(temp, 0, 0);
//     ctx.restore();
// }
},{"./blur":1,"./head-on":5,"./mapTools":7,"./maps":8}],5:[function(require,module,exports){
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
            var id = headOn.uId();
            if(!this.events[eventName]){
              this.events[eventName] = [];
            }
            this.events[eventName].push({cb:callback, id:id});
          },
          unlisten:function(eventName, id){
            if(!this.events[eventName]) return;
            this.events[eventName].forEach(function(e, i){
              if(e.id === id){
                this.events[eventName].splice(i,1);
              }
            });
          },
          trigger: function(eventName){
            var args = [].splice.call(arguments, 1),
              e = this.events[eventName],
              l,
              i;
            if(e){
              l = e.length;
              for(i = 0; i < l; i++){
                e[i].cb.apply(headOn, args);
              }
            }

          }
        },
        uId: function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
        },
        FSM: function(entity){
          this.entity = entity;
          return this;
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

        loadImages: function(imageArray, progress, allCallback){
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
            progress && progress(loaded, total);
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
        var ctx = this.canvas.ctx, mod = 1, camera = this.canvas.camera, oneArg;
        if(arguments.length === 1 && typeof arguments[0] === "object"){
          oneArg = true;
          x=arguments[0].x;
          y=arguments[0].y;
          radius=arguments[0].radius;
          color = arguments[0].color;
          stroke = arguments[0].stroke;
        }
        
        ctx.save();
        ctx.beginPath();
        if(oneArg && arguments[0].camera === false){
          ctx.arc(x, y, radius, 0, 2*Math.PI, false);
        }else{

          ctx.arc((x - camera.position.x)/camera.zoomAmt, (y - camera.position.y)/camera.zoomAmt, radius / camera.zoomAmt, 0, 2*Math.PI, false);
        }
        
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
      createGradient: function(options){
        var grd;
        var ctx = this.canvas.ctx;
        var camera = this.canvas.camera;
        var start;
        var end;
        if(options.camera !== false){
          start = camera.unproject(options.start);
          end = camera.unproject(options.end);
        }else{
          start = options.start;
          end = options.end;
        }
        if(options.type === "radial"){
          return ctx.createRadialGradient(start.x, start.y, options.radius1, end.x, end.y, options.radius2);
        }else{
          return ctx.createLinearGradient(start.x, start.y, end.x, end.y);
        }
        
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
    headOn.FSM.prototype = {
      changeState: function(state){
        if(this.state){
          this.state.exit();
        }
           
        this.state = state;
        this.state.enter();
      },
      update: function(){
        var args = [].slice.call(arguments, 0);
        args.unshift(this.entity);
        this.state.execute.apply(null, args);  
      },
      setState: function(state){
        this.state = state;
      }
    },
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
        headOn.events.trigger("cameraMoved", this);
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
        headOn.events.trigger("cameraMoved", this);
        this.center = vec;
      },
      project: function(vec){
        return vec.mul(this.zoomAmt).add(this.position);
      },
      unproject: function(vec){
        return vec.mul(1/this.zoomAmt).sub(this.position);
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

},{}],6:[function(require,module,exports){
var $h = require("./head-on");
$h.keys = {};
addEventListener("keydown", function(e){
  $h.keys[String.fromCharCode(e.which).toLowerCase()] = true;
});
addEventListener("keyup", function(e){
  if(e.which === 80){
    if($h.isPaused()){
      $h.unpause();
    }
    else{
      $h.pause();
    }
  }
});
},{"./head-on":5}],7:[function(require,module,exports){
var $h = require("./head-on");
exports.genMap = function genMap(width, height, tileW, tileH){
  var rows = height/tileH;
  var cols = width/tileW;
  var map = [];
  for(var y = 0; y < rows; y++){
    map[y] = [];
    for(var x = 0; x < cols; x++){
      var rand = $h.randInt(0,100);
      if(rand > 20){
        map[y][x] = 0;
      }else if(rand > 5){
        map[y][x] = 1;
      }else{
        map[y][x] = 2;
      }
    }
  }
  return map;
};
exports.getTile = function(entity, map){
  var tile = [];
  tile[0] = Math.floor(entity.position.x/map.tileWidth);
  tile[1] = Math.floor(entity.position.y/map.tileHeight);
  return tile;
};
exports.drawMap = function drawMap(canvas, map, camera){

  var tileColor ={
    1:"#777CC9",
    0:"#8045BF"
  };
  var startx = Math.floor(camera.position.x * camera.zoomAmt/map.tileWidth);
  var starty = Math.floor(camera.position.y/map.tileHeight);
  var endx = Math.ceil((camera.position.x + camera.width*camera.zoomAmt )/map.tileWidth);
  var endy = Math.ceil((camera.position.y + camera.height*camera.zoomAmt)/map.tileHeight);
  var tiles = map.map;
  var topleft = {x:0,y:0};
  var topright = {x:0,y:0};
  var botleft = {x:0,y:0};
  var botright = {x:0, y:0};
  for(var y = starty; y < endy; y++){
    topleft.y = y*map.tileHeight;
    topright.y = topleft.y;
    botleft.y = y*map.tileHeight + map.tileHeight;
    botright.y = botleft.y;
    for(var x = startx; x<endx; x++){
      if(tiles[y][x] === 0 || tiles[y][x] === 1){
        topleft.x = x*map.tileWidth;
        topright.x = x*map.tileWidth + map.tileWidth;
        botleft.x = topleft.x;
        botright.x = topright.x;
          // if(camera.inView(topleft) ||
          //   camera.inView(topright) ||
          //   camera.inView(botleft) ||
          //   camera.inView(botright)
          //   ){
            canvas.drawRect(map.tileWidth, map.tileHeight, x*map.tileWidth, y*map.tileHeight, tileColor[tiles[y][x]]);
          // }
      }
    }
  }
}
;
},{"./head-on":5}],8:[function(require,module,exports){
var genMap = require("./mapTools").genMap;
exports.one = {
  width:4000,
  height:4000,
  tileWidth:20,
  tileHeight:20,
  map:genMap(4000,4000,20,20)
};
},{"./mapTools":7}],9:[function(require,module,exports){
//Setup event listeners for the mouse
var $h = require("./head-on");
module.exports = function(obj, camera){
  "use strict";
  var listeners = {};
  obj = obj || window;
  var dragging;
  var paused = true;
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
    if(paused) return;
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
    if(paused) return;
    var coords = getCoords(e);
    if(listeners.rightmousedown){
      listeners.rightmousedown.call(null, mousePos);
      e.preventDefault();
    }
  });
  obj.addEventListener("mouseup", function(e){
    if(paused) return;
    var button = e.which || e.button;
    var coords = getCoords(e);
    if(button === 1){
      dragging = false;
    }
    
    if(listeners.mouseup){
      listeners.mouseup.call(null, mousePos, button);
    }
  });
  var scroll = false;
  obj.addEventListener("mousemove", function(e){
    if(paused) return;
    var vec = {x:e.webkitMovementX, y:e.webkitMovementY};
    mousePos = mousePos.add(vec);
    if(mousePos.x > obj.width-10){
      scroll = "right";
    }
    else if(mousePos.x < 10){
      scroll = "left";
    }
    else if(mousePos.y > obj.height -10){
      scroll = "down";
    }else if(mousePos.y < 10){
      scroll = "up";
      
    }else{
      scroll = false;
    }
    keepMouseInBounds();
    if(listeners.scroll){
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
    },
    pause: function(){
      paused = true;
    },
    unpause: function(){
      paused = false;
    }
  };
  function keepMouseInBounds(){
    if(mousePos.x > obj.width){
      mousePos.x = obj.width;
    }
    if(mousePos.y > obj.height){
      mousePos.y = obj.height;
    }
    if(mousePos.x < 0){
      mousePos.x = 0;
    }
    if(mousePos.y < 0){
      mousePos.y = 0;
    }
  }

};

},{"./head-on":5}]},{},[3])