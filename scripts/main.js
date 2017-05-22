var width = 400,
	height = 600,
	player = new Player(),
	computer = new Computer(),
	ball = new Ball(200, 300);

function Paddle(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.x_speed = 0;
	this.y_speed = 0;
}

Paddle.prototype.render = function() {
	context.fillStyle = "#0000FF";
	context.fillRect(this.x, this.y, this.width, this.height);
};

function Player() {
	this.paddle = new Paddle(175, 580, 50, 10);
}

Player.prototype.render = function() {
	this.paddle.render();
};

function Computer() {
	this.paddle = new Paddle(175, 10, 50, 10);
}

Computer.prototype.render = function() {
	this.paddle.render();
};

function Ball(x, y) {
	this.x = x;
	this.y = y;
	this.x_speed = 0;
	this.y_speed = 3;
	this.radius = 5;
}

Ball.prototype.render = function() {
	context.beginPath();
	context.arc(this.x, this.y, this.radius, 2 * Math.PI, false);
	context.fillStyle = "#000000";
	context.fill();
};

Ball.prototype.update = function(paddle1, paddle2) {
	this.x += this.x_speed;
	this.y += this.y_speed;
	var top_x = this.x - 5;
	var top_y = this.x - 5;
	var bottom_x = this.x + 5;
	var bottom_y = this.y + 5;

	if(this.x - 5 < 0) { // Hitting the left wall
		this.x = 5;
		this.x_speed = -this.x_speed; // Change ball direction
	} else if(this.x + 5 > 400) { // Hitting the right wall
		this.x = 395;
		this.x_speed = -this.x_speed; // Change ball direction
	}

};

var canvas = {

	init: function(){
		var canvasElement = document.createElement('canvas');
		canvasElement.width = width;
		canvasElement.height = height;
		context = canvasElement.getContext('2d');
		document.body.appendChild(canvasElement);
	},

	animateCanvas: function(){
		var animationFrame = window.requestAnimationFrame		|| // Chromium
			window.webkitRequestAnimationFrame								|| // WebKit
			window.mozRequestAnimationFrame										|| // Mozilla
			window.oRequestAnimationFrame											|| // Opera
			window.msRequestAnimationFrame										|| // IE
			null;
		
		animationFrame(function() { 
			canvas.loop();
		});
	},

	update: function(){
		ball.update(player.paddle, computer.paddle);
	},

	render: function(){
		context.fillStyle = "#FF00FF";
		context.fillRect(0, 0, width, height);
		player.render();
		computer.render();
		ball.render();
	},

	loop: function() {
		canvas.update();
		canvas.render();
		canvas.animateCanvas();
	},
}

// Onload Functions
$(document).ready(function(){
	canvas.init();
	canvas.animateCanvas();
});
