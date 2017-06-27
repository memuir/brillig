/*
 * Paste your JSFiddle "JAVASCRIPT" code under this comment
 *
*/
canvas = document.getElementById('canvas');
context = canvas.getContext('2d');

var speed = 100;
var numbad = 2;
var cellWidth = 10;
var direction = 'right';
var numsquares = canvas.width;
var baddiesarray = new Array();
var numsegs = 5;
var obsarray = [];
var usedspaces = [];
var firearray = [];
var saved = 0;
var time = 0;
var highscore = 0;
var click = 0;
var start = false;

document.addEventListener('click', clicked);
document.addEventListener('keydown', handleKeypress);

function clicked(e){
	start = true;
	click = 1;
}

function handleKeypress(e){
	start = true;
	click = 1;
	switch(e.keyCode){
  	case 37:
    	if(direction == "right"){
      break;
      } else {
    	direction = 'left';
      };
    	break;
    case 38:
    if(direction == "down"){
    break;
    }else{
    	direction = 'up';};
    	break;
    case 39:
    if(direction == "left"){break;}else{
    	direction = 'right';};
    	break;
    case 40:
    if(direction == "up"){break;}else{
    	direction = 'down';};
    	break;
  	
  }

}

function fire(x,y){
	this.x = x;
	this.y = y;
	
	this.draw = function(){
		var pictureB = new Image();
    	pictureB.src = './red.png';
    	context.drawImage(pictureB, this.x, this.y, cellWidth, cellWidth);
	}
	
}

var colors = {};
colors[1] = './blue.png';
colors[2] = './green.png';
colors[3] = './yellow.png';
colors[4] = './orange.png';
colors[5] = './red.png';
colors[6] = './purple.png';


function obstacle(x,y, color){
	this.x = x;
	this.y = y;
	this.pic = './blue.png';
	this.draw = function(){
		var pictureB = new Image();
    	pictureB.src = this.pic;
    	context.drawImage(pictureB, this.x, this.y, cellWidth, cellWidth);
	}

}

function init_obs(numobs){
	usedspaces = [];
	console.log(usedspaces);
	var iter = 0;
	while(iter < numobs){
			var n = randomnum()*cellWidth;
			var c = randomnum()*cellWidth;
				obsarray.push(new obstacle(n, c, "green"));
				iter++;			
	}
	console.log(usedspaces);
}

function randomnum(){
	return Math.floor(Math.random() * (((canvas.width/cellWidth) - 2) - 1 + 1)) + 1;
}

function Snake(numSegments){
	this.segments = numSegments;
  	this.snakeArray = new Array();
  	for(var iter=0; iter < numSegments; iter++){
  		this.snakeArray.push(
    						{x:5-iter,y:2}
                          	);
  	}
  
  
  this.obscollide = function(){
  
  	for(seg in this.snakeArray){
  		for(obs in obsarray){
    		if(obsarray[obs].x/cellWidth == this.snakeArray[seg].x){
    			if(obsarray[obs].y/cellWidth == this.snakeArray[seg].y){
      				obsarray.splice(obs,1);
      				time = 0;
	  				saved++;
      			}
    		}
    	}
  	}
  }
  
  this.firecollide = function(){
  	for(seg in this.snakeArray){
  		for(obs in firearray){
    		if(firearray[obs].x/cellWidth == this.snakeArray[seg].x){
    			if(firearray[obs].y/cellWidth == this.snakeArray[seg].y){
      				click = 4;
      				start = false;
      				reset();
      			}
    		}
    	}
  	}
  }
  
  this.selfcollide = function(){
   for(var iter = 2; iter<this.snakeArray.length;iter++){
   	if((this.snakeArray[0].x == this.snakeArray[iter].x)&&(this.snakeArray[0].y == this.snakeArray[iter].y)){
   		click = 5;
   		start = false;
   		reset();
   	}
   }
  }
  
  this.wallcollide = function(){
  	for(seg in this.snakeArray){
  		if((this.snakeArray[seg].x) > (canvas.width/cellWidth)- 1){
  			return true;
  		};
  		if(this.snakeArray[seg].x*cellWidth < 0){
			 return true;
  		};
  		if(this.snakeArray[seg].y < 0){
  			return true;
  		};
  		if(this.snakeArray[seg].y > (canvas.height/cellWidth) - 1){
  			return true;
  		};
  		return false;
  	}
  }
  
  this.update = function(){
  	this.obscollide();
  	this.firecollide();
  	this.selfcollide();
  		if(this.wallcollide()){
  			click = 2;
  			start = false;
  			reset();
  		} else {
  			var newX = this.snakeArray[0].x;
    		var newY = this.snakeArray[0].y;
    
    		switch(direction){
    			case 'right':
      			newX++;
      			break;
   	   		case 'left':
      			newX--;
      			break;
      		case 'up':
      			newY--;
      			break;
      		case 'down':
      			newY++;
      			break;
			}
    	var tail = this.snakeArray.pop();
    	tail.x = newX;
    	tail.y = newY;
    	this.snakeArray.unshift(tail);
  		}
  };
  
  this.reset = function(){
  	canvas.width = canvas.width;
  }
  
  this.draw = function(){
    
  	for(var iter=0; iter<this.snakeArray.length; iter++){
  		var picture = new Image();
    	picture.src = './purple.png';
    	context.drawImage(picture,this.snakeArray[iter].x*cellWidth, this.snakeArray[iter].y*cellWidth, cellWidth, cellWidth);
    }
  };
} 


var snake = new Snake(numsegs);

function reset(){
	if(highscore < saved){
		highscore = saved;
		click = 3;
	};
	saved = 0;
	numbad = 2;
	time = 0;
  firearray = [];
  	obsarray = [];
  	init_obs(numbad);
  	snake = new Snake(numsegs);
  	direction = 'right';
}


function popone(){
	var tempx = obsarray[0].x;
	var tempy = obsarray[0].y;
	
	obsarray.splice(0,1);
	firearray.push(new fire(tempx, tempy));	
}

function update(){
	snake.update();
	time+=1;
	if(time%30 == 0){
		popone();
	};
	if(obsarray.length == 0){
		numbad++;
		init_obs(numbad);
	};
}

function drawsaved(){
	if(click == 0){
		document.getElementById('score').innerHTML = "Hungry momeraths have strayed from the pack!  Catch them before their sadness turns to anger.";
		document.getElementById('highscore').innerHTML = "Use the arrow keys to control your momerath resque squad.  Save the sad, blue momeraths but watch out for the angry red momeraths.  Press any key to begin";
	}else if(click == 1){
		document.getElementById('score').innerHTML = "Saved: " + saved;
		document.getElementById('highscore').innerHTML = "Most Saved: " + highscore;
	} else if(click == 2){
		document.getElementById('score').innerHTML = "Oh no!  The momerath rescue squad has crashed!";
		document.getElementById('highscore').innerHTML = "Press any key to play again";
	} else if(click == 3){
		document.getElementById('score').innerHTML = "Congratulations!  You saved the most momeraths yet!";
		document.getElementById('highscore').innerHTML = highscore + " saved!  Press any key to play again";
	} else if(click ==4){
		document.getElementById('score').innerHTML = "Oh no!  Your rescue squad was destroyed by an angry momerath";
		document.getElementById('highscore').innerHTML = "Press any key to play again";
	}else if(click == 5){
		document.getElementById('score').innerHTML = "Look out!  You've crashed into your own squad members";
		document.getElementById('highscore').innerHTML = "Press any key to play again";
	}
}

function draw(){
	canvas.width = canvas.width;
	context.fillStyle = "#000000";
	context.fillRect(0, 0, canvas.width, canvas.height);
	
	drawsaved();

	for(obs in obsarray){
		obsarray[obs].draw();
	}
	
	for(f in firearray){
		firearray[f].draw();
	}
	
	snake.draw();
}

function game_loop(){

	if(start == true){update();};
	draw();
}


init_obs(numbad);
setInterval(game_loop, speed);







