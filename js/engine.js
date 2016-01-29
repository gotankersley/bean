'use strict'

//Constants
var CURSORS_PATH = './cursors/thick';
var CURSORS_TO_LOAD = ['up.png', 'down.png', 'left.png', 'right.png', 'forward.png', 'back.png', 'diag-left.png', 'diag-right.png', 'mag.png']; 
var CURSORS_ALIASES = ['u','d','l','r','f','b','dl','dr','m'];
var CURSOR_SIZES_X = {m:150};
var CURSOR_SIZES_Y = {m:78};
var CURSOR_CENTERS_X = {f:15, l:0, d:15, dr:45, dl:0, b:13, m:38, r:39, u:15};
var CURSOR_CENTERS_Y = {f:0, l:16, d:39, dr:0, dl:0, b:26, m:38, r:16, u:0};

var SCENES_PATH = './scenes/light';
var SCENES_COUNT = 48;

var CANVAS_SIZE_X = 1024;
var CANVAS_SIZE_Y = 640;


//Class Engine
function Engine(canvasId) {
	this.canvas = document.getElementById(canvasId);
	this.ctx = this.canvas.getContext('2d'); 
	this.canvasBounds = this.canvas.getBoundingClientRect();        
	document.addEventListener('keypress', this.onKeyPress.bind(this));
	
	this.cursors = {};
	this.scenes = [];	
	this.cursorX = 0;
	this.cursorY = 0;
	
	//Initial
	this.curScene = 0; 
	this.curCursor = null;	
	this.curRegion = null;
	
	//Start
	var self = this;
	this.load(function() {
		self.run();
	});
}


//Loading
Engine.prototype.load = function(onComplete) {	
	this.ctx.strokeText('Loading...', CANVAS_SIZE_X / 2, CANVAS_SIZE_Y/2);
		
	var self = this;
	this.loadScenes(function() {	//Recursive loop
		self.loadCursors(onComplete);
	});
}

Engine.prototype.loadScenes = function(onComplete, i) { //Recursive loading loop
	if (typeof(i) == 'undefined') i = 0;
	var self = this;
	var scene = new Image();	
	scene.onload = function() {
		if (i >= SCENES_COUNT) onComplete();
		else self.loadScenes(onComplete, i+1);
	}
	
	scene.src = SCENES_PATH + '/' + ('0000' + i).substr(-4,4) + '.jpg'; //Zero padded names		
	this.scenes.push(scene);
}

Engine.prototype.loadCursors = function(onComplete, i) {	//Recursive loading loop
	if (typeof(i) == 'undefined') i = 0;
	var self = this;
	var cursorAlias = CURSORS_ALIASES[i];
	var cursor = new Image();  
	cursor.onload = function() {
		if (typeof(CURSOR_SIZES_X[cursorAlias]) != 'undefined') {
			cursor.width = CURSOR_SIZES_X[cursorAlias];
			cursor.height = CURSOR_SIZES_Y[cursorAlias];
		}
		if (i >= CURSORS_TO_LOAD.length - 1) onComplete();
		else self.loadCursors(onComplete, i+1);
	}	
	cursor.src = CURSORS_PATH + '/' + CURSORS_TO_LOAD[i];
		
	this.cursors[cursorAlias] = cursor;
}

//Events
Engine.prototype.onKeyPress = function(e) {
	var key = e.which;	
}

Engine.prototype.run = function() {			
	this.canvas.addEventListener('click', this.onMouseClick.bind(this));
	this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
	window.requestAnimationFrame(this.onDraw.bind(this));
}

Engine.prototype.getActiveRegion = function(point) {	
	var regions = nav[this.curScene];	
	for (var r = 0; r < regions.length; r++) {
		var region = regions[r];
		if (inside(point, region.coords)) {
			this.curRegion = region;
			this.curCursor = region.cursor;
			return region;
		}
	}
	this.curCursor = null;
	return null;
}


Engine.prototype.onMouseClick = function(e) {
	//Get direction based on position
	var x = e.clientX - this.canvasBounds.left; 
	var y = e.clientY - this.canvasBounds.top;  
	
	if (this.getActiveRegion([x,y])) {	
		this.curScene = this.curRegion.target;
	}
	
	
}

Engine.prototype.onMouseMove = function(e) {	
	var x = e.clientX - this.canvasBounds.left; 
	var y = e.cursorY = e.clientY - this.canvasBounds.top;  
	
	this.getActiveRegion([x,y]);
	
	this.cursorX = x;
	this.cursorY = y;
}


Engine.prototype.onDraw = function() {
	var ctx = this.ctx;
	var scene = this.scenes[this.curScene];
	ctx.drawImage(scene, 0, 0, CANVAS_SIZE_X, CANVAS_SIZE_Y);
	
	//Draw navigation cursor
	if (this.curCursor) {
		var c = this.curCursor;
		var cursor = this.cursors[c];
		ctx.drawImage(cursor, this.cursorX - CURSOR_CENTERS_X[c], this.cursorY - CURSOR_CENTERS_Y[c], cursor.width, cursor.height);
	}
	
	window.requestAnimationFrame(this.onDraw.bind(this));
}

//Collision detection
function inside (point, vs) { //https://github.com/substack/point-in-polygon
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
    
    var x = point[0], y = point[1];
    
    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];
        
        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    
    return inside;
};



//Engine.prototype.drawCursor(ctx, dir) {}
//End class Engine

var engine = new Engine('canvas'); //Init

