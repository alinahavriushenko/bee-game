class Game {
  constructor() {
    this.board = this.createBoard();
    this.showMessageScreen("startGame");

    this.currentLevel = 0;
    this.gameLevels = [
      { id: 1, duration: 30, points: 15 },
      { id: 2, duration: 50, points: 25 },
      { id: 3, duration: 70, points: 40 },
    ];
  }

  showMessageScreen(message) {
    this.message = message;

    const missionDisplay = document.createElement("div");
    missionDisplay.setAttribute("class", "game-display");
    this.board.appendChild(missionDisplay);

    let levelTitle = "";
    let levelMessage = "";

    if (this.message === "startGame") {
      levelTitle = "Welcome";
      levelMessage = "Press start to play";
    } else if (this.message === "levelUp") {
      this.endGameRound();
      this.currentLevel++;
      levelTitle = `Welcome to the next level ${this.currentLevel}`;
      levelMessage = "Press start to play";
    } else if (this.message === "youWon") {
      this.endGameRound();
      levelTitle = `You won!`;
      levelMessage = "Press start to play";
    } else if (this.message === "levelDown") {
      this.endGameRound();
      this.currentLevel--;
      levelTitle = `Go back to level ${this.currentLevel}`;
      levelMessage = "Press start to play";
    } else if (this.message === "tryAgain") {
      this.endGameRound();
      levelTitle = `Try again`;
      levelMessage = "Press start to play";
    }

    missionDisplay.innerHTML = `
    <img />
    <h1 id="start-game">${levelTitle}</h1>
    <h2>${levelMessage}</h2>
    `;

    const startGame = document.getElementById("start-game");
    startGame.addEventListener("click", () => {
      this.board.removeChild(missionDisplay);
      this.startGameRound();
    });

    missionDisplay.style.width = 70 + "vw";
    missionDisplay.style.height = 70 + "vh";
    missionDisplay.style.left = 20 + "vw";
    missionDisplay.style.top = 20 + "vh";
  }

  createBoard() {
    const board = document.createElement("div");
    board.setAttribute("id", "board");
    document.body.appendChild(board);
    console.log("board created");
    return board; // return board
  }

  startGameRound() {
    this.player = new Player();
    this.listenEvents();
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
    this.handlePoints();

    this.createTimer();
    this.countDown();

    this.pointsToCollect = this.gameLevels[this.currentLevel].points;
    this.gameDuration = this.gameLevels[this.currentLevel].duration;
    this.timeRemaining = this.gameDuration;
  }

  listenEvents() {
    document.addEventListener("keydown", (e) => {
      this.keysPressed[e.code] = true;

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
    });
  }

  handlePoints() {
    this.enemiesCreationId = null;
    this.pointCreationId = null;
    this.pointsRemovalId = null;

    // TODO rename method
    this.pointCreationId = setInterval(() => {
      this.point = new Points();
      this.points.push(this.point);
    }, 3000); // 3000

    this.enemiesCreationId = setInterval(() => {
      this.enemy = new Enemy();
      this.enemies.push(this.enemy);
    }, 5000);

    this.pointsRemovalId = setInterval(() => {
      const removedPoint = this.points.shift();
      if (removedPoint.pointEl) {
        removedPoint.pointEl.remove();
      }
    }, 7000);
  }

  detectCollision() {
    setInterval(() => {
      this.points.forEach((pointElement, index) => {
        if (
          this.player.positionX < pointElement.positionX + pointElement.width &&
          this.player.positionX + this.player.width > pointElement.positionX &&
          this.player.positionY < pointElement.positionY + pointElement.height &&
          this.player.positionY + this.player.height > pointElement.positionY
        ) {
          console.log("collision detected");
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
    this.pointDisplay.setAttribute("id", "display-bar");
    this.barsContainer.appendChild(this.pointDisplay);

    this.pointDisplay.innerHTML = `
    <div id="progress-bar"></div>
    <div id="total-points"></div>
    `;

    this.pointDisplay.style.width = 30 + "vw";
    this.pointDisplay.style.height = 5 + "vh";
  }

  updatePointsCollected(points) {
    this.progress = (points / this.pointsToCollect) * 100;
    document.getElementById("progress-bar").style.width = this.progress + "%";
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
    this.timer.setAttribute("id", "display-bar-timer");
    this.barsContainer.appendChild(this.timer);

    this.timer.innerHTML = `
    <div id="time-left"></div>
    <div id="timer"></div>
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
