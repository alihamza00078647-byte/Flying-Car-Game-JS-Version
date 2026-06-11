// Select Game Components in JS
const jumpsBoard = document.querySelector('.jump-box');
const scoreboard = document.querySelector('.score-box');
const levelUpBoard = document.querySelector('.level-box');
const car = document.querySelector('.car');
const coin = document.querySelector(".coin");
const mainGameArea = document.querySelector(".middle-Area");
const RestartGameBtn = document.querySelector('.play-again');
const changeVolume = document.querySelector('#volume-range')
const timeCount = document.querySelector('.time-from-start');


// Select Road Line Movements through JS.
const roadLines = document.querySelectorAll('.lines');
const line1 = document.querySelectorAll('.line1');
const line2 = document.querySelectorAll('.line2');
const line3 = document.querySelectorAll('.line3');
const line4 = document.querySelectorAll('.line4');




// Selecting Cars images & Given Car Names According To Colors.
const aqua = document.querySelector('.aqua');
const blue = document.querySelector('.blue');
const purple = document.querySelector('.purple');
const red = document.querySelector('.red');
const yellow = document.querySelector('.yellow');
const formula = document.querySelector('.formula');
const vehicles = document.querySelectorAll('.vehicle');


// Audio Sound 
const gameOver = new Audio("./Cars/mixkit-sad-game-over-trombone-471.wav");
const GameStartMusic = new Audio("./Cars/Background_Sound.mp3");
const coinSound = new Audio('./Cars/coin Sound.wav');
const accident = new Audio("./Cars/Accident Car.wav");



// Array According To Indexes
const positionArrayOfCoin = [30, 170, 290, 410, 520];



// Variables for Games
// Car's x, y, z axis.
let x = 0, y = 0, z = 0;

// let speedAccelerator = 2;
let speed = 100;
let userScore = 0;
let coinPositionIndex = 0;
let jumpCarScores = 1;
let levelUpOnEachStep = 5;
let levelStage = 1;
let formulaCarLaneIndex = 0;
let stopAnimationFrameOnCollision = true;
// Initial Time Start variable and increment time variable
let startTime = Date.now();
let incrementTimeOnEachfuncCall = 1;
// Detect Collision.
let animatedId;



// Position at Y-axis By Variables. 
let aquafirst = -290;
let secondBlue = -545;
let thirdPurple = -220;
let fourthRed = -500;
let yellowTaxi = -340;
let formulaSpeed = -200;
let moveCoinY = 0;


// RoadLines 
let roadLine1 = 0;
let roadLine2 = 0;
let roadLine3 = 0;
let roadLine4 = 0;




// Main car Move Listener
document.addEventListener('keydown', driveMainCar);
// Main Car Move Logic
function driveMainCar(event) {
    // Start Music on Arrow Key
    GameStartMusic.play();
    
    if (event.key === 'ArrowUp') {
        if (y >= 450) {
            y = 450;
            return;
        }
        y += 10;
        car.style.setProperty('--y', `-${y}px`);
    }

    if (event.key === 'ArrowDown') {
        if (y === 0) {
            y = 0;
            return;
        }
        y -= 10;
        car.style.setProperty('--y', `-${y}px`);
    }

    if (event.key === "ArrowRight") {

        if (x <= 520) {      // 490 used due to x += 10 increment later 
            x += 10;
            car.style.setProperty('--x', `${x}px`);
        }
    }

    if (event.key === "ArrowLeft") {
        if (x > 10) {
            x -= 10;
            car.style.setProperty('--x', `${x}px`);
        }
    }
}



// y-axis limit on Jump 
function AxisLimitAtJump() {
    // forward limit
    if (y >= 450) {
        y = 450;
        return
    }
}


// Fire Only when button Release
document.addEventListener('keyup', jumpOnClick);
function jumpOnClick(event) {       // Trigger On Space
    if (event.code === 'Space') {
        if (jumpCarScores >= 1) {        // Limit on Jumps 
            // Skip Collision ON Jump
            cancelAnimationFrame(animatedId);
            car.src = "./FLy Car.png";
            y += 350;
            z += 80;
            jumpCarScores--;
            AxisLimitAtJump();
            car.style.setProperty('--y', `-${y}px`);
            car.style.setProperty('--z', `${z}px`);
            setTimeout(() => {
                z = 0;
                car.style.setProperty('--z', `${z}px`);
                car.src = "./car.png";
                // Again Track Position for Collision 
                trackPosition();
            }, 400);
        }
    }
}



// Move the vehicles on function Call
function moveVehicles() {
    aquafirst += 10;
    secondBlue += 10;
    thirdPurple += 10;
    fourthRed += 10;
    yellowTaxi += 10;
    moveCoinY += 10;


    aqua.style.setProperty('--aquacarY', `${aquafirst}px`);
    blue.style.setProperty('--bluecarY', `${secondBlue}px`);
    purple.style.setProperty('--purplecarY', `${thirdPurple}px`);
    red.style.setProperty('--redcarY', `${fourthRed}px`);
    yellow.style.setProperty('--yellowcarY', `${yellowTaxi}px`);
    coin.style.setProperty('--coinPositionY', `${moveCoinY}px`);


    reverseCarsAtBoundary();
    gainScoresByCoins();
    // Calculate the time of start Game function.
    gameStartAtTime();
}



function reverseCarsAtBoundary() {
    // set Boundaries on Each Car

    if (aquafirst >= 600) {
        aquafirst = -290;
        aqua.classList.add("hid-cars");
        // Remove Reverse Car Glitch.
        setTimeout(() => aqua.classList.remove("hid-cars"), 500);
    }
    if (secondBlue >= 700) {
        secondBlue = -230;
        blue.classList.add("hid-cars");
        setTimeout(() => blue.classList.remove("hid-cars"), 500);
    }

    if (thirdPurple >= 850) {
        thirdPurple = -260;
        purple.classList.add("hid-cars");
        setTimeout(() => purple.classList.remove("hid-cars"), 500);
    }
    if (fourthRed >= 800) {
        fourthRed = -380;
        red.classList.add("hid-cars");
        setTimeout(() => red.classList.remove("hid-cars"), 500);
    }
    if (yellowTaxi >= 900) {
        yellowTaxi = -410;
        yellow.classList.add("hid-cars");
        setTimeout(() => yellow.classList.remove("hid-cars"), 500);
    }
    // Move coin in line 
    if (moveCoinY >= 700) {
        moveCoinY = -300;
        coin.classList.add("hid-cars");
        setTimeout(() => coin.classList.remove("hid-cars"), 500);
    }
}



// Given an ID To Interval Variable for Remove Interval.
const moveVehiclesInterval = setInterval(moveVehicles, speed);



function trackPosition() {
    // Main Car
    const cRect = car.getBoundingClientRect();

    // Iterate Through All Vehicles and check collision.
    vehicles.forEach(el => {
        const eachVehicleOneByOneCheck = el.getBoundingClientRect();
        
        if (cRect.left < eachVehicleOneByOneCheck.right &&
            cRect.right > eachVehicleOneByOneCheck.left &&
            cRect.top < eachVehicleOneByOneCheck.bottom &&
            cRect.bottom > eachVehicleOneByOneCheck.top
        ) {
            tasksAtGameOver();
            stopAnimationFrameOnCollision = false;
        }
    });
        // Collision Occurs And This will false. Mention as Above.
    if (stopAnimationFrameOnCollision){
        animatedId = requestAnimationFrame(trackPosition);
    }
}

trackPosition();


function tasksAtGameOver() {

    clearInterval(moveVehiclesInterval);    // Clear Car Movements
    clearInterval(formulaCarInterval);
    clearInterval(moveLinesInterval);
    // 
    document.querySelector(".game-over-score").innerText = `Score is = ${userScore}`; //Show Score when GameOver
    document.removeEventListener('keydown', driveMainCar);
    document.removeEventListener('keyup', jumpOnClick);     // Remove Jump or fly
    document.querySelector('.pop-up').style.removeProperty('display');
    GameStartMusic.pause();
    accident.play();
    gameOver.play();
    cancelAnimationFrame(animatedId);       // Cancel Next Frame
}


// Count Scores and detect Collisions
function gainScoresByCoins() {
    const goldCoin = coin.getBoundingClientRect();
    const Mycar = car.getBoundingClientRect();

    // Coin Touch Function 
    if (Mycar.left < goldCoin.right &&
        Mycar.right > goldCoin.left &&
        Mycar.top < goldCoin.bottom &&
        Mycar.bottom > goldCoin.top
    ) {
        // Move Coin on lanes
        coin.style.setProperty('--coinPositionX', `${positionArrayOfCoin[coinPositionIndex]}px`);
        userScore++;
        coinPositionIndex++;

        moveCoinY = -100;
        coinSound.play();
    }

    // Reset The Coin Position On X-axis.
    if (coinPositionIndex === positionArrayOfCoin.length) {
        coinPositionIndex = 0;
    }
    // Set Fly Score Board.
    scoreboard.innerText = userScore;
    jumpsBoard.innerText = jumpCarScores;
    levelUpBoard.innerText = levelStage;
    LevelUpFunctionOnScore();
}


// if score 5 Level Up, Speed Accelerate, Increase Jumps 
function LevelUpFunctionOnScore() {
    if (userScore >= levelUpOnEachStep) {
        // Clear Interval To Incease Speed.
        clearInterval(moveVehiclesInterval);
        // Start Interval To Incease Speed.
        jumpCarScores++;
        levelStage++;
        levelUpOnEachStep += 5;
    }
}


function formulaCarfunction() {
    formulaSpeed += 20;
    formula.style.setProperty("--formulaY", `${formulaSpeed}px`);

    if (formulaSpeed >= 770) {
        formula.classList.add("hid-cars");
        formula.style.setProperty('--formulaX', `${positionArrayOfCoin[formulaCarLaneIndex]}px`);
        formulaSpeed = -650;
        setTimeout(() => formula.classList.remove("hid-cars"), 1500);
        formulaCarLaneIndex++;
    }

    // Reset Formula Car To 1st Lane
    if (formulaCarLaneIndex === positionArrayOfCoin.length) {
        formulaCarLaneIndex = 0;
    }
}


formulaCarInterval = setInterval(formulaCarfunction, 60);


// Reset Button Logic
RestartGameBtn.addEventListener('click', () => {
    location.reload();
    document.querySelector(".pop-up").classList.remove('hid-cars');
});



// Move The Road Lines
function movingRoad() {
    // Move 1st Line Of Road
    line1.forEach(line => {
        line.style.setProperty('--roadLine1', `${roadLine1}px`);
    });
    roadLine1 += 10;


    // Move 2nd Line Of Road
    line2.forEach(line => {
        line.style.setProperty('--roadLine2', `${roadLine2}px`);
    });
    roadLine2 += 10;


    // Move 3rd Line Of Road
    line3.forEach(line => {
        line.style.setProperty('--roadLine3', `${roadLine3}px`);
    });
    roadLine3 += 10;


    // Move 4th Line Of Road 
    line4.forEach(line => {
        line.style.setProperty('--roadLine4', `${roadLine4}px`);
    });
    roadLine4 += 10;

    // console.log(roadLine1, roadLine2, roadLine3, roadLine4);

    BoundariesOfYellowLines();
}



// When Yellow Lines Out Of the Roads Visibility None.
function BoundariesOfYellowLines() {

    // 1st Row
    if (roadLine1 >= 900) {
        line1.forEach(line => {
            line.classList.add('hid-roadlines');
        });
        roadLine1 = -300;
        setTimeout(() =>
            line1.forEach(line => {
                line.classList.remove("hid-roadlines");
            }), 600);
    }

    // 2nd Row
    if (roadLine2 >= 700) {
        line2.forEach(line => {
            line.classList.add('hid-roadlines');
        });
        roadLine2 = -500;
        setTimeout(() =>
            line2.forEach(line => {
                line.classList.remove("hid-roadlines");
            }), 600);
    }

    // 3rd Row
    if (roadLine3 >= 350) {
        line3.forEach(line => {
            line.classList.add('hid-roadlines');
        });
        roadLine3 = -700;
        setTimeout(() =>
            line3.forEach(line => {
                line.classList.remove("hid-roadlines");
            }), 600);
    }

    // 4th Row
    if (roadLine4 >= 100) {
        line4.forEach(line => {
            line.classList.add('hid-roadlines');
        });
        roadLine4 = -900;
        setTimeout(() =>
            line4.forEach(line => {
                line.classList.remove("hid-roadlines");
            }), 600);
    }
}

moveLinesInterval = setInterval(movingRoad, 130);


// Change The Volume Of th Game.
changeVolume.addEventListener('change', (e) => {
    GameStartMusic.volume = (changeVolume.value / 100).toFixed(1);
});




// Count Time On Start Game.
const gameStartAtTime = () => {
    incrementTimeOnEachfuncCall++;
    // console.log("function calls", incrementTimeOnEachfuncCall)
    if (incrementTimeOnEachfuncCall === 10) {
        incrementTimeOnEachfuncCall = 1
        const elapsed = Math.floor((Date.now() - startTime) / 1000);

        const secs = elapsed % 60;
        const mins = Math.floor(elapsed / 60) % 60;
        const hours = Math.floor(elapsed / 3600);

        timeCount.innerText = `${hours}h:${mins}m:${secs}s`;
    }
}