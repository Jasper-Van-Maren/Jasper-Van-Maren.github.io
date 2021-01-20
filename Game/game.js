const levels = [	
	//LEVEL 0
	["flag", "gonkDown", "", "", "", 
	 "table", "gonkDown", "", "", "Saber", 
	 "", "post", "animate", "animate", "animate",
	 "", "pit", "", "", "",
	 "", "tableSide", "", "jediUp", ""],
	 
	 //LEVEL 1
	 ["flag", "post", "", "", "Saber",
	  "table", "pit", "", "", "",
	  "animate", "bridge animate", "animate", "animate", "animate", 
	  "", "pit", "", "", "", 
	  "gonkDown", "pit", "jediUp", "", ""],
	  
	  //LEVEL 2
	   ["post", "post", "post", "post", "fag",
	   "animate", "animate", "animate", "animate", "animate",
	   "pit", "bridge", "pit", "pit", "pit", 
	   "", "", "", "table", "", 
	   "saber", "gonkDown", "", "", "jediUp"]
	];  //end of levels

var currentLevel = 0;
var SaberOn = false;
var currentLocatinOfJedi = 0;
var currentAnimation;
const gridBoxes = document.querySelectorAll("#gameBoard div")

window.addEventListener("load", function () {
	loadLevel();
});

function loadLevel() {
	let levelMap = levels[currentLevel];
	let animateBoxes;
	SaberOn = false;
	
	for(i = 0; i < gridBoxes.length; i++) {
		gridBoxes[i].className = levelMap[i];
		if (levelMap[i].includes("jedi")) currentLocationofJedi = i;
	}//for
	
	animateBoxes = document.querySelectorAll(".animate")
	
	animateEnemy(animateBoxes, 0, "right");
}	//loadLevel 

function animateEnemy(boxes, index, direction) {
	
	if (boxes.length <= 0) {return; }
	
	if (direction == "right") {
		boxes[index].classList.add("trooperRight");
	}else {
		boxes[index].classList.add("trooperLeft");
	}//else
		
	for (i = 0; i < boxes.length; i++) {
		if (i != index) {
			boxes[i].classList.remove("trooperRight");
			boxes[i].classList.remove("trooperLeft");
		}//if
	}//for
	
	if (direction == "right") {
		if (index == boxes.length -1) {
			index--;
			direction = "left";
		} else {
			index++;
		}//else
	} else {
		if (index == 0) {
			index++;
			direction = "right";
		}else {
			index--;
		}//else
	}//else
		
	current = setTimeout(function() {
		animateEnemy(boxes, index, direction)
	}, 750);
}//animate enmy
 	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 