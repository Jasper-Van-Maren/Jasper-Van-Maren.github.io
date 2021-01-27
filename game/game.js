const levels = [	
	//LEVEL 0
	["yoda1", "gonkDown", "", "animate", "saber", "gonkDown", "", "", "post", "",
	 "bomb", "gonkDown", "", "animate", "animate", "", "", "post", "", "pit",
	 "", "post", "animate", "animate", "animate","animate","animate","animate","animate","animate",
	 "", "pit", "", "animate", "","animate","","gonkDown","","",
	 "", "bomb", "", "animate", "gonkDown", "animate jediUp", "", "", "", ""],
	 
	 //LEVEL 1
	 ["yoda2", "post", "", "", "", "animate", "gonkDown", "saber", "", "",
	  "bomb", "pit", "", "gonkDown", "", "animate", "", "gonkDown", "", "",
	  "animate", "animate bridge", "animate", "animate", "animate", "animate", "animate", "animate", "animate", "animate", 
	  "", "pit", "animate", "", "",  "animate", "post", "", "", "",
	  "gonkDown", "pit", "animate jediUp", "", "post", "animate", "", "", "post", ""],
	  
	  //LEVEL 2
	   ["post", "gonkDown", "gonkDown", "post", "post", "post", "yoda3", "gonkDown", "gonkDown", "post",
	   "animate", "animate", "animate", "animate", "animate", "animate", "animate", "animate", "animate", "animate",
	   "post", "gonkDown", "gonkDown", "post", "animate",  "pit", "pit", "pit", "bridge", "pit",
	   "", "", "", "bomb", "animate",  "", "", "bomb", "", "",
	   "saber", "gonkDown", "", "", "animate", "gonkDown", "jediUp", "bomb", "", ""]
	];  //end of levels

var currentLevel = 0;
var saberOn = false;
var jumping = false;
var currentLocationOfJedi = 0;
var currentLocationOfEnemy = 0;
var prevMove = "";
var gameOver = false;
var gameStarted = false;
var gameEnded = false;
var currentAnimation;
var enemyAnimation;
var jumpAnimation;
var widthOfBoard = 10;
var heightOfBoard = 5;
var gridBoxes;
const noPassObstacles = ["gonkDown", "post", "pit"];

// on load
window.addEventListener("load", function () {
    // load the gameBoard
	gridBoxes = document.querySelectorAll("#gameBoard div");
	loadLevel();
});

// on key press
document.addEventListener("keydown", function (e) {

    // if game starts hide opening screen
    if (gameStarted != true) {
        gameStarted = true;
        document.getElementById("openingScreen").style.display = "none";
        document.getElementById("gameBoard").style.display = "";
    	animateEnemy(currentLocationOfEnemy, "right", false);
    }
    // play sound on key press otherwise we get error
    if (gameStarted == true && gameOver != true && gameEnded != true && e.keyCode != 32) theme.play();

    // check which key is pressed
	switch (e.keyCode) {
		case 87: //up
			tryToMove("Up");
		break;
		case 83: //down
			tryToMove("Down");
		break;
		case 65: //left
			tryToMove("Left");
		break;
		case 68: //right
			tryToMove("Right");
		break;
        case 32: // space bar: restart game if ended
            if (gameOver == true && gameEnded != true) {
                setTimeout(function () {
                    currentLevel = 0;
                    gameOver = false;
                    document.getElementById("lose").style.display = "";
		            clearTimeout(currentAnimation);
		            clearTimeout(enemyAnimation);
                    theme.reload();
                    loadLevel();
                }, 1000);
           
            }

        break;
	}//switch
	
}); //key event listener

// move player if possible
function tryToMove(direction) {
	
	let orgLocation = currentLocationOfJedi;
	let orgClassName = gridBoxes[orgLocation].className;
	let destLocation = orgLocation;
	let destClassName = orgClassName;
	let newDestClassName = "";

	let jumpLocation = 0;
	let jumpClassName = "";
	let orgJumpClassName = "";
	
    // see if we can move
	switch (direction) {
		case "Up":
			if (currentLocationOfJedi >= widthOfBoard) {
				destLocation = currentLocationOfJedi - widthOfBoard;
			}//if
		break;
		case "Down":
			if (currentLocationOfJedi < (widthOfBoard * heightOfBoard) - widthOfBoard) {
				destLocation = currentLocationOfJedi + widthOfBoard;
			}//if
		break;
		case "Left":
			if (currentLocationOfJedi % widthOfBoard !== 0) {
				destLocation = currentLocationOfJedi - 1;
			}//if
		break;
		case "Right":
			if ((currentLocationOfJedi + 1) % widthOfBoard !== 0) {
				destLocation = currentLocationOfJedi + 1;
			}//if
		break;
	}//switch
	
	if (orgLocation !== destLocation){ // we are moving
		// see where we are going    
        destClassName = gridBoxes[destLocation].className;
		
        // do not move while jumping
		if (jumping) {return;}
		
        // do not move if there is an obstacle
		if(noPassObstacles.includes(destClassName)) {return;}
		
        // do not move if there is a bomb and we do not have a saber
		if(!saberOn && destClassName.includes("bomb")) {return;}
		
        // jump if there is a bomb and we have a saber
		if(destClassName.includes("bomb") && saberOn ) {
			jumpLocation = destLocation;
			orgJumpClassName = destClassName; // save original jump class
			
			if(direction == "Left") {
				destClassName = "jediLeftSaber";
				destLocation = destLocation - 1;
 			} else if (direction == "Right") {
				destClassName = "jediRightSaber";
				destLocation = destLocation + 1;
			}  else if (direction == "Up") {
				destClassName = "jediUpSaber";
				destLocation = destLocation - widthOfBoard;
			}  else if (direction == "Down") {
				destClassName = "jediDownSaber";
				destLocation = destLocation + widthOfBoard;
			}//if
			
            // do not jump if on the other side is an obstacle
			if (noPassObstacles.includes(gridBoxes[destLocation].className)){// cannot jump
				destLocation = orgLocation;
				destClassName = orgClassName;
				return;
			}
            // fix old location
            gridBoxes[orgLocation].className = "";
            if (orgClassName.includes("bridge")) gridBoxes[orgLocation].classList.add("bridge");
            if (orgClassName.includes("animate")) gridBoxes[orgLocation].classList.add("animate");
			
            // set jump location
            gridBoxes[jumpLocation].classList.add("jump");
			jumping = true;

            //jump
			jumpAnimation = setTimeout(function() {
                // fix jump location
				gridBoxes[jumpLocation].className = orgJumpClassName;
                // move
				currentLocationOfJedi = destLocation;
                // see if we found yoda, then level up
				if (gridBoxes[currentLocationOfJedi].className.includes("yoda")){
					levelUp(gridBoxes[currentLocationOfJedi].className);
				} else {
					gridBoxes[currentLocationOfJedi].classList.add(destClassName);
				}
				jumping = false;
				
			}, 350);
			return;
	
		}//if jump

        // we found the light saber
        if (destClassName.includes("saber")) {
			saberOn = true;
		}//if

        // fix old location
		gridBoxes[orgLocation].className = "";
        if (orgClassName.includes("bridge")) gridBoxes[orgLocation].classList.add("bridge");
        if (orgClassName.includes("animate")) gridBoxes[orgLocation].classList.add("animate");

        // set new location
        newDestClassName = "jedi";
		newDestClassName += direction;
        if (saberOn) {newDestClassName += "Saber"}

        // move
		currentLocationOfJedi = destLocation;
		gridBoxes[currentLocationOfJedi].classList.add(newDestClassName);
    
        // check win or lose
		if(gridBoxes[currentLocationOfJedi].className.includes("trooper")) {
			document.getElementById("lose").style.display = "block";
            theme.stop();
            roar.play();
            gameOver = true;
			return;		
		}//if

        // see if we found yoda, then level up
		if (gridBoxes[currentLocationOfJedi].className.includes("yoda")){
			levelUp(gridBoxes[currentLocationOfJedi].className);
		}
	} 
}//tryToMove

// move up to the next level
function levelUp(destClassName) {
    if (destClassName.indexOf("yoda") >= 0 && saberOn) {
        // show win or level up message
        if (currentLevel == 2) { // end of the game
            gameOver = true;
            gameEnded = true;
            win.play();
   			document.getElementById("win").style.display = "block";
        } else {
            force.play();
		    document.getElementById("levelUp").style.display = "block";
        }
        // stop animation and sound
		clearTimeout(currentAnimation);
		clearTimeout(enemyAnimation);
        theme.stop();

        // go to the next level
		setTimeout (function() {
            if (currentLevel == 2) { // end of the game
			    document.getElementById("win").style.display = "none";
                end.play();
                // hide gameBoard and show closingScreen
    			document.getElementById("gameBoard").style.display = "none";
    			document.getElementById("closingScreen").style.display = "";
                return;              
            } else {
			    currentLevel++;
			    loadLevel();
			    document.getElementById("levelUp").style.display = "none";
            }
		}, 4000);
			
	}
}//level up

// load the level
function loadLevel() {
	let levelMap = levels[currentLevel];
	let foundLocation = false;
	saberOn = false;
    // load the level and find a location for the jedi
	for(i = 0; i < gridBoxes.length; i++) {
		gridBoxes[i].className = levelMap[i];
		if (levelMap[i].includes("jedi")){ currentLocationOfJedi = i};
	}//for
    // find a location for the enemy
	for(i = 0; i < gridBoxes.length && foundLocation != true; i++) {
		if (gridBoxes[i].className.includes("animate")){ currentLocationOfEnemy = i; foundLocation = true;};
	}//for
	animateEnemy(currentLocationOfEnemy, "right", false);
}//loadLevel 

// move the enemy towards the jedi
function animateEnemy(index, direction, force) {
var enemyClassName;
var jediDirection = "";
var altMove = "";
var horDifference = (index % widthOfBoard) - (currentLocationOfJedi % widthOfBoard); // horizontal difference between enemy and jedi
var verDifference = Math.floor((index - currentLocationOfJedi) / widthOfBoard); // vertical difference between enemy and jedi
var speed = currentLevel * 200; // speed at which enemy moves, faster each level

    if (gameStarted == true && gameOver != true) {
        // we are in the game
        enemyClassName = gridBoxes[index].className;
        if (force !== true) { // enemy can move on it's own
            // enemy follows jedi
            if (verDifference == 0) { // enemy and jedi are in the same row
                if (horDifference < 0) { // jedi is to the right
                    jediDirection = "right";
                } else { // jedi is to the left
                    jediDirection = "left";
                }
                // if we can't move try altMove but it has to be different from the previous move so that enemy does not get stuck
                if (prevMove == "up") {
                    altMove = "down";
                } else {
                    altMove = "up";
                }

            } else if (horDifference == 0) { // enemy and jedi are in the same column
                if (verDifference > 0) { // jedi is up
                    jediDirection = "up"; 
                } else { // jedi is down
                    jediDirection = "down";
                }
                // if we can't move try altMove but it has to be different from the previous move so that enemy does not get stuck
                if (prevMove == "left") {
                    altMove = "right";
                } else {
                    altMove = "left";
                }
            } else if (Math.abs(horDifference) > Math.abs(verDifference)) { // left/right is closer
                if (horDifference < 0) { // jedi is to the right
                    jediDirection = "right";
                } else { // jedi is to the left
                    jediDirection = "left";
                }
                // if we can't move try altMove
                if (verDifference > 0) {
                    altMove = "up";
                } else {
                    altMove = "down";
                }
            } else { // up/down is closer
                if (verDifference > 0) { // jedi is up
                    jediDirection = "up";
                } else { // jedi is down
                    jediDirection = "down";
                }
                // if we can't move try altMove
                if (horDifference < 0) {
                    altMove = "right";
                } else {
                    altMove = "left";
                }
            }

        } else { // follow direction
            jediDirection = direction;
		    switch (jediDirection) {
			    case "up":
				    altMove = "right";
				    break;
			    case "down":
				    altMove = "left";
				    break;
			    case "left":
				    altMove = "up";
				    break;
			    case "right":
				    altMove = "down";
				    break;
		    }//switch

        }
        direction = jediDirection;
        prevMove = altMove; 
        // try to move in direction
	    switch (direction) {
            case "up":
                if (index >= widthOfBoard) {
                    destLocation = index - widthOfBoard;
                }
		    break;
		    case "down":
			    if (index < (widthOfBoard * heightOfBoard) - widthOfBoard) {
				    destLocation = index + widthOfBoard;
			    }
		    break;
		    case "left":
			    if (index % widthOfBoard !== 0) {
				    destLocation = index - 1;
			    }//if
		    break;
		    case "right":
			    if ((index + 1) % widthOfBoard !== 0) {
				    destLocation = index + 1;
			    }
		    break;
	    }//switch

	    if (index != destLocation && gridBoxes[destLocation].className.includes("animate")){
            // we can move
            currentLocationOfEnemy = destLocation;

            // fix old location
		    gridBoxes[index].classList.remove("trooperLeft");
		    gridBoxes[index].classList.remove("trooperRight");

            // set new location
		    if (direction == "right" || direction == "down") {
			    gridBoxes[currentLocationOfEnemy].classList.add("trooperRight");
		    }else {
			    gridBoxes[currentLocationOfEnemy].classList.add("trooperLeft");
		    }//if
		
            // check lose
            if(gridBoxes[currentLocationOfEnemy].className.includes("jedi")) {
			    document.getElementById("lose").style.display = "block";
                theme.stop();
                roar.play();
                gameOver = true;
			    return;
		    }//if

            // move, faster each level
		    enemyAnimation = setTimeout(function() {
			    animateEnemy(currentLocationOfEnemy, direction, false);
		    }, 750 - speed);


	    } else {
		    // try differen direction
		    enemyAnimation = setTimeout(function() {
			    animateEnemy(currentLocationOfEnemy, altMove, true);
		    }, 0);

	    }
    } // if 	

}//animate enemy

// load and use sounds
function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.play();
  };
  this.stop = function(){
    this.sound.pause();
  };
    this.reload = function () {
    this.sound.load();
 };
}
// sound