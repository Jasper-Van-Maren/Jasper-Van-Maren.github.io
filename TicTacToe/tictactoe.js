let currentPlayer = "X";
let gameStatus = ""; // - continue, "tie", 
let numTurns = 0;
let idNames = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"]; 


// rest board and all variables
function newGame() {
	
	for (var i = 0; i < idNames.length; i++) {
		document.getElementById(idNames[i]).innerHTML = "";
		
	}//for
	
	numTurns = 0;
	gameStatus = "";
	currentPlayer = "X";
	
	changeVisibility("controls");
	
}//new game

//randomly chooses a free box for computer
function computerTakeTurn() {
	let idName = "";
	
	//generate random numTurn
	do {
		let rand = parseInt(Math.random()*9) + 1;
		idName = idNames[rand-1];
		
		//check if empty
		if(document.getElementById(idName).innerHTML == "") {
			document.getElementById(idName).innerHTML = currentPlayer;
			break;
		}//if
		
	} while(true);
}// computer take turn


// take player turn
function playerTakeTurn(e) {
	
	if (e.innerHTML == "") {
		e.innerHTML = currentPlayer;
		checkGameStatus();
		
		// if agem not iver cumputer goes
		if (gameStatus == "") {
			setTimeout(function() {
					computerTakeTurn();
					checkGameStatus();
				}, 500
			);
		}//if
		
		
		
		
	}else {
		showLightBox("This box is already selected.", "Please try another.");
		
		return;
	}//else
		
	
	
}//player take turn


//after each turn, check for a winner, a tie
// or continue play
function checkGameStatus() {
	numTurns++;
	
	//check win
	if (checkWin()) {
		gameStatus = currentPlayer + " Wins!";
		
	}
	
	//chec for tie
	if (numTurns == 9) {
		gameStatus = "Tie Game";
		
	}//numTurns
		
	//switch current player
	currentPlayer = (currentPlayer == "X" ? "O" : "X");
	
	//game is over	
	if(gameStatus != "") {
		setTimeout(function() { showLightBox(gameStatus, "Game Over.");}, 500);
		
	}
	
} //check game status

//check for a win, there 8 win paths
function checkWin () {
	let cb = []; // current board
	cb[0] = "";
	cb[1] = document.getElementById("one").innerHTML;
	cb[2] = document.getElementById("two").innerHTML;
	cb[3] = document.getElementById("three").innerHTML;
	cb[4] = document.getElementById("four").innerHTML;
	cb[5] = document.getElementById("five").innerHTML;
	cb[6] = document.getElementById("six").innerHTML;
	cb[7] = document.getElementById("seven").innerHTML;
	cb[8] = document.getElementById("eight").innerHTML;
	cb[9] = document.getElementById("nine").innerHTML;
	
	//top row
	if (cb[1] != "" && cb[1] == cb[2] && cb[2] == cb[3]) {
		return true;
	}
	else if (cb[4] != "" && cb[4] == cb[5] && cb[5] == cb[6]) {
		return true;
	}
	else if (cb[7] != "" && cb[7] == cb[8] && cb[8] == cb[9]) {
		return true;
	}
	else if (cb[1] != "" && cb[1] == cb[4] && cb[4] == cb[7]) {
		return true;
	}
	else if (cb[2] != "" && cb[2] == cb[5] && cb[5] == cb[8]) {
		return true;
	}
	else if (cb[3] != "" && cb[3] == cb[6] && cb[6] == cb[9]) {
		return true;
	}
	else if (cb[1] != "" && cb[1] == cb[5] && cb[5] == cb[9]) {
		return true;
	}
	else if (cb[3] != "" && cb[3] == cb[5] && cb[5] == cb[7]) {
		return true;
	} else {
		return false;
	}
}//check win

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
	
}

//clos light box 
function continueGame() {
	changeVisibility("lightbox");
	changeVisibility("boundryMessage");
	
	if (gameStatus != "") {
		changeVisibility("controls");
		
	}
	
}//continueGame






