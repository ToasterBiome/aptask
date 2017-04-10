var c = document.getElementById("gameCanvas");
var context = c.getContext("2d");


var time = 0;
var tick = 0;

var gold = 0;
var gravity = .5;

var spr_player = new Image();

var stone = new Image();
var dirt = new Image();
var grass = new Image();
var wood = new Image();
var cursor = new Image();

var stone_sheet = new Image();

var moving = false;

var mouse = {
	x: 0,
	y: 0
}

cursor.src = "cursor.png";
wood.src = "wood.png";
stone.src = "stone.png";
stone_sheet.src = "stone_sheet.png";
dirt.src = "dirt.png";
grass.src = "grass.png";

spr_player.src = "player.png"
var width = 640;
var height = 480;

var player = {
	sprite: spr_player,
	x: 0,
	y: 0,
	xb: 0,
	yb: 0,
	spd: 2,
	moving: false
}

var key = {};

window.addEventListener('keydown',function(e){
    key[e.keyCode || e.which] = true;
},true);    
window.addEventListener('keyup',function(e){
    key[e.keyCode || e.which] = false;
},true);

document.addEventListener('mousemove', function(event) {
	mouse.x = (Math.floor(event.clientX / 16) * 16);
	mouse.y = (Math.floor(event.clientY / 16) * 16);
});

document.addEventListener('mousedown', function(event) {
	console.log("tile: " + getTile(mouse.x,mouse.y));
	console.log("tileindex: " + getTileIndex(mouse.x,mouse.y));
});




function playerInput() {
	if(key[38]) {
		if((getWalkable(player.x,player.y - 16)) && (moving == false)){
				player.yb -= 16;
				moving = true;
		}
	}
	if(key[40]) {
		if((getWalkable(player.x,player.y + 16)) && (moving == false)){
				player.yb += 16;
				moving = true;
		}
	}
	if(key[37]) {
		if((getWalkable(player.x - 16,player.y)) && (moving == false)){
				player.xb -= 16;
				moving = true;
		}
	}
	if(key[39]) {
		if((getWalkable(player.x + 16,player.y)) && (moving == false)){
				player.xb += 16;
				moving = true;
		}
	}
}



var map = [];
var tileindex = [];

for(i = 0; i < 480 / 16; i++) {
	map[i] = []
	tileindex[i] = [];
	for(j = 0; j < 640 / 16; j++) {
		r = Math.random();
		if (r > .1 && r < .9) {
			map[i][j] = 3;
		} else if (r > .99){
			map[i][j] = 2;
		} else {
			map[i][j] = 1;
		}
		tileindex[i][j] = 0;
	}

}

map[7][11] = 4;

var house = [
	[3,3,3,3,3,3,3],
	[3,1,1,1,1,1,3],
	[3,1,5,5,5,1,3],
	[3,1,5,5,5,1,3],
	[3,1,5,5,5,1,3],
	[3,1,1,3,1,1,3],
	[3,3,3,3,3,3,3]
];

//check for structures
checkStructures();
function checkStructures () {
	for(vert = 0; vert < 480 / 16; vert++) {
		for(horiz = 0; horiz < 640 / 16; horiz++) {
			if(map[vert][horiz] == 4) {
				console.log("found structure @ " + horiz + ", " + vert);
				//4 is a house
				for(vertbuild = 0; vertbuild < house.length; vertbuild++) {
					for(horizbuild = 0; horizbuild < house[vertbuild].length; horizbuild ++) {
						map[vert + vertbuild][horiz + horizbuild] = house[vertbuild][horizbuild];
					}
					
				}
			}
		}
	}
}

setIndex();
function setIndex() {
for(a = 0; a < 480 / 16; a++) {
	//console.log("scanning vertical");
	for(b = 0; b < 640 / 16; b++) {
		//console.log("scanning horizontal");
		if(getTile((b * 16),(a * 16)) == 1) {
			//console.log("found tile @" + b + ", " + a);
			var num = 0;
			
			if(getTile(b*16,a*16-16) == 1) {
				//console.log("above");
				num += 1;
			}
			if(getTile(b*16,a*16+16) == 1) {
				//console.log("below");
				num += 4;
			}
			if(getTile(b*16-16,a*16) == 1) {
				//console.log("left");
				num += 2;
			}
			if(getTile(b*16+16,a*16) == 1) {
				//console.log("right");
				num += 8;
			}
			tileindex[a][b] = num;
		}
		
	}
	
}
}

i = 0;
j = 0;


function drawMap() {
	for(i = 0; i < map.length; i++) {
		for(j = 0; j < map[i].length; j++) {
			if(Math.floor(map[i][j]) == 1) {
				//context.drawImage(stone,j * 16, i * 16);
				//draw stone based on tileindex
				context.drawImage(stone_sheet,tileindex[i][j] * 16,0,16,16,j*16,i*16,16,16);
			} else if(map[i][j] == 2) {
				context.drawImage(dirt,j * 16, i * 16);
			} else if(map[i][j] == 3) {
				context.drawImage(grass,j * 16, i * 16);
			} else if(map[i][j] == 5) {
				context.drawImage(wood,j * 16, i * 16);
			}
		}
	}
}

function getTile(x,y) {
	var result = 0;
	for(i = 0; i < 480 / 16; i++) {
	for(j = 0; j < 640 / 16; j++) {
		if(i == y / 16) {
			if(j == x / 16) {
				result = map[i][j];
				
			}
		}
	}
	
	
}
return result;
}

function getWalkable(x,y) {
	var result = false;
	for(i = 0; i < 480 / 16; i++) {
	for(j = 0; j < 640 / 16; j++) {
		if(i == y / 16) {
			if(j == x / 16) {
				switch(map[i][j]) {
					case 1:
						result = false;
						break;
					case 2:

					case 5:
					case 3:
						result = true;
						break;
				}
				
			}
		}
	}
	
	
}
return result;
}

function getTileIndex(x,y) {
	var result = 0;
	for(i = 0; i < 480 / 16; i++) {
	for(j = 0; j < 640 / 16; j++) {
		if(i == y / 16) {
			if(j == x / 16) {
				result = tileindex[i][j];
				
			}
		}
	}
	
	
}
return result;
}

drawMap();
keys = [];

function movePlayer() {
	if(player.x != player.xb) {
		player.x += player.spd * Math.sign(player.xb - player.x);
	} 
	if(player.y != player.yb) {
		player.y += player.spd * Math.sign(player.yb - player.y);
	} 
	if(player.x == player.xb && player.y == player.yb) {
		moving = false;
	}
}

function drawPlayer() {
	context.drawImage(player.sprite,player.x,player.y,16,16);
}






//document.getElementById("gold1").style.visibility = "hidden";
//document.getElementById("gold2").style.visibility = "hidden";


requestAnimationFrame(loop);


function loop() {
	time += 1;
	if (time % 60 == 0) {
		tick += 1;
		time = 0;
	}
	context.clearRect(0, 0, c.width, c.height);
	drawMap();
	//input();
	playerInput();
	movePlayer();
	drawPlayer();
	context.drawImage(cursor,mouse.x,mouse.y,16,16);
	context.fillText("Time: " + time + " tick: " + tick,10,30);
	//context.clearRect(0,0,800,600);
	//context.font="20px Georgia";
	//context.fillStyle="gold";
	//context.fillText("Gold: " + gold,10,30);
	
	requestAnimationFrame(loop);
}