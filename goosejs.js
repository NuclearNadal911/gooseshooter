let ducks = [] ;
let duckCount = 1;
let duckImageNames = ["duckleft.gif", "duckright.gif"]
let duckWidth = 96;
let duckHeight = 93;
let duckVelocityX = 5;
let duckVelocityY = 5;
let timeLeft = 8;
let gameInterval;
let timerInterval;
let isGameOver = false;
let dogTimeout;
let gameWidth = window.innerWidth;
let gameHeight = window.innerHeight;
let dogImage;
let maxTime = 7;

let score = 0;


function addDucks() {
    if (isGameOver) return;
    clearInterval(timerInterval);
    if(score >= 100){
        maxTime = 4;
    }else if (score >= 50){
        maxTime = 5;
    }else if (score >= 10){
        maxTime= 6;
    } else {
        maxTime = 7;
    }
    timeLeft = maxTime;
    document.getElementById("timer").innerHTML = timeLeft;
    timerInterval = setInterval(updateTimer,1000);

    let gooseApperSound = new Audio("goose-sound.mp3");
    gooseApperSound. volume = 0.9;
    gooseApperSound.play();

    ducks = [];
    duckCount = Math.floor(Math.random()*3) + 1;
    for (let i = 0; i < duckCount; i++) {
        let duckImageName = duckImageNames[Math.floor(Math.random()*2)];
        let duckImage = document.createElement("img");
     duckImage.src = duckImageName;
        duckImage.width = duckWidth;
     duckImage.height = duckHeight;
     duckImage.draggable = false;
     duckImage.style.position = "absolute";
     duckImage.onclick = function() {
         let duckShotSound = new Audio("goose-shoot.mov");
         duckShotSound.volume = 0.9;
         duckShotSound.play();
         score += 1;
         document.getElementById("score").innerHTML = score;
            if (score === 10) {
                popupText("OUTSTANDING!", "#CD7F32", "outstanding.mp3");
            }
            if (score === 50) {
                popupText("AMAZING!!", "#C0C0C0", "amazing.mp3");
            }
            if (score === 100){
                popupText("OH YES!!!", "#FFD700","ohyes.mp3");
            }
         document.body.removeChild(this);
         let remainingDucks = [];
         for (let i = 0; i < ducks.length; i++) {
             if (ducks[i].image != this) {
                 remainingDucks.push(ducks[i]);
             }
         }
         ducks = remainingDucks;
         if (ducks.length == 0) {
            clearInterval(timerInterval);
             addDog();
         }
     }
     document.body.appendChild(duckImage);

     let duck = {
        image: duckImage,
        x: randomPostition(gameWidth - duckWidth),
        y: randomPostition(gameHeight - duckHeight),
         velocityX: duckVelocityX,
         velocityY: duckVelocityY
    }
 duck.image.style.left = String(duck.x) + "px";
    duck.image.style.top= String(duck.y) + "px";
    if (duck.image.src.includes(duckImageNames[0])){
        duck.velocityX = -duckVelocityX;
    }
    ducks.push(duck);
    }
}
function moveDucks(){
    for (let i = 0; i < ducks.length; i++) {
        let duck = ducks[i];
        duck.x += duck.velocityX;
        if (duck.x < 0 || duck.x + duckWidth > gameWidth) {
            duck.x -= duck.velocityX;
            duck.velocityX *= -1;
            if (duck.velocityX < 0) {
                duck.image.src = duckImageNames[0];//left
            }else{
                duck.image.src = duckImageNames[1];//right
            }
        }
        duck.y += duck.velocityY;
        if (duck.y < 0 || duck.y + duckHeight > gameHeight) {
            duck.y -= duck.velocityY;
            duck.velocityY *= -1;
        }

        duck.image.style.left = String(duck.x) + "px";
        duck.image.style.top= String(duck.y) + "px";
    }
}
function addDog() {
    dogImage = document.createElement("img"); //upraveno na globalni promennou
    if (duckCount == 1) {
        dogImage.src = "doggoose1.png";
        dogImage.width = 172*2;
    }
    if (duckCount == 2) {
        dogImage.src = "doggoose2.png";
        dogImage.width = 224*2;
    }
    if (duckCount == 3) {
        dogImage.src = "doggoose3.png";
        dogImage.width = 224*2;
    }
    dogImage.height = 152*2;
    dogImage.draggable = false;

    dogImage.style.position = "fixed";
    dogImage.style.bottom = "0px";
    dogImage.style.left ="50%";
    document.body.appendChild(dogImage);

    let dogScoreSound = new Audio("dgoscore.mp3");
    dogScoreSound.volume = 0.7;
    dogScoreSound.play();

   dogTimeout = setTimeout(function () {
       if (dogImage.parentNode) {
           document.body.removeChild(dogImage);
       }
        addDucks();
    }, 5000);
}

function randomPostition(limit) {
    return Math.floor(Math.random()*limit);
}

function startGame() {
    document.getElementById("start-screen").style.display = "none";
    setTimeout(addDucks, 1000);
    gameInterval = setInterval(moveDucks, 1000 / 60);
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    if (isGameOver) return;

    timeLeft--;
    document.getElementById("timer").innerHTML = timeLeft;

    if(timeLeft <= 0) {
        endGame();
    }
}

function endGame() {
    isGameOver = true;
    clearInterval(gameInterval);
    clearInterval(timerInterval);
    clearTimeout(dogTimeout);
    try {
        let gameOverSound = new Audio("gameover.mp3");
        gameOverSound.volume = 0.6;
        gameOverSound.play().catch(e => {
            console.log("Autoplay zablokoval zvuk.");
        });
    } catch (e) {
        console.log("Chyba audia.");
    }
    for(let i = 0; i < ducks.length; i++) {
        if(ducks[i].image.parentNode) {
            document.body.removeChild(ducks[i].image);
        }
    }
        ducks = [];
    if (dogImage && dogImage.parentNode) {
        document.body.removeChild(dogImage);
    }
    document.getElementById("final-score").innerHTML = score;
    document.getElementById("game-over-screen").style.display = "flex";
}

function popupText(text, color, nameSound){
    let element = document.getElementById("motivation");
    element.innerHTML = text;
    element.style.color = color;
    element.style.display = "block";
    try{
        let milestoneSound = new Audio(nameSound);
        milestoneSound.play().catch(e => {
            console.log("Prohlizec zablokoval zvuk milniku pred prvnim kliknutim");
        });
        }catch (e) {
        console.log("Nepodarilo se nacist zvuk milniku:", nameSound);
    }

    setTimeout(function (){
        element.style.display = "none";
    }, 2000);
}