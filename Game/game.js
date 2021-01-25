const levels = [	
	//LEVEL 0
	["flag", "gonkDown", "", "animate", "", "gonkDown", "", "", "", "",
	 "bomb", "gonkDown", "", "animate", "saber", "", "", "", "", "",
	 "", "post", "animate", "animate", "animate","animate","animate","animate","animate","animate",
	 "", "pit", "", "animate", "","","","","","",
	 "", "bomb", "", "animate", "", "jediUp", "", "", "", ""],
	 
	 //LEVEL 1
	 ["flag", "post", "", "", "saber", "animate", "", "", "", "",
	  "bomb", "pit", "", "", "", "animate", "", "", "", "",
	  "animate", "animate bridge", "animate", "animate", "animate", "animate", "animate", "animate", "animate", "animate", 
	  "", "pit", "", "", "",  "animate", "", "", "", "",
	  "gonkDown", "pit", "jediUp", "", "", "animate", "", "", "", ""],
	  
	  //LEVEL 2
	   ["post", "post", "post", "post", "flag", "animate", "", "", "", "",
	   "animate", "animate", "animate", "animate", "animate", "animate", "animate", "animate", "animate", "animate",
	   "pit", "bridge", "pit", "pit", "pit",  "animate", "", "", "", "",
	   "", "", "", "bomb", "",  "animate", "", "", "", "",
	   "saber", "gonkDown", "", "", "jediUp", "animate", "", "", "", ""]
	];  //end of levels

var currentLevel = 0;
var saberOn = false;
var jumping = false;
var currentLocationOfJedi = 0;
var currentLocationOfEnemy = 0;
var currentAnimation;
var enemyAnimation;
var jumpAnimation;
var widthOfBoard = 10;
var heightOfBoard = 5;
var gridBoxes;// = document.querySelectorAll("#gameBoard div")
const noPassObstacles = ["gonkDown", "post", "pit"];

window.addEventListener("load", function () {
	gridBoxes = document.querySelectorAll("#gameBoard div")
	loadLevel();
});

document.addEventListener("keydown", function (e) {
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
	}//switch
	
}); //key event listener

function tryToMove(direction) {
	
	let orgLocation = currentLocationOfJedi;
	let orgClassName = gridBoxes[orgLocation].className;
	let destLocation = orgLocation;
	let destClassName = orgClassName;
	let newDestClassName = "";

	let jumpLocation = 0;
	let jumpClassName = "";
	let orgJumpClassName = "";
	
	switch (direction) {
		case "Up":
			if (currentLocationOfJedi >= widthOfBoard) {
				//console.log("move up");
				destLocation = currentLocationOfJedi - widthOfBoard;
			}//if
		break;
		case "Down":
			if (currentLocationOfJedi < (widthOfBoard * heightOfBoard) - widthOfBoard) {
				//console.log("move down");
				destLocation = currentLocationOfJedi + widthOfBoard;
			}//if
		break;
		case "Left":
			if (currentLocationOfJedi % widthOfBoard !== 0) {
				//console.log("move left");
				destLocation = currentLocationOfJedi - 1;
			}//if
		break;
		case "Right":
			if ((currentLocationOfJedi + 1) % widthOfBoard !== 0) {
				//console.log("move right");
				destLocation = currentLocationOfJedi + 1;
			}//if
		break;
	}//switch
	
	if (orgLocation !== destLocation){ // we are moving
		destClassName = gridBoxes[destLocation].className;
		
		if (jumping) {return;}
		
		if(noPassObstacles.includes(destClassName)) {return;}
		
		if(!saberOn && destClassName.includes("bomb")) {return;}
		
		if(destClassName.includes("bomb") && saberOn ) { //jump
			//console.log("Jumping " + destClassName);
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
			
			if (noPassObstacles.includes(gridBoxes[destLocation].className)){// cannot jump
				//jumpLocation = orgLocation;
				destLocation = orgLocation;
				destClassName = orgClassName;
				return;
			}
            if (gridBoxes[currentLocationOfJedi].classList.contains("animate")) {
                gridBoxes[currentLocationOfJedi].className = "animate"; // clear start but leave animate
            } else {
			    gridBoxes[currentLocationOfJedi].className = ""; // clear start
            }
            if (gridBoxes[currentLocationOfJedi].classList.contains("bridge")) {
                gridBoxes[currentLocationOfJedi].className = "bridge"; // clear start but leave animate
            } else {
			    gridBoxes[currentLocationOfJedi].className = ""; // clear start
            }

			gridBoxes[jumpLocation].classList.add("jump");
			//gridBoxes[destLocation].className = destClassName;
			//clearTimeout(currentAnimation);
			jumping = true;
			jumpAnimation = setTimeout(function() {
				gridBoxes[jumpLocation].className = orgJumpClassName;
				currentLocationOfJedi = destLocation;
				if (gridBoxes[currentLocationOfJedi].className.includes("flag")){
					//gridBoxes[currentLocationOfJedi].classList.add(destClassName);
					levelUp(gridBoxes[currentLocationOfJedi].className);
				} else {
					gridBoxes[currentLocationOfJedi].className = destClassName;
				}
				jumping = false;
				//levelUp(destClassName);
				
			}, 350);
			return;
	
		}//if jump

        if (destClassName.includes("saber")) {
			saberOn = true;
		}//if

        // fix old location
		gridBoxes[orgLocation].className = "";
        if (orgClassName.includes("bridge")) gridBoxes[orgLocation].classList.add("bridge");
        if (orgClassName.includes("animate")) gridBoxes[orgLocation].classList.add("animate");
        if (orgClassName.includes("flag")) gridBoxes[orgLocation].classList.add("flag");

        // set new location
        newDestClassName = "jedi";
		newDestClassName += direction;
        if (saberOn) {newDestClassName += "Saber"}

        // move
		currentLocationOfJedi = destLocation;
		gridBoxes[currentLocationOfJedi].classList.add(newDestClassName);
    
        // check win or lose
		if(gridBoxes[currentLocationOfJedi].classList.contains("trooper")) {
			document.getElementById("lose").style.display = "block";
			console.log("Game Lost");
			return;		
		}//if
		if (gridBoxes[currentLocationOfJedi].classList.contains("flag")){
			//gridBoxes[currentLocationOfJedi].classList.add(destClassName);
			levelUp(gridBoxes[currentLocationOfJedi].className);
		}
	} else {
		console.log("Cannot move " + direction);
	}//else
}//tryToMove

function levelUp(destClassName) {
	if (destClassName.indexOf("flag") >= 0 && saberOn) {
		document.getElementById("levelUp").style.display = "block";
		clearTimeout(currentAnimation);
		clearTimeout(enemyAnimation);
		setTimeout (function() {
            if (currentLevel == 2) {
			    document.getElementById("levelUp").style.display = "none";
    			document.getElementById("win").style.display = "block";
	    		console.log("Game WON");
		    	return;
               
            } else {
			    currentLevel++;
			    loadLevel();
			    document.getElementById("levelUp").style.display = "none";
            }
		}, 1000);
			
	}
}//level up


function loadLevel() {
	let levelMap = levels[currentLevel];
	let foundLocation = false;
	saberOn = false;
	for(i = 0; i < gridBoxes.length; i++) {
		gridBoxes[i].className = levelMap[i];
		if (levelMap[i].includes("jedi")){ currentLocationOfJedi = i};
	}//for
//	console.log(currentLocationOfJedi);
	animateBoxes = document.querySelectorAll(".animate");
	for(i = 0; i < gridBoxes.length && foundLocation !== true; i++) {
		if (gridBoxes[i].className.includes("animate")){ currentLocationOfEnemy = i;foundLocation = true;};
	}//for
	animateEnemy(currentLocationOfEnemy, "right", false);
}	//loadLevel 

function animateEnemy(index, direction, force) {
var enemyClassName = gridBoxes[index].className;
var jediDirection = "";
var tryMove = "";

    if (force !== true) {
        if (currentLocationOfJedi - index > 0 && currentLocationOfJedi - index < widthOfBoard) {
            jediDirection = "right";
            if (currentLocationOfJedi < (0.5 * widthOfBoard * heightOfBoard)) {
                tryMove = "down";
            } else {
                tryMove = "up";
            }
        } else if (currentLocationOfJedi - index > 0 && currentLocationOfJedi - index >= widthOfBoard) {
            jediDirection = "down";
            if ((currentLocationOfJedi - index) % widthOfBoard > (0.5 * widthOfBoard)) {
                tryMove = "left";
            } else {
                tryMove = "right";
            }
        } else if (index - currentLocationOfJedi > 0 && index - currentLocationOfJedi < widthOfBoard) {
            jediDirection = "left";
            if (currentLocationOfJedi < (0.5 * widthOfBoard * heightOfBoard)) {
                tryMove = "down";
            } else {
                tryMove = "up";
            }
        } else {
            jediDirection = "up";
            if ((currentLocationOfJedi - index) % widthOfBoard > (0.5 * widthOfBoard)) {
                tryMove = "left";
            } else {
                tryMove = "right";
            }
        }
    } else {
        jediDirection = direction;
    }
    direction = jediDirection;
    console.log(jediDirection + '-' + tryMove);
	switch (direction) {
        case "up":
            // try up first
            if (index >= widthOfBoard) {
                //console.log("move up");
                destLocation = index - widthOfBoard;
            }
		break;
		case "down":
			if (index < (widthOfBoard * heightOfBoard) - widthOfBoard) {
				//console.log("move down");
				destLocation = index + widthOfBoard;
			}
		break;
		case "left":
			if (index % widthOfBoard !== 0) {
				//console.log("move left");
				destLocation = index - 1;
			}//if
		break;
		case "right":
			if ((index + 1) % widthOfBoard !== 0) {
				//console.log("move right");
				destLocation = index + 1;
			}
		break;
	}//switch
	if (index != destLocation && gridBoxes[destLocation].className.includes("animate")){
        // move
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
			console.log("Game Lost");
			return;
		}//if

        // move, faster each level
		enemyAnimation = setTimeout(function() {
			animateEnemy(currentLocationOfEnemy, direction, false);
		}, (750 - currentLevel * 200));


	} else {
		// try different direction
		enemyAnimation = setTimeout(function() {
			animateEnemy(currentLocationOfEnemy, tryMove, true);
		}, 0);

	}
	

}//animate enemy
