var c = document.getElementById("gameCanvas");
var context = c.getContext("2d");


var time = 0;
var tick = 0;

var gold = 0;
var gravity = .3;

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

tile = [];

function Tile(name,sprite,walkable) {
	this.name = name;
	this.sprite = sprite;
	this.walkable = walkable;
	tile.push(this);
}



cursor.src = "cursor.png";
wood.src = "wood.png";
stone.src = "stone.png";
stone_sheet.src = "stone_sheet.png";
dirt.src = "dirt.png";
grass.src = "grass.png";

spr_player.src = "player.png";
var width = 640;
var height = 480;

var player = {
	sprite: spr_player,
	x: 16,
	y: 16,
	xb: 16,
	yb: 16,
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
	console.log(tile[getTile(mouse.x,mouse.y)]);
	console.log("tileindex: " + getTileIndex(mouse.x,mouse.y));
});

var grassTile = new Tile("grassTile",grass,true);
var stoneTile = new Tile("stoneTile",stone_sheet,false);
var dirtTile = new Tile("dirtTile",dirt,true);
var woodTile = new Tile("woodTile",wood,true);



function playerInput() {
	if(key[38]) {
		if((tile[getTile(player.x,player.y - 16)].walkable) && (moving == false)){
				player.yb -= 16;
				moving = true;
		}
	}
	if(key[40]) {
		if((tile[getTile(player.x ,player.y + 16)].walkable) && (moving == false)){
				player.yb += 16;
				moving = true;
		}
	}
	if(key[37]) {
		if((tile[getTile(player.x - 16,player.y)].walkable) && (moving == false)){
				player.xb -= 16;
				moving = true;
		}
	}
	if(key[39]) {
		if((tile[getTile(player.x + 16,player.y)].walkable) && (moving == false)){
				player.xb += 16;
				moving = true;
		}
	}
}

var map = [];
var tileindex = [];

generateMap()
function generateMap() {	
	for(i = 0; i < 30; i++) {
		map[i] = [];
		tileindex[i] = [];
		for(j = 0; j < 40; j++) {
			r = Math.random();
			if (r > .1 && r < .9) {
				map[i][j] = 0;
			} else if (r > .99){
				map[i][j] = 2;
			} else {
				map[i][j] = 1;
			}
			if(i == 0 || i == 29) {
				map[i][j] = 1;
			}
			if (j == 0 || j == 39) {
				map[i][j] = 1;
			}
			tileindex[i][j] = 0;
		}

	}
	map[7][11] = 4;
}



//map[7][11] = 4;

var house = [
	[0,0,0,0,0,0,0],
	[0,1,1,1,1,1,0],
	[0,1,3,3,3,1,0],
	[0,1,3,3,3,1,0],
	[0,1,3,3,3,1,0],
	[0,1,1,0,1,1,0],
	[0,0,0,0,0,0,0]
];

var smiley = [
	[0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0],
	[0,0,1,0,1,0,0],
	[0,0,0,0,0,0,0],
	[0,1,0,0,0,1,0],
	[0,0,1,1,1,0,0],
	[0,0,0,0,0,0,0]
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


function drawMap() {
	for(i = 0; i < map.length; i++ ) {
		for(j = 0; j < map[i].length; j++) {
			context.drawImage(tile[map[i][j]].sprite,tileindex[i][j] * 16,0,16,16,j*16,i*16,16,16);
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
