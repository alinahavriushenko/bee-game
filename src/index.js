class Game {
  constructor() {
    this.board = this.createBoard();
    this.showMessageScreen("startGame");

    this.currentLevel = 0;
    this.gameLevels = [
      { id: 1, duration: 25, points: 15 },
      { id: 2, duration: 50, points: 25 },
      { id: 3, duration: 70, points: 40 },
    ];
  }

  showMessageScreen(message) {
    this.message = message;
    let backgroundSound = new Audio("./audio/background.flac");

    const missionDisplay = document.createElement("div");
    missionDisplay.setAttribute("class", "game-display");
    this.board.appendChild(missionDisplay);

    const levelData = {
      startGame: {
        title: "Uh-oh!",
        intro:
          "Our once-vibrant garden is in trouble – the flowers are withering. The delicate balance of nature is disrupted, and it's up to you to embark on a pollen-collecting journey. Take on the role of a bee, a crucial link in the circle of life. By collecting pollen, you'll bring life back to our flowers. But watch out for clouds – they can dampen your progress!",
        img: "start",
        button: "Play now",
      },
      levelUp: {
        title: `Level ${this.currentLevel + 1}`,
        intro:
          "Great job, busy bee! The garden is showing signs of revival, but there's more to be done. Your efforts have brought life back to fading flowers, but not all of them. Keep collecting pollen and navigating through challenges – there are still flowers waiting to bloom under your care.",
        img: "lvl2",
        button: "Go to the next level",
      },
      youWon: {
        title: "You won!",
        intro:
          "You did it, busy bee! The garden is in full bloom, vibrant with life and color. Your unwavering dedication have triumphed over challenges, turning once-fading flowers into a magnificent tapestry of nature's beauty. Congratulations on a job well done!",
        img: "final",
        button: "Play again",
      },
      levelDown: {
        title: `Back on level ${this.currentLevel + 1}`,
        intro:
          "The journey through the garden is filled with twists and turns. If a level proved challenging, it's okay. You've got this – go back, collect more pollen, and let the garden thrive under your care!",
        img: "start",
        button: "Try again",
      },
      tryAgain: {
        title: "Try again",
        intro:
          "Uh-oh! The garden needs more love.  It seems the challenges were tough, and some flowers couldn't withstand the hurdles. Don't worry, though! Nature is forgiving. Ready to give it another shot?",
        img: "start",
        button: "Try again",
      },
    };

    const currentLevelData = levelData[this.message];

    if (this.message === "levelUp") {
      this.endGameRound();
      this.currentLevel++;
    } else if (this.message === "youWon") {
      this.endGameRound();
    } else if (this.message === "levelDown") {
      this.endGameRound();
      this.currentLevel--;
    } else if (this.message === "tryAgain") {
      this.endGameRound();
    }

    missionDisplay.innerHTML = `
    <img src="./img/${currentLevelData.img}-game.png">
    <h1>${currentLevelData.title}</h1>
    <p>${currentLevelData.intro}</p>
    <div id="game-instructions">
    <img src="./img/arrows.png" alt="game instructions">
    <p>Guide your bee using the arrow keys and their combinations</p></div>
    <h2 id="play-btn">${currentLevelData.button}</h2>
    `;

    const startGame = document.getElementById("play-btn");
    startGame.addEventListener("click", () => {
      this.board.removeChild(missionDisplay);
      this.startGameRound();
      backgroundSound.play();
    });

    missionDisplay.style.width = 70 + "vw";
    missionDisplay.style.height = 80 + "vh";
    missionDisplay.style.left = 15 + "vw";
    missionDisplay.style.top = 10 + "vh";
  }

  createBoard() {
    const board = document.createElement("div");
    board.setAttribute("id", "board");
    document.body.appendChild(board);
    console.log("board created");
    return board;
  }

  startGameRound() {
    this.player = new Player();
    this.listenEvents();
    this.handlePoints();

    this.detectCollision();

    this.keysPressed = {};
    this.points = [];
    this.enemies = [];
    this.point = null;
    this.pointEl = null;
    this.enemyEl = null;

    this.progress = 0;

    this.barsContainer = null;
    this.progressBar = null;
    this.pointDisplay = null;
    this.createPointsBar();
    this.enemy = null;
    this.pointsCount = 0;

    this.createTimer();
    this.countDown();

    this.pointsToCollect = this.gameLevels[this.currentLevel].points;
    this.gameDuration = this.gameLevels[this.currentLevel].duration;
    this.timeRemaining = this.gameDuration;
  }

  listenEvents() {
    this.beeSound = new Audio("./audio/bee-sound.wav");
    this.beeSound.volume = 0.5;

    document.addEventListener("keydown", (e) => {
      this.keysPressed[e.code] = true;
      this.beeSound.play();

      if (this.keysPressed["ArrowLeft"] && this.keysPressed["ArrowUp"]) {
        this.player.moveUpLeft();
      } else if (this.keysPressed["ArrowLeft"] && this.keysPressed["ArrowDown"]) {
        this.player.moveDownLeft();
      } else if (this.keysPressed["ArrowRight"] && this.keysPressed["ArrowDown"]) {
        this.player.moveDownRight();
      } else if (this.keysPressed["ArrowRight"] && this.keysPressed["ArrowUp"]) {
        this.player.moveUpRight();
      } else if (e.code === "ArrowLeft") {
        this.player.moveLeft();
      } else if (e.code === "ArrowRight") {
        this.player.moveRight();
      } else if (e.code === "ArrowUp") {
        this.player.moveUp();
      } else if (e.code === "ArrowDown") {
        this.player.moveDown();
      }
    });

    document.addEventListener("keyup", (e) => {
      this.keysPressed[e.code] = false;
      this.beeSound.pause();
    });
  }

  handlePoints() {
    clearInterval(this.pointCreationId);
    clearInterval(this.enemiesCreationId);
    clearInterval(this.pointsRemovalId);

    this.cloudSound = new Audio("./audio/cloud-sound.mp3");
    this.cloudSound.volume = 0.3;
    this.cloudSound.playbackRate = 0.6;

    this.pointCreationId = setInterval(() => {
      this.point = new Points();
      this.points.push(this.point);
    }, 2000);

    this.enemiesCreationId = setInterval(() => {
      this.enemy = new Enemy();
      this.cloudSound.play();
      this.enemies.push(this.enemy);
    }, 7000);

    this.pointsRemovalId = setInterval(() => {
      const removedPoint = this.points.shift();
      if (removedPoint.pointEl) {
        removedPoint.pointEl.remove();
      }
    }, 7000);
  }

  detectCollision() {
    let pointSound = new Audio("./audio/point-sound.flac");
    setInterval(() => {
      this.points.forEach((pointElement, index) => {
        if (
          this.player.positionX < pointElement.positionX + pointElement.width &&
          this.player.positionX + this.player.width > pointElement.positionX &&
          this.player.positionY < pointElement.positionY + pointElement.height &&
          this.player.positionY + this.player.height > pointElement.positionY
        ) {
          console.log("collision detected");
          pointSound.play();
          pointSound.volume = 0.5;

          this.pointsCount += 5;
          this.updatePointsCollected(this.pointsCount);
          console.log(this.pointsCount);

          if (pointElement.pointEl) {
            this.points.splice(index, 1);
            pointElement.pointEl.remove();
          }
        }
      });
    }, 1000);

    setInterval(() => {
      this.enemies.forEach((enemyElement) => {
        enemyElement.moveEnemy();

        if (
          this.player.positionX < enemyElement.positionX + enemyElement.width &&
          this.player.positionX + this.player.width > enemyElement.positionX &&
          this.player.positionY < enemyElement.positionY + enemyElement.height &&
          this.player.positionY + this.player.height > enemyElement.positionY
        ) {
          if (this.pointsCount !== 0) {
            this.pointsCount -= 0.5;
            this.updatePointsCollected(this.pointsCount);
            console.log("-5 points");
          }
        }
      });
    }, 50); //50
  }

  createPointsBar() {
    this.barsContainer = document.createElement("div");
    this.barsContainer.setAttribute("class", "bars-container");
    this.board.appendChild(this.barsContainer);

    this.pointDisplay = document.createElement("div");
    this.pointDisplay.setAttribute("class", "display-bar");
    this.barsContainer.appendChild(this.pointDisplay);

    this.pointDisplay.innerHTML = `
    <div class="progress-bar" id="progress-points"></div>
    <div class="num-display" id="total-points"></div>
    `;

    this.pointDisplay.style.width = 30 + "vw";
    this.pointDisplay.style.height = 5 + "vh";
  }

  updatePointsCollected(points) {
    this.progress = (points / this.pointsToCollect) * 100;
    document.getElementById("progress-points").style.width = this.progress + "%";
    document.getElementById("total-points").innerHTML = points;

    const currentLevelData = this.gameLevels[this.currentLevel];

    if (points >= currentLevelData.points) {
      if (this.currentLevel < this.gameLevels.length - 1) {
        this.showMessageScreen("levelUp");
        console.log("level up");
      } else if (this.currentLevel >= this.gameLevels.length - 1) {
        this.showMessageScreen("youWon");
      } else {
        console.log("UP");
      }
    }
  }

  createTimer() {
    this.timerId = null;
    this.timer = document.createElement("div");
    this.timer.setAttribute("class", "display-bar");
    this.barsContainer.appendChild(this.timer);

    this.timer.innerHTML = `
    <div class="progress-bar" id="time-left"></div>
    <div class="num-display" id="timer"></div>
    `;

    this.timer.style.width = 30 + "vw";
    this.timer.style.height = 5 + "vh";
  }

  countDown() {
    this.timerId = setInterval(() => {
      if (this.timeRemaining !== 0) {
        this.timeRemaining--;
        let timeLeft = (this.timeRemaining / this.gameDuration) * 100;
        document.getElementById("time-left").style.width = timeLeft + "%";
        document.getElementById("timer").innerHTML = this.timeRemaining;
      } else {
        if (this.currentLevel < 1) {
          clearInterval(this.timerId);
          this.showMessageScreen("tryAgain");
        } else {
          clearInterval(this.timerId);
          this.showMessageScreen("levelDown");
        }
      }
    }, 1000);
  }

  endGameRound() {
    console.log("Clearing intervals...");
    clearInterval(this.enemiesCreationId);
    console.log("Intervals cleared.");

    clearInterval(this.enemiesCreationId);
    clearInterval(this.pointCreationId);
    clearInterval(this.pointsRemovalId);
    clearInterval(this.timerId);

    this.enemies.forEach((enemy) => {
      if (enemy.enemyEl) {
        enemy.enemyEl.remove();
      }
    });

    this.points.forEach((point) => {
      if (point.pointEl) {
        point.pointEl.remove();
      }
    });

    this.keysPressed = {};
    this.points = [];
    this.enemies = [];
    this.point = null;
    this.pointEl = null;
    this.enemyEl = null;
    this.progress = 0;

    if (this.barsContainer) {
      this.barsContainer.remove();
    }

    const playerElement = document.getElementById("player");
    if (playerElement) {
      playerElement.remove();
    }
  }
}

//
const beeGame = new Game();
console.log(beeGame.gameLevels[0].points);
