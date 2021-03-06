var c = document.getElementById("gameCanvas");
var context = c.getContext("2d");
c.width = 960 * 2;
c.height = 680 * 2;
context.font = "12px Monospace";

var lastLoop = new Date;

var time = 0;
var tick = 0;
var oldtick = 0;

var gold = 0;
var gravity = .3;

var spr_player = new Image();
var player_sheet = new Image();

var goblin_sheet = new Image();
var goblin_death = new Image();

var stone = new Image();
var dirt = new Image();
var grass = new Image();
var wood = new Image();
var cursor = new Image();
var fighting_icon = new Image();

var health_potion = new Image();
var mana_potion = new Image();
var goldi = new Image();

var stone_sheet = new Image();
var dirt_sheet = new Image();

//sounds

var chat = ["","","","","","","","","","","","",""];

var sword_hit = new Audio('resources/sounds/swordhit.wav');
var sword_miss = new Audio('resources/sounds/swordmiss.wav');

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

item = [];

function Item(name,category,sprite,stackable,worth) {
	this.name = name;
	this.category = category;
	this.sprite = sprite;
	this.stackable = stackable;
	this.worth = worth;
	item.push(this);
}

enemy = [];

function Enemy(name,type,sprite,hp,x,y,moving,spd,roaming) {
	this.name = name;
	this.type = type;
	this.sprite = sprite;
	this.hp = hp;
	this.x = x;
	this.y = y;
	this.xb = x;
	this.yb = y;
	this.moving = false;
	this.spd = spd;
	this.roaming = roaming;
	this.dying = false;
	this.deathtimer = 0;
	this.dmg = 1;
	enemy.push(this);
}

popup = [];

function Popup(text,x,y,timer,color,moves) {
	this.text = text;
	this.x = x;
	this.y = y;
	this.timer = timer;
	this.color = color;
	this.moves = moves;
	popup.push(this);
}

cursor.src = "./resources/cursor.png";
wood.src = "resources/tiles/wood.png";
stone.src = "resources/tiles/stone.png";
stone_sheet.src = "resources/tiles/stone_sheet.png";
dirt.src = "resources/tiles/dirt.png";
dirt_sheet.src = "resources/tiles/sand_sheet.png";
grass.src = "resources/tiles/grass.png";
fighting_icon.src = "resources/fighting_icon.png";
player_sheet.src = "resources/entities/player_sheet.png";
goblin_sheet.src = "resources/entities/goblin_sheet.png";
goblin_death.src = "resources/entities/goblin_death.png";
health_potion.src = "resources/items/potions/health_potion.png";
mana_potion.src = "resources/items/potions/mana_potion.png";
goldi.src = "resources/items/potions/peri_potion.png";
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
	hp: 10,
	dying: false
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
var dirtTile = new Tile("dirtTile",dirt_sheet,true);
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

//var peggy = new Enemy("peggy","goblin",goblin_sheet,4,16,32,16,32,false,1);
//var stabby = new Enemy("stabby","goblin",goblin_sheet,4,32,32,32,32,false,1);
new Item("gold","gold",goldi,true,-1);
new Item("Health Potion","potion",health_potion,true,50);
new Item("Mana Potion","potion",mana_potion,true,50);

inventory = [
	["",0],
	["",0],
	["",0],
	["",0],
	["",0]



];


function addItemToInventory(item) {
	for(i = 0; i < inventory.length; i++) { //find first empty space
		console.log("finding...");
		if(inventory[i][0] == "") {
			console.log("found! replacing!");
			inventory[i][0] = item;
			inventory[i][1] = 1;
			console.log("successful?");
		}
		break;
	}
}

//TODO: MAKE SURE THERE'S SPACE



var map = [];
var tileindex = [];

generateMap();
checkStructures();
generateMonsters();

drawMap();
keys = [];


requestAnimationFrame(loop);

function aiMovement() {
	for(d = 0; d < enemy.length; d++) {
		if(enemy[d].dying) {
			enemy[d].deathtimer += 1;
			if(enemy[d].deathtimer == 4) {
					delete enemy[d].name;
					enemy.splice(d,1);
					var ag = Math.floor(Math.random() * 9);
					gold += ag;
					addLine("Loot: " + ag + " gold");
			}
		}
	}
	var i = 0;
	for(i = 0; i < enemy.length; i++) {
			if(enemy[i].roaming && !enemy[i].dying) {
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
		for(a = 0; a < enemy.length; a++) {
			if((enemy[a].x == enemy[i].x + 16) && (enemy[a].y == enemy[i].y)) {
				enemy[i].xb = enemy[i].x;
			}
			if((enemy[a].x == enemy[i].x - 16) && (enemy[a].y == enemy[i].y)){
				enemy[i].xb = enemy[i].x;
			}
			if((enemy[a].y == enemy[i].y - 16) && (enemy[a].x == enemy[i].x)){
				enemy[i].yb = enemy[i].y;
			}
			if((enemy[a].y == enemy[i].y + 16) && (enemy[a].x == enemy[i].x)){
				enemy[i].yb = enemy[i].y;
			}
		}
	}
	
}

function combat() {
	for(e = 0; e < enemy.length; e++) {
		if((player.x >= enemy[e].x - 24) && (player.x <= enemy[e].x + 24) && (player.dying == false) && (enemy[e].dying == false)){
			if((player.y >= enemy[e].y - 24) && (player.y <= enemy[e].y + 24)){
				var hit = Math.floor(Math.random() * 4);
				switch(hit) {
					case 0:
						//hit!
						sword_hit.play();
						player.hp -= enemy[e].dmg;
						addLine("Hit player for " + enemy[e].dmg + " damage!");
						if(player.hp < 0) {
							player.hp = 0;
						}
						new Popup("1",player.x + 6,player.y,30,"#ff0000",true);
						if(player.hp <= 0) {
							player.dying = true;
							addLine("you have died!");
						}
						break;
					case 1:
					case 2:
					case 3:
						//miss..
						//console.log("miss.. remaining hp: " + enemy[e].hp);
						addLine("Missed player!");
						new Popup("0",player.x + 6,player.y,30,"#0000ff",true);
						sword_miss.play();
						break;
				}
			}
		}

		if((enemy[e].x >= player.x - 24) && (enemy[e].x <= player.x + 24) && (enemy[e].dying == false)){
			if((enemy[e].y >= player.y - 24) && (enemy[e].y <= player.y + 24)){
				//there is an enemy near!
				enemy[e].roaming = false;
				var hit = Math.floor(Math.random() * 2);
				switch(hit) {
					case 0:
						//hit!
						sword_hit.play();
						enemy[e].hp -= player.dmg;
						addLine("Hit " + enemy[e].type +  " for " + player.dmg + " damage!");
						if(enemy[e].hp < 0) {
							enemy[e].hp = 0;
						}
						new Popup(player.dmg,enemy[e].x + 6,enemy[e].y,30,"#ff0000",true);
						if(enemy[e].hp <= 0) {
							enemy[e].dying = true;
							addLine(enemy[e].type + " has died!");
						}
						break;
					case 1:
						//miss..
						//console.log("miss.. remaining hp: " + enemy[e].hp);
						addLine("Missed " + enemy[e].type +  "!");
						new Popup("0",enemy[e].x + 6,enemy[e].y,30,"#0000ff",true);
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
	for(a = 0; a < enemy.length; a++) {
			if((enemy[a].x == player.x + 16) && (enemy[a].y == player.y) && (player.xb == player.x + 16)) {
				player.xb = player.x;
			}
			if((enemy[a].x == player.x - 16) && (enemy[a].y == player.y) && (player.xb == player.x - 16)){
				player.xb = player.x;
			}
			if((enemy[a].y == player.y - 16) && (enemy[a].x == player.x) && (player.yb == player.y - 16)){
				player.yb = player.y;
			}
			if((enemy[a].y == player.y + 16) && (enemy[a].x == player.x) && (player.yb == player.y + 16)){
				player.yb = player.y;
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
			} else if (r > .95){
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

function generateMonsters() {
	for(i = 0; i < 30; i++) {
		for(j = 0; j < 40; j++) {
			if(tile[map[i][j]].walkable) {
				var rand = Math.random();
				if(rand > .95) {
					new Enemy("","goblin",goblin_sheet,4,j * 16,i * 16,false,1);
				}
			}
		}
	}
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

setIndex(1);
setIndex(2);
function setIndex(tile_id) {
for(a = 0; a < 480 / 16; a++) {
	//console.log("scanning vertical");
	for(b = 0; b < 640 / 16; b++) {
		//console.log("scanning horizontal");
		if(getTile((b * 16),(a * 16)) == tile_id) {
			//console.log("found tile @" + b + ", " + a);
			var num = 0;
			
			if(getTile(b*16,a*16-16) == tile_id) {
				//console.log("above");
				num += 1;
			}
			if(getTile(b*16,a*16+16) == tile_id) {
				//console.log("below");
				num += 4;
			}
			if(getTile(b*16-16,a*16) == tile_id) {
				//console.log("left");
				num += 2;
			}
			if(getTile(b*16+16,a*16) == tile_id) {
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
				context.fillStyle = "#000000";
				context.fillRect(player.x,player.y + 14,16,2);
				context.fillStyle = "#00FF00";
				context.fillRect(player.x,player.y + 14,(player.hp / 10) * 16,2);
		for(i = 0; i < enemy.length; i++) {
			if(!enemy[i].dying) {
				context.drawImage(enemy[i].sprite,(tick % 4) * 16,0,16,16,enemy[i].x,enemy[i].y,16,16);
			} else {
				context.drawImage(goblin_death,(enemy[i].deathtimer) * 16,0,16,16,enemy[i].x,enemy[i].y,16,16);
			}
			
			if(enemy[i].roaming == false) {
				//context.drawImage(fighting_icon,enemy[i].x,enemy[i].y,8,8)
				context.fillStyle = "#000000";
				context.fillRect(enemy[i].x,enemy[i].y + 14,16,2);
				context.fillStyle = "#00FF00";
				context.fillRect(enemy[i].x,enemy[i].y + 14,(enemy[i].hp / 4) * 16,2);
			}
		}

	//context.drawImage(player.sprite,player.x,player.y,16,16);
}

function drawPopups() {
	for(i = 0; i < popup.length; i++) {
		context.fillStyle = popup[i].color;
		//context.strokeText(popup[i].text,popup[i].x,popup[i].y);
		context.fillText(popup[i].text,popup[i].x,popup[i].y);
		popup[i].timer -= 1;
		if(popup[i].moves) {
			popup[i].y -= .25;
		}	
		if(popup[i].timer == 0) {
			delete popup[i];
			popup.splice(i,1);
		}
	}
}

function addLine(line) {
	for(i = 12; i > -1; i--) {
			chat[i] = chat[i - 1]
			if(i - 1 == -1) {
				chat[i] = line;
			}
	}
}


function loop() {
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
	playerInput();
	movePlayer();
	drawEntities();
	context.font = "12px Monospace";
	drawPopups();
	var thisLoop = new Date;
    var fps = 1000 / (thisLoop - lastLoop);
    lastLoop = thisLoop;
	context.drawImage(cursor,mouse.x,mouse.y,16,16);
	context.fillStyle = "#ffff00";
	context.fillText("FPS: " + Math.floor(fps) + " Time: " + Math.floor(time) + " tick: " + tick,10,450);
	context.fillText("Gold: " + gold,10,460);
	context.fillStyle = "#333333";
	context.fillRect(0,480,640,150);
	context.fillStyle = "#000000";
	context.fillRect(640,0,320,480 + 150);
	context.fillStyle = "#ffffff";
	context.font = "italic 12px Monospace";
	for(i = 0; i < chat.length; i++) {
		context.fillText(chat[i],4, (480 + 150) - 4 - (i * 10));
	}
	requestAnimationFrame(loop);
}
