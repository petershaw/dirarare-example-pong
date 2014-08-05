#!/usr/bin/env node

var   dirarare = require('dirarare-client-lib')
	, keypress = require('keypress')
	;
	
var matrix 		= new dirarare.Matrix(8, 8);
var movement 	= new dirarare.Movement(matrix);
var animation 	= new dirarare.Animation(matrix);

var racket1		= new dirarare.Line([0,0], [0,2]);
var racket2		= new dirarare.Line([7,5], [7,7]);
var ball		= new dirarare.Point([4,4]);

racket1.enableLines();
racket2.enableLines();

racket1.setGlobalBrightness(100);
racket2.setGlobalBrightness(100);
ball.setGlobalBrightness(200);

var ConsolePrinter = new dirarare.ConsolePrinter(matrix);
//var ArtNetPrinter = new dirarare.ArtNetPrinter(matrix);

matrix.setTarget( ConsolePrinter );

matrix.addElement('racket1', racket1);
matrix.addElement('racket2', racket2);
matrix.addElement('ball', ball);

animation.updateFrequency(80);
animation.updateFunction(function(){
	matrix.draw(function(data){
	});
});

animation.start();

var globalSpeed = 500;
var gamespeed = function gamespeed(){
	return globalSpeed;
}

var driftx = driftx || parseInt(Math.random() *2) -1 || ((Math.random() *2 > 0) ? 1: -1); ;
var drifty = 0.0;
				
var ballanimation = animation.add(gamespeed, 'ball'
	, function(element, matrix){
	
		// Ball animation
		movement.moveBy(element, [driftx, drifty], function(_element){
			// if ball on racket?
			if(racket1.isPointInside(ball.midPoint)){
				racket1.commitPosition();
				driftx = driftx *-1;
				if(racket1.squareBounds[0][1] == ball.midPoint[1]){
					drifty = drifty - 0.1;
				} else if(racket1.squareBounds[2][1] == ball.midPoint[1]){
					drifty = drifty + 0.1;
				}
				movement.moveBy(ball, [2, 0]);
				if(globalSpeed > 30){
					globalSpeed -= 10;
				}
				return;
			}
			if(racket2.isPointInside(ball.midPoint)){
				racket2.commitPosition();
				driftx = driftx *-1;
				if(racket2.squareBounds[0][1] == ball.midPoint[1]){
					drifty = drifty - 0.1;
				} else if(racket2.squareBounds[2][1] == ball.midPoint[1] ){
					drifty = drifty + 0.1;
				}			
				movement.moveBy(ball, [-2, 0]);
				if(globalSpeed > 30){
					globalSpeed -= 10;
				}
				return;
			}
			
			// if ball on border
			if(ball.midPoint[1] < 0){
				movement.moveBy(ball, [0, 2]);
				drifty = drifty *-1;
			} else if(ball.midPoint[1] > matrix.dimension.y){
				movement.moveBy(ball, [0, -2]);
				drifty = drifty *-1;
			}
			
			
			// if ball is out
			if(element.midPoint[0] < 0){
				// highlight winner
				racket2.setGlobalBrightness(255);
				drifty = 0;
				globalSpeed = 500;
				movement.moveTo(ball, [-1, -1], function(){
				setTimeout(function(){
					movement.moveTo(ball, [4, 4], function(){
						racket2.setGlobalBrightness(100);
					});
				}, 1000);
				});
			}			
			if(element.midPoint[0] > 7){
				// highlight winner
				racket1.setGlobalBrightness(255);
				drifty = 0;
				globalSpeed = 500;
				movement.moveTo(ball, [-1, -1], function(){
				setTimeout(function(){
					movement.moveTo(ball, [4, 4], function(){
						racket1.setGlobalBrightness(100);
					});
				}, 1000);
				});
			}
		});
	}
);

// Handle key press events
keypress(process.stdin);
process.stdin.on('keypress', function (ch, key) {
	if(key.name == 'down'){
		if( racket2.midPoint[1] < 6 ){
			movement.moveBy(racket2, [0, 1], function(){});
		}
	}
	if(key.name == 'up'){
		if( racket2.midPoint[1] > 1 ){
			movement.moveBy(racket2, [0, -1], function(){});
		}
	}
	if(key.name == 'y'){
		if( racket1.midPoint[1] < 6 ){
			movement.moveBy(racket1, [0, 1], function(){});
		}
	}
	if(key.name == 'a'){
		if( racket1.midPoint[1] > 1 ){
			movement.moveBy(racket1, [0, -1], function(){});  
		}
	}

	if (key && key.ctrl && key.name == 'c') {
    	process.exit(0);
	} else if( key && key.name == 'escape'){
		process.exit(0);
	}

});
process.stdin.setRawMode(true);
process.stdin.resume();
