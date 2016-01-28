'use strict'

//Constants
var ARROWS_PATH = './arrows';
//var ARROWS_TO_LOAD = ['up.png', 'forward.png', 'back.png']; //Load just these images, and rotate / translate them to get other directions
var ARROWS_TO_LOAD = ['up.png', 'down.png', 'left.png', 'right.png', 'forward.png', 'back.png']; //Load just these images, and rotate / translate them to get other directions
var SCENES_PATH = './scenes';
var SCENES_COUNT = 48;

var CANVAS_SIZE_X = 1024;
var CANVAS_SIZE_Y = 640;


//Class Engine
function Engine(canvasId) {
	this.canvas = document.getElementById(canvasId);
	this.ctx = this.canvas.getContext('2d'); 
	this.canvasBounds = this.canvas.getBoundingClientRect();        
	this.arrows = [];
	this.cursorX = 0;
	this.cursorY = 0;
	this.scenes = [null];	
	
	this.curScene = 22; //start
	this.curArrow = 1;
	
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
		self.loadArrows(onComplete);
	});
}

Engine.prototype.loadScenes = function(onComplete, i) { //Recursive loading loop
	if (typeof(i) == 'undefined') i = 1;
	var self = this;
	var scene = new Image();	
	scene.onload = function() {
		if (i >= SCENES_COUNT) onComplete();
		else self.loadScenes(onComplete, i+1);
	}
	
	scene.src = SCENES_PATH + '/' + ('0000' + i).substr(-4,4) + '.jpg'; //Zero padded names	
	this.scenes.push(scene);
}

Engine.prototype.loadArrows = function(onComplete, i) {	//Recursive loading loop
	if (typeof(i) == 'undefined') i = 0;
	var self = this;
	var arrow = new Image();  
	arrow.onload = function() {
		if (i >= ARROWS_TO_LOAD.length - 1) onComplete();
		else self.loadArrows(onComplete, i+1);
	}	
	arrow.src = ARROWS_PATH + '/' + ARROWS_TO_LOAD[i]; 
	this.arrows.push(arrow);
}

//Events
Engine.prototype.run = function() {		
	//this.ctx.strokeText('Running...', CANVAS_SIZE_X / 2, CANVAS_SIZE_Y/2);
	this.canvas.addEventListener('click', this.onMouseClick.bind(this));
	this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
	window.requestAnimationFrame(this.onDraw.bind(this));
}

Engine.prototype.onMouseClick = function(e) {
	//Get direction based on position
	var x = e.clientX - this.canvasBounds.left; 
	var y = e.clientY - this.canvasBounds.top;  
		
	this.curScene = nav[this.curScene].f;
	
}

Engine.prototype.onMouseMove = function(e) {	
	var x = e.clientX - this.canvasBounds.left; 
	var y = e.cursorY = e.clientY - this.canvasBounds.top;  
	var point = [x, y];
	var polygon = [[341,639], [413,396], [415,0], [934,1], [879,572], [919,637], [341,639]];
	if (inside(point, polygon)) this.curArrow = 2;
	else this.curArrow = 1;
	this.cursorX = x;
	this.cursorY = y;
}


Engine.prototype.onDraw = function() {
	var ctx = this.ctx;
	var scene = this.scenes[this.curScene];
	ctx.drawImage(scene, 0, 0, CANVAS_SIZE_X, CANVAS_SIZE_Y);
	
	//Draw navigation arrow
	var arrow = this.arrows[this.curArrow];
	ctx.drawImage(arrow, this.cursorX - 150, this.cursorY - 100, 100, 50);
	
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



//Engine.prototype.drawArrow(ctx, dir) {}
//End class Engine

var engine = new Engine('canvas'); //Init

