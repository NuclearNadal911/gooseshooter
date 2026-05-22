let geese = [] ;
let gooseCount = 1;
let gooseImageNames = ["duckleft.gif", "duckright.gif"]
let gooseWidth = 96;
let gooseHeight = 93;
let gooseVelocityX = 7;
let gooseVelocityY = 7;
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


function addGeese() {
    if (isGameOver) return;
    gooseVelocityX = 7 + score * 0.2;
    gooseVelocityY = 7 + score * 0.2;
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
    gooseApperSound.volume = 0.9;
    gooseApperSound.play();

    geese = [];
    gooseCount = Math.floor(Math.random()*3) + 1;
    for (let i = 0; i < gooseCount; i++) {
        let gooseImageName = gooseImageNames[Math.floor(Math.random()*2)];
        let gooseImage = document.createElement("img");
     gooseImage.src = gooseImageName;
        gooseImage.width = gooseWidth;
     gooseImage.height = gooseHeight;
     gooseImage.draggable = false;
     gooseImage.style.position = "absolute";
     gooseImage.onclick = function() {
         let gooseShotSound = new Audio("goose-shoot.mov");
         gooseShotSound.volume = 0.9;
         gooseShotSound.play();
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
         let remainingGeese = [];
         for (let i = 0; i < geese.length; i++) {
             if (geese[i].image != this) {
                 remainingGeese.push(geese[i]);
             }
         }
         geese = remainingGeese;
         if (geese.length == 0) {
            clearInterval(timerInterval);
             addDog();
         }
     }
     document.body.appendChild(gooseImage);

     let goose = {
        image: gooseImage,
        x: randomPostition(gameWidth - gooseWidth),
        y: randomPostition(gameHeight - gooseHeight),
         velocityX: gooseVelocityX,
         velocityY: gooseVelocityY
    }
 goose.image.style.left = String(goose.x) + "px";
    goose.image.style.top= String(goose.y) + "px";
    if (goose.image.src.includes(gooseImageNames[0])){
        goose.velocityX = -gooseVelocityX;
    }
    geese.push(goose);
    }
}
function moveGeese(){
    for (let i = 0; i < geese.length; i++) {
        let goose = geese[i];
        goose.x += goose.velocityX;
        if (goose.x < 0 || goose.x + gooseWidth > gameWidth) {
            goose.x -= goose.velocityX;
            goose.velocityX *= -1;
            if (goose.velocityX < 0) {
                goose.image.src = gooseImageNames[0];//left
            }else{
                goose.image.src = gooseImageNames[1];//right
            }
        }
        goose.y += goose.velocityY;
        if (goose.y < 0 || goose.y + gooseHeight > gameHeight) {
            goose.y -= goose.velocityY;
            goose.velocityY *= -1;
        }

        goose.image.style.left = String(goose.x) + "px";
        goose.image.style.top= String(goose.y) + "px";
    }
}
function addDog() {
    dogImage = document.createElement("img");
    if (gooseCount == 1) {
        dogImage.src = "doggoose1.png";
        dogImage.width = 172*2;
    }
    if (gooseCount == 2) {
        dogImage.src = "doggoose2.png";
        dogImage.width = 224*2;
    }
    if (gooseCount == 3) {
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
        addGeese();
    }, 5000);
}

function randomPostition(limit) {
    return Math.floor(Math.random()*limit);
}

function startGame() {
    document.getElementById("start-screen").style.display = "none";
    setTimeout(addGeese, 1000);
    gameInterval = setInterval(moveGeese, 1000 / 60);
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
    for(let i = 0; i < geese.length; i++) {
        if(geese[i].image.parentNode) {
            document.body.removeChild(geese[i].image);
        }
    }
        geese = [];
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
