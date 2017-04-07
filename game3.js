var c = document.getElementById("gameCanvas");
var context = c.getContext("2d");
var lastLoop = new Date;

var red = 0;

var time = 0;


var mousex = 0;
var mousey = 0;

var xpos = 200;
var ypos = 300;

var bulletsx = [];
var bulletsy = [];

var enemyx = []
var enemyy = [];

var score = 0;
var mouse = false;

var weaponcooldown = 60;
var canfire = true;

context.moveTo(0,0);
context.lineTo(200,100);
context.stroke();
context.fillStyle = 'green';
context.fillRect(0,0,400,600);

c.onmousedown = function(event){
	mouse = true;
}
c.onmouseup = function(event){
	mouse = false;
}


c.style.cursor = 'none';

c.onmousemove = function(event){
	xpos = event.clientX - 10;
	ypos = event.clientY;
};

loop();

function moveEnemies() {
	for(i = 0; i < enemyy.length; i++) {
		enemyy[i] += 1;
	}
	
}

function shoot() {
	if((canfire == true) && (mouse == true)){
		bulletsx.push(xpos);
		bulletsy.push(ypos - 5);
		weaponcooldown = 60;
	}
}

function randomEnemies() {
	enemyx.push(getRandomInt(10,390))
	console.log("made new enemy");
	enemyy.push(0)
}

function collision() {
	for(i = 0; i < bulletsx.length; i++) {
		for(j = 0; j < enemyx.length; j++) {
			if((bulletsx[i] >= enemyx[j] - 10) && (bulletsx[i] <= enemyx[j] + 10)) {
				if((bulletsy[i] >= enemyy[j] - 10) && (bulletsy[i] <= enemyy[j] + 10)) {
					enemyx.splice(j,1);
					enemyy.splice(j,1);
					bulletsx.splice(i,1);
					bulletsy.splice(i,1);
					score += 10;
			}
			}
		}
	}
}

function physics() {
	for(i = 0; i < bulletsx.length; i++) {
		bulletsy[i] -= 5;
		if(bulletsy[i] <= 0) {
			bulletsx.splice(i,1);
			bulletsy.splice(i,1);
		}
	}

}

function drawBullets() {
	for(i = 0; i < bulletsx.length; i++) {
		context.fillStyle = 'white';
		context.fillRect(bulletsx[i] - 2,bulletsy[i] - 15,4,4);
	}
}

function drawEnemies() {
	for(i = 0; i < enemyx.length; i++) {
		drawEnemy(enemyx[i],enemyy[i],0);
	}
}

function movePlayer() {
	dx = mousex - xpos;
	dy = mousey - ypos;
	angle = Math.atan2(dy, dx)
	xVelocity = maxspeed * Math.cos(angle);
	yVelocity = maxspeed * Math.sin(angle);
	xpos += xVelocity;
	ypos += yVelocity;
}

function loop() {
	time += 1;
	weaponcooldown -= 1;
	if(weaponcooldown <= 0) {
		canfire = true;
	}
	context.clearRect(0, 0, context.width, context.height);
	context.fillStyle = 'black';
	context.fillRect(0,0,400,600);
	context.beginPath();
    context.moveTo(xpos - 10,ypos + 10);
	context.lineTo(xpos,ypos - 15);
	context.lineTo(xpos + 10,ypos + 10);
	context.lineTo(xpos,ypos + 5);
	context.lineTo(xpos - 10,ypos + 10);
	context.lineTo(xpos,ypos - 15);
     context.lineWidth = 2;

      // set line color
      context.strokeStyle = '#ffffff';
      context.stroke();
	
	var thisLoop = new Date;
    var fps = 1000 / (thisLoop - lastLoop);
    lastLoop = thisLoop;
	
	context.fillStyle = 'red';
	context.font = "30px Arial";
	context.fillText(Math.floor(fps),10,50);
	context.fillText(score,10,80);
	

	if(time % 60 == 0) {
		randomEnemies();
		console.log(enemyx);
		console.log(enemyy);
	}
	shoot();
	physics();
	
	collision();
	moveEnemies();
	drawBullets();
	drawEnemies();
	

	
	window.requestAnimationFrame(loop)
};

function drawEnemy(x,y,type) {
	switch(type) {
		case 0:
			context.beginPath();
			context.moveTo(x + 10,y - 10);
			context.lineTo(x,y + 15);
			context.lineTo(x - 10,y - 10);
			context.lineTo(x,y - 5);
			context.lineTo(x + 10,y - 10);
			context.lineTo(x,y + 15);
		break;
	}
	
     context.lineWidth = 2;

      // set line color
      context.strokeStyle = '#ff0000';
      context.stroke();
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
