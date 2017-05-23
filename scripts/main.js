var	player = new Player(),
		computer = new Computer(),
		ball = new Ball(200, 300);

function Paddle(x, y, width, height){
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.x_speed = 0;
	this.y_speed = 0;
}

Paddle.prototype.render = function(){
	context.fillStyle = "#FFFFFF";
	context.fillRect(this.x, this.y, this.width, this.height);
};

Paddle.prototype.move = function(x, y){
	this.x += x;
	this.y += y;
	this.x_speed = x;
  this.y_speed = y;

	// Prevent paddle from going out of bounds
	if(this.x < 0){
		this.x = 0;
		this.x_speed = 0;
	}

	if((this.x + this.width) > canvas.width){
		this.x = (canvas.width - this.width);
		this.x_speed = 0;
	}
};

function Player() {
	this.paddle = new Paddle(175, 580, 50, 10);
}

Player.prototype.render = function(){
	this.paddle.render();
};

Player.prototype.update = function(){
	Object.keys(keysDown).forEach(function(key){
		var value = Number(key);
		if(value == 37) { // left arrow
			this.player.paddle.move(-4, 0);
		} else if (value == 39) { // right arrow
			this.player.paddle.move(4, 0);
		} 
	});
};

function Computer() {
	this.paddle = new Paddle(175, 10, 50, 10);
}

Computer.prototype.render = function(){
	this.paddle.render();
};

Computer.prototype.update = function(ball){
	var ball_position = ball.x;
	var paddle_position = (this.paddle.x + this.paddle.width / 2);
	
	// Track ball
	if((paddle_position - ball_position) > 4){
		this.paddle.move(-6, 0);
	} else if((paddle_position - ball_position) < -4){
		this.paddle.move(6, 0);
	}
};

function Ball(x, y) {
	this.x = 200;
	this.y = 300;
	this.x_speed = 0;
	this.y_speed = 3;
	this.radius = 5;
}

Ball.prototype.render = function(){
	context.beginPath();
	context.arc(this.x, this.y, this.radius, 2 * Math.PI, false);
	context.fillStyle = "#FFFFFF";
	context.fill();
};

Ball.prototype.reset = function(){
	this.x = 200;
	this.y = 300;
	this.x_speed = 0;
	this.y_speed = 3;
	this.radius = 5;
};

Ball.prototype.update = function(paddle1, paddle2){
	this.x += this.x_speed;
	this.y += this.y_speed;
	var top_x = this.x - 5;
	var top_y = this.y - 5;
	var bottom_x = this.x + 5;
	var bottom_y = this.y + 5;

	if(this.x - 5 < 0) { // Hitting the left wall
		this.x = 5;
		this.x_speed = -this.x_speed; // Change ball direction
	} else if(this.x + 5 > 400) { // Hitting the right wall
		this.x = 395;
		this.x_speed = -this.x_speed; // Change ball direction
	}

	// Reset ball after point has been scored
	if(this.y < 0 || this.y > 600){
		scoreboard.updateScore(this.y);
		this.reset();
	}

	// Check if ball hit player's paddle
	if(top_y < (paddle1.y + paddle1.height) && bottom_y > paddle1.y && top_x < (paddle1.x + paddle1.width) && bottom_x > paddle1.x) {
		// Hit players paddle
		this.y_speed = -3;
		this.x_speed += (paddle1.x_speed / 2);
		this.y += this.y_speed;
	}

	// Check if ball hit computer's paddle
	if(top_y < (paddle2.y + paddle2.height) && bottom_y > paddle2.y && top_x < (paddle2.x + paddle2.width) && bottom_x > paddle2.x) {
		// Hit computer's paddle
		this.y_speed = 3;
		this.x_speed += (paddle2.x_speed / 2);
		this.y += this.y_speed;
	}
};

var keysDown = {};

window.addEventListener("keydown", function(event) {
  keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function(event) {
  delete keysDown[event.keyCode];
});

var canvas = {

	width: 400,
	height: 600,

	init: function(){
		var canvasElement = document.createElement('canvas');
		canvasElement.width = this.width;
		canvasElement.height = this.height;
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
		
		animationFrame(function(){ 
			canvas.loop();
		});
	},

	update: function(){
		player.update();
		computer.update(ball);
		ball.update(player.paddle, computer.paddle);
	},

	render: function(){
		context.fillStyle = "#000000";
		context.fillRect(0, 0, this.width, this.height);
		context.beginPath();
		context.setLineDash([5, 15]);
		context.moveTo(0, 300);
		context.lineTo(400, 300);
		context.strokeStyle = '#FFFFFF';
		context.stroke();
		
		player.render();
		computer.render();
		ball.render();
	},

	loop: function(){
		this.update();
		this.render();
		this.animateCanvas();
	},
}

var scoreboard = {

	playerScore: 0,
	computerScore: 0,

	init: function(){
		$('body').append('<div class="computerScore">');
		$('body').append('<div class="playerScore">');
		$('.playerScore').text(this.playerScore);
		$('.computerScore').text(this.computerScore);
	},

	updateScore: function(ball_position){
		if(ball_position > 600){
			// Computer scored a point
			this.computerScore += 1;
			$('.computerScore').text(this.computerScore);
		} else {
			// Player scored a point
			this.playerScore += 1;
			$('.playerScore').text(this.playerScore);
		}
	}
}

// Onload Functions
$(document).ready(function(){
	canvas.init();
	canvas.animateCanvas();
	scoreboard.init();
	// TODO: Add start/pause
});
