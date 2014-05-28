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