var ctx;
var canvas;
var tiles = 16;
var tileSz = 32;
var prob = 8;
var canvasSz = tiles * tileSz;
var open = new Array(tiles * tiles);
var mine = new Array(tiles * tiles);
var flag = new Array(tiles * tiles);

var images = {};

window.onload = function() {
	resetTiles();
	canvas = document.getElementById("myCanvas");
	canvas.addEventListener("mousedown", onClick, false);
	
    ctx = canvas.getContext("2d");
    ctx.canvas.width = canvasSz;
    ctx.canvas.height = canvasSz;
	setInterval(renderGrid,25);
};

function resetTiles(){
	for (var i = 0; i < open.length; i++) {
		open[i] = false;
		flag[i] = false;
		mine[i] = Math.random() < 1 / prob;
	}
}

function renderGrid(){
	document.getElementById("mines").innerHTML = "<h1>"+count(flag)+"/"+count(mine)+"<h1>";
	document.getElementById("solved").innerHTML = "<h1>"+((count(flag) == count(mine) && tiles*tiles-count(open) == count(flag))?"Solved! Unflag and click a mine to try again.":"Good Luck!")+"</h1>";
	for (var i = 0; i < open.length; i++) {
		var id = getImg(i);
		var x = (i % tiles) * tileSz;
		var y = Math.floor(i / tiles) * tileSz;
		drawTile(x, y, id);
	}
}

function count(lst){
	var sum = 0;
	for(var i = 0; i < tiles*tiles; i++) sum+=lst[i];
	return sum;
}

function drawTile(x, y, id) {
	if(typeof images[id] === "undefined"){
		var drawing = new Image();
		drawing.src = id;
		images[id] = drawing;
		drawing.onload = function() { ctx.drawImage(drawing, x, y); }
	}else ctx.drawImage(images[id], x, y);
}

function onClick(event) {
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
	var i = Math.floor(x / tileSz) + Math.floor(y / tileSz) * tiles;
	if(event.button == 0) flood(i);
	else if(getImg(i) == "images/ue.png" || getImg(i) == "images/uf.png") flag[i] = !flag[i];
	renderGrid();
}

function flood(i) {
	if(getImg(i) == "images/ue.png") {
		open[i] = true;
		if(getImg(i) == "images/o0.png") {
			if(i % tiles != 0) {
				if(i - tiles - 1 >= 0) flood(i - tiles - 1);
				if(i - 1 >= 0) flood(i - 1);
				if(i + tiles - 1 < mine.length) flood(i + tiles - 1);
			}
			if(i % tiles != tiles - 1) {
				if(i - tiles + 1 >= 0) flood(i - tiles + 1);
				flood(i + 1);
				if(i + tiles + 1 < mine.length) flood(i + tiles + 1);
			}
			if(i + tiles < mine.length) flood(i + tiles);
			if(i - tiles >= 0) flood(i - tiles);
		}
		else if(getImg(i) == "images/om.png")
		resetTiles();
	}
}

function getImg(i, flood) {
	if(flag[i]) return "images/uf.png";
	if(!open[i]) return "images/ue.png";
	if(mine[i]) return "images/om.png";
	var surround = 0;
	if(i % tiles != 0) {
		if(i - tiles - 1 >= 0 && mine[i - tiles - 1]) surround++;
		if(i - 1 >= 0 && mine[i - 1]) surround++;
		if(i + tiles - 1 < mine.length && mine[i + tiles - 1]) surround++;
	}
	if(i % tiles != tiles - 1) {
		if(i - tiles + 1 >= 0 && mine[i - tiles + 1]) surround++;
		if(mine[i + 1]) surround++;
		if(i + tiles + 1 < mine.length && mine[i + tiles + 1]) surround++;
	}
	if(i + tiles < mine.length && mine[i + tiles]) surround++;
	if(i - tiles >= 0 && mine[i - tiles]) surround++;
	return "images/o" + surround + ".png";
}