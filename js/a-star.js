module.exports = AStar;
function AStar(start, goal, map){
	start = pathNode(start);
	goal = pathNode(goal);
    var closedset =[]    // The set of nodes already evaluated.
    var openset = [start]    // The set of tentative nodes to be evaluated, initially containing the start node
    var current;
    var neighbors;
    var neighbor;
    start.gScore = 0;
    start.hScore = costEstimate(start.coords, goal.coords);
    start.fScore = start.gScore + start.hScore;   // Cost from start along best known path.
    // Estimated total cost from start to goal through y.
     
    while(openset.length > 0){
    	current = getLowestFScore(openset);
        if(!differ(current, goal)){
        	return reconstruct_path(came_from, goal);
        }
            
         
        setRemove(openset, current);
        closedset.push(current);
        neighbors = neighborNodes(current, map);
        for(var i=0; i<neighbors.length; i++){
        	neighbor = pathNode(neighbors[i]);
            if (setContains(closedset, neighbor)){
            	continue;
            }
                    
            if(!setContains(openset, neighbor)){
                openset.push(neighbor);
                neighbor.parent = current;
                neighbor.hScore = costEstimate(neighbor.coords, goal.coords);
                neighbor.gScore = gScore(curret, neighbor);
                neightbor.fScore = neighbor.gScore + neighbor.hScore;
            }
                
        }
    }

       

    return failure

}
function setRemove(set, el){
	set.some(function(e, i){
		if(e === el){
			set.slice(i ,1);
			return true;
		}
	});
}
function setContains(set, el){
	return set.some(function(e){
		if(e === el){
			return true;
		}
	})
}
function neighborNodes(current, map){
	var coords = current.coords;
	var neighbors = [];
	for(i = coords[0] - 1; i<=coords[0] + 1; i++){
		for(j = coords[1] -1; j<= coords[0] + 1; j++){
			if(map[i][j] === 0 && differ(current, {coords:[i,j]})){
				neighbors.push([i,j]);
			}
		}
	}
	return neighbors;
}
function gScore(curent, neightbor){
	if(linear()){
		return 10;
	}
	else{
		return 14;
	}

	function linear(){
		c1 = current.coords;
		c2 = neighbor.coords;
		if(c1[0]-c2[0] === 0 || c1[1] - c2[1] === 0){
			return true;
		}
		else{
			return false;
		}
	}
}
function pathNode(coords, parent, fScore, gScore, hScore){
	return{
		coords:coords,
		parent:parent,
		fScore:fScore,
		gScore:gScore,
		hScore:hScore,
	}
}
function differ(el1, el2){
	if(el1.coords[0] === el2.coords[0] && el1.coords[1] === el2.coords[1]){
		return false;
	}
	else{
		return true;
	}
}
function costEstimate(start, end){
	return Math.sqrt(Math.pow(start[0]-end[0], 2), Math.pow(start[1] - end[1], 2));
}
function getLowestFScore(set){
	var lowest = set[0];
	set.forEach(function(el){
		if(el.fScore > lowest.fScore){
			lowest = el;
		}
	});
	return el;
}