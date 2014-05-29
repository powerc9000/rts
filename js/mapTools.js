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

exports.drawMap = function drawMap(canvas, map, camera){
  var tileColor ={
    1:"#777CC9",
    0:"#8045BF"
  };
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
      if(tiles[y][x] === 0 || tiles[y][x] === 1){
        topleft.x = x*map.tileWidth;
        topright.x = x*map.tileWidth + map.tileWidth;
        botleft.x = topleft.x;
        botright.x = topright.x;
          if(camera.inView(topleft) ||
            camera.inView(topright) ||
            camera.inView(botleft) ||
            camera.inView(botright)
            ){
            canvas.drawRect(map.tileWidth, map.tileHeight, x*map.tileWidth, y*map.tileHeight, tileColor[tiles[y][x]]);
          }
      }
    }
  }
}
;