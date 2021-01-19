var speedOfPaddle1 = 0;
const startPositionOfPaddle1 = document.getElementById("paddle1").offsetTop;
var positionOfPaddle1 = startPositionOfPaddle1;
var speedOfPaddle2 = 0;
const startPositionOfPaddle2 = document.getElementById("paddle2").offsetTop;
var positionOfPaddle2 = startPositionOfPaddle2;
const paddleHeight = document.getElementById("paddle1").offsetHeight;
const paddleWidth = document.getElementById("paddle1").offsetWidth;

const gameboardHeight = document.getElementById("gameBoard").offsetHeight;
const gameboardWidth = document.getElementById("gameBoard").offsetWidth;

const ballHeight = document.getElementById("ball").offsetHeight;
	
const startTopPositionOfBall = document.getElementById("ball").offsetTop;
const startLeftPositionOfBall = document.getElementById("ball").offsetLeft;

var topPositionOfBall = startTopPositionOfBall;
var leftPositionOfBall = startLeftPositionOfBall;
var topSpeedOfBall = 0;
var leftSpeedOfBall = 0;

var score1 = 0;
var score2 = 0;
const totalScore = 10;

var bounce = new sound("bounce.wav");
var lost = new sound("lost.wav");

var controlPlay = false;
var gameEnded = false;

//window.addEventListener('load',function() {
//	startBall();
//});

document.addEventListener('keydown',  function(e) {
	//console.log("key down" + e.keyCode);
	if(e.keyCode == 87 || e.which == 87) {
		speedOfPaddle1 = -10;
	}
	
	if(e.keyCode == 83 || e.which == 83) {
		speedOfPaddle1 = 10;
	}
	
	if(e.keyCode == 38 || e.which == 38) {
		speedOfPaddle2 = -10;
	}
	
	if(e.keyCode == 40 || e.which == 40) {
		speedOfPaddle2 = 10;
	}
});

document.addEventListener('keyup',  function(e) {
	//console.log("key up" + e.keyCode);
	if(e.keyCode == 87 || e.which == 87) {
		speedOfPaddle1 = 0;
	}
	
	
	if(e.keyCode == 83 || e.which == 83) {
		speedOfPaddle1 = 0;
	}
	if(e.keyCode == 38 || e.which == 38) {
		speedOfPaddle2 = 0;
	}
	if(e.keyCode == 40 || e.which == 40) {
		speedOfPaddle2 = 0;
	}	
});

function sound(src) {
	this.sound = document.createElement("audio");
	this.sound.src = src;
	this.sound.setAttribute("preload", "auto");
	this.sound.setAttribute("controls", "none");
	this.sound.style.display = "none";
	document.body.appendChild(this.sound);
	this.play = function() {
		this.sound.play();
	}
	this.stop = function(){
		this.sound.pause();
	}
}

function startBall() {
	let direction = 1;
	topPositionOfBall = startTopPositionOfBall;
	leftPositionOfBall = startLeftPositionOfBall;

	if (Math.random() < 0.5) {
		direction = 1;
	} else {
		direction = -1;
	}//else
	if (score1 < score2){
		document.getElementById("paddle1").style.height = "150px";
		document.getElementById("paddle2").style.height = "75px";
	} else if (score2 < score1) {
		document.getElementById("paddle2").style.height = "150px";
		document.getElementById("paddle1").style.height = "75px";
	} else {
		document.getElementById("paddle1").style.height = "150px";
		document.getElementById("paddle2").style.height = "150px";
	}
	topSpeedOfBall = Math.random() * 2 + 3;
	leftSpeedOfBall = ((Math.random() * (Math.random() * 2 + 3) + 3) * direction);
}



function show() {
	
	positionOfPaddle1 += speedOfPaddle1;
	positionOfPaddle2 += speedOfPaddle2;
	topPositionOfBall += topSpeedOfBall;
	leftPositionOfBall += leftSpeedOfBall;
	
	if(positionOfPaddle1 <= 0) {
		positionOfPaddle1 = 0;
	}//if
	
	if(positionOfPaddle2 <= 0) {
		positionOfPaddle2 = 0;
	}//if
	
	if(positionOfPaddle1 >= gameboardHeight - paddleHeight) {
		positionOfPaddle1 = gameboardHeight - paddleHeight;
	}//if
	
	if(positionOfPaddle2 >= gameboardHeight - paddleHeight) {
		positionOfPaddle2 = gameboardHeight - paddleHeight;
	}//if
	
	if (topPositionOfBall <= 0 || topPositionOfBall >= gameboardHeight - ballHeight) {
		topSpeedOfBall *= -1;
	}//if
	
	if(leftPositionOfBall <= paddleWidth) {
		
		if(topPositionOfBall > positionOfPaddle1 && topPositionOfBall < positionOfPaddle1 + paddleHeight) {

			leftSpeedOfBall *= -1;
			bounce.play();
		} else {			
			lost.play();
			score2 ++;
			startBall();
			document.getElementById("score2").innerHTML = score2;
		}//else
		
	}//if
	
	if(leftPositionOfBall >= gameboardWidth - paddleWidth - ballHeight) {
		
		if(topPositionOfBall > positionOfPaddle2 && topPositionOfBall < positionOfPaddle2 + paddleHeight) {
			leftSpeedOfBall *= -1;
			bounce.play();
		} else {			
			lost.play();
			score1 ++;
			startBall();
			document.getElementById("score1").innerHTML = score1;
		}//else
	}//
	
	document.getElementById("paddle1").style.top = positionOfPaddle1 + "px";
	document.getElementById("paddle2").style.top = positionOfPaddle2 + "px";
	document.getElementById("ball").style.top = topPositionOfBall + "px";
	document.getElementById("ball").style.left = leftPositionOfBall + "px";
	if (score1 >= totalScore || score2 >= totalScore){
		stopGame();
	}
}	//show


function resumeGame() {
	if(!controlPlay) {
	controlPlay = window.setInterval(show, 1000/60 );
	}//if
}//resumeGame


function pauseGame () {
	if (!gameEnded) {
		window.clearInterval(controlPlay);
		controlPlay = false;
	}
	
}

function startGame() {
	score1 = 0;
	score2 = 0;
	document.getElementById("score1").innerHTML = score1;
	document.getElementById("score2").innerHTML = score2;
	positionOfPaddle1 = startPositionOfPaddle1;
	positionOfPaddle2 = startPositionOfPaddle2;
	startBall();
	if(!controlPlay) {
	controlPlay = window.setInterval(show, 1000/60 );
	}//if
}


function stopGame () {
	window.clearInterval(controlPlay);
	controlPlay = true;
	if (!gameEnded){
	
		let message1 = "Tie Game";
		let message2 = "Close to continue";
		
		if(score2 > score1) {
			message1 = "Player 2 Wins with " + score2 + " points!" ;
			message2 = "Player 1 had " + score1 + " points!";
		}else if(score2 < score1) {
			message1 = "Player 1 Wins with " + score1 + " points!" ;
			message2 = "Player 2 had " + score2 + " points!";
		}//else
		
		showLightBox(message1, message2);
	}
	gameEnded = true;
}//stop

//change the visibility of the divId
function changeVisibility(divId) {
	
	let elem = document.getElementById(divId);
	
	//if element exists, it is considered true
	if (elem) {
		elem.className = (elem.className == 'hidden') ? 'unidden' : 'hidden';
		
	}//if
	
}//changeVisibilty

//display message in lightbox
function showLightBox(message, message2) {
	
	//set the messages
	document.getElementById("message").innerHTML = message;
	document.getElementById("message2").innerHTML = message2;
	
	//show lightbox
	changeVisibility("lightbox");
	changeVisibility("boundryMessage");
	//changeVisibility("controlpanel");
	
}

//clos light box 
function continueGame() {
	changeVisibility("lightbox");
	changeVisibility("boundryMessage");
	gameEnded = false;
	controlPlay = false;
}//continueGame










