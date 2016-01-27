//Constants
var ARROWS_PATH = './arrows';
var ARROWS_TO_LOAD = ['up.png', 'forward.png', 'back.png']; //Load just these images, and rotate / translate them to get other directions
var SCENES_PATH = './scenes';
var SCENES_COUNT = 40;

var CANVAS_SIZE_X = 1024;
var CANVAS_SIZE_Y = 640;

//Enums
//var DIR_UP = 'up.png';
//var DIR_DOWN = 'down.png';
//var DIR_LEFT = 'left.png';
//var DIR_RIGHT = 'right.png';
//var DIR_FORWARD = 'forward.png';


//Class Engine
function Engine(canvasId) {
	this.canvas = document.getElementById(canvasId);
	this.ctx = this.canvas.getContext('2d'); 
	this.canvasBounds = this.canvas.getBoundingClientRect();        
	this.arrows = [];
	this.cursorX = 0;
	this.cursorY = 0;
	this.scenes = [null];	
	this.curScene = 22; //Invalid
	
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
	x = e.clientX - this.canvasBounds.left; 
	y = e.clientY - this.canvasBounds.top;  
		
	this.curScene = nav[this.curScene].f;
}

Engine.prototype.onMouseMove = function(e) {	
	this.cursorX = e.clientX - this.canvasBounds.left; 
	this.cursorY = e.clientY - this.canvasBounds.top;  
	
}


Engine.prototype.onDraw = function() {
	var ctx = this.ctx;
	scene = this.scenes[this.curScene];
	ctx.drawImage(scene, 0, 0, CANVAS_SIZE_X, CANVAS_SIZE_Y);
	
	//Draw navigation arrow
	var arrow = this.arrows[1];
	ctx.drawImage(arrow, this.cursorX - 150, this.cursorY - 100, 100, 50);
	
	window.requestAnimationFrame(this.onDraw.bind(this));
}
//End class Engine

var engine = new Engine('canvas'); //Init

