var c = document.getElementById("gameCanvas");
var context = c.getContext("2d");


var time = 0;
var tick = 0;
var oldtick = 0;

var gold = 0;
var gravity = .3;

var spr_player = new Image();
var player_sheet = new Image();

var goblin_sheet = new Image();

var stone = new Image();
var dirt = new Image();
var grass = new Image();
var wood = new Image();
var cursor = new Image();
var fighting_icon = new Image();

var stone_sheet = new Image();

//sounds

var sword_hit = new Audio('swordhit.wav');
var sword_miss = new Audio('swordmiss.wav');

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

function Structure(name, array) {
	this.name = name;
	this.sprite = spr_player;
	this.array = array;
	tile.push(this);
}

enemy = [];

function Enemy(name,type,sprite,hp,x,y,xb,yb,moving,spd,roaming) {
	this.name = name;
	this.type = type;
	this.sprite = sprite;
	this.hp = hp;
	this.x = x;
	this.y = y;
	this.xb = xb;
	this.yb = yb;
	this.moving = false;
	this.spd = spd;
	this.roaming = false;
	enemy.push(this);
}


cursor.src = "cursor.png";
wood.src = "wood.png";
stone.src = "stone.png";
stone_sheet.src = "stone_sheet.png";
dirt.src = "dirt.png";
grass.src = "grass.png";
fighting_icon.src = "fighting_icon.png";
spr_player.src = "player.png";
player_sheet.src = "player_sheet.png";
goblin_sheet.src = "goblin_sheet.png";
var width = 640;
var height = 480;

var player = {
	sprite: spr_player,
	x: 16,
	y: 16,
	xb: 16,
	yb: 16,
	spd: 1,
	moving: false,
	dmg: 1,
}

var key = {};

window.addEventListener('keydown',function(e){
    key[e.keyCode || e.which] = true;
},true);    
window.addEventListener('keyup',function(e){
    key[e.keyCode || e.which] = false;
},true);

document.addEventListener('mousemove', function(event) {
	mouse.x = (Math.floor(event.layerX / 16) * 16);
	mouse.y = (Math.floor(event.layerY / 16) * 16);
});

document.addEventListener('mousedown', function(event) {
	console.log(tile[getTile(mouse.x,mouse.y)]);
	console.log("tileindex: " + getTileIndex(mouse.x,mouse.y));
});

var grassTile = new Tile("grassTile",grass,true);
var stoneTile = new Tile("stoneTile",stone_sheet,false);
var dirtTile = new Tile("dirtTile",dirt,true);
var woodTile = new Tile("woodTile",wood,true);

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

var statue = [
	[0,0,0,0,0,0,0],
	[0,1,1,1,1,1,0],
	[0,1,0,1,0,1,0],
	[0,0,1,1,1,0,0],
	[0,1,0,1,0,1,0],
	[0,1,1,1,1,1,0],
	[0,0,0,0,0,0,0]
];



var s_house = new Structure("house",house);
var s_smiley = new Structure("smiley",smiley);
var s_statue = new Structure("statue",statue);

var peggy = new Enemy("peggy","goblin",goblin_sheet,4,16,32,16,32,false,1);
var stabby = new Enemy("stabby","goblin",goblin_sheet,4,32,32,32,32,false,1);


var map = [];
var tileindex = [];

generateMap();
checkStructures();

drawMap();
keys = [];

requestAnimationFrame(loop);

function aiMovement() {
	var i = 0;
	for(i = 0; i < enemy.length; i++) {
			if(enemy[i].roaming) {
		var dir = Math.floor(Math.random() * 29); 
			switch(dir) {
				case 0: //up
					if((tile[getTile(enemy[i].x,enemy[i].y - 16)].walkable) && (!enemy[i].moving)){
						enemy[i].yb -= 16;
						enemy[i].moving = true;
						}
					break;
				case 1: //down
					if((tile[getTile(enemy[i].x,enemy[i].y + 16)].walkable) && (!enemy[i].moving)){
						enemy[i].yb += 16;
						enemy[i].moving = true;
						}
					break;
				case 2: //left
					if((tile[getTile(enemy[i].x + 16,enemy[i].y)].walkable) && (!enemy[i].moving)){
						enemy[i].xb += 16;
						enemy[i].moving = true;
						}
					break;
				case 3: //right
					if((tile[getTile(enemy[i].x - 16,enemy[i].y )].walkable) && (!enemy[i].moving)){
						enemy[i].xb -= 16;
						enemy[i].moving = true;
					}
					break;
				default:
					//do nothing
					break;
			}
		}
	}
	
}

function combat() {
	for(e = 0; e < enemy.length; e++) {
		if((enemy[e].x >= player.x - 24) && (enemy[e].x <= player.x + 24)){
			if((enemy[e].y >= player.y - 24) && (enemy[e].y <= player.y + 24)){
				//there is an enemy near!
				enemy[e].roaming = false;
				var hit = Math.floor(Math.random() * 2);
				switch(hit) {
					case 0:
						//hit!
						
						sword_hit.play();
						enemy[e].hp -= player.dmg;
						console.log("hit! remaining hp: " + enemy[e].hp);
						if(enemy[e].hp <= 0) {
							delete enemy[e].name;
							enemy.splice(e,1);

						}
						break;
					case 1:
						//miss..
						console.log("miss.. remaining hp: " + enemy[e].hp);
						sword_miss.play();
						break;
				}
			} else {
			enemy[e].roaming = true;
			}
		} else {
			enemy[e].roaming = true;
		}
	} 
}

function playerInput() {
	if(key[38]) {
		if((tile[getTile(player.x,player.y - 16)].walkable) && (player.moving == false)){
				player.yb = player.y - 16;
				player.moving = true;
		}
	}
	if(key[40]) {
		if((tile[getTile(player.x ,player.y + 16)].walkable) && (player.moving == false)){
				player.yb = player.y + 16;
				player.moving = true;
		}
	}
	if(key[37]) {
		if((tile[getTile(player.x - 16,player.y)].walkable) && (player.moving == false)){
				player.xb = player.x - 16;
				player.moving = true;
		}
	}
	if(key[39]) {
		if((tile[getTile(player.x + 16,player.y)].walkable) && (player.moving == false)){
				player.xb = player.x + 16;
				player.moving = true;
		}
	}
}

function generateMap() {	
	for(i = 0; i < 30; i++) {
		map[i] = [];
		tileindex[i] = [];
		for(j = 0; j < 40; j++) {
			r = Math.random();
			if (r > .1 && r < .95) {
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
	map[7][11] = 6;
}





function checkStructures () {
	for(vert = 0; vert < 480 / 16; vert++) {
		for(horiz = 0; horiz < 640 / 16; horiz++) {
			if(tile[map[vert][horiz]] instanceof Structure == true) {
				struct = tile[map[vert][horiz]].array;
				console.log("found structure @ " + horiz + ", " + vert);
				//4 is a house
				for(vertbuild = 0; vertbuild < struct.length; vertbuild++) {
					for(horizbuild = 0; horizbuild < struct[vertbuild].length; horizbuild ++) {
						map[vert + vertbuild][horiz + horizbuild] = struct[vertbuild][horizbuild];
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



function movePlayer() {
	if(player.x != player.xb) {
		player.x += player.spd * Math.sign(player.xb - player.x);
	} 
	if(player.y != player.yb) {
		player.y += player.spd * Math.sign(player.yb - player.y);
	} 
	if(player.x == player.xb && player.y == player.yb) {
		player.moving = false;
	}
	for(i = 0; i < enemy.length; i++) {
		if(enemy[i].x != enemy[i].xb) {
		enemy[i].x += enemy[i].spd * Math.sign(enemy[i].xb - enemy[i].x);
			} 
			if(enemy[i].y != enemy[i].yb) {
		enemy[i].y += enemy[i].spd * Math.sign(enemy[i].yb - enemy[i].y);
			} 
			if(enemy[i].x == enemy[i].xb && enemy[i].y == enemy[i].yb) {
				enemy[i].moving = false;
			}
	}
}

function drawEntities() {
		context.drawImage(player_sheet,(tick % 4) * 16,0,16,16,player.x,player.y,16,16);
		for(i = 0; i < enemy.length; i++) {
			context.drawImage(enemy[i].sprite,(tick % 4) * 16,0,16,16,enemy[i].x,enemy[i].y,16,16)
			if(enemy[i].roaming == false) {
				context.drawImage(fighting_icon,enemy[i].x,enemy[i].y,8,8)
			}
		}

	//context.drawImage(player.sprite,player.x,player.y,16,16);
}

function loop() {
	setTimeout(function() {
	requestAnimationFrame(loop);
	time += (1000/60);
	if (time % 600 == 0) {
		oldtick = tick;
		tick += 1;
		time = 0;
		aiMovement();
		combat();
	}
	context.clearRect(0, 0, c.width, c.height);
	drawMap();
	//input();
	playerInput();
	movePlayer();
	drawEntities();
	context.drawImage(cursor,mouse.x,mouse.y,16,16);
	context.fillText("Time: " + Math.floor(time) + " tick: " + tick,10,30);
	//requestAnimationFrame(loop);
	}, 1000 / 60);
}
