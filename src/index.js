class Game {
  constructor() {
    this.board = this.createBoard();
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

    this.progressBar = null;
    this.pointDisplay = null;
    this.createPointsBar();
    this.enemy = null;
    this.pointsCount = 0;
    this.generatePoints();

    this.createTimer();
    this.countDown();

    this.pointsToCollect = 100;
    this.gameDuration = 60;
    this.timeRemaining = this.gameDuration;
  }

  createBoard() {
    const board = document.createElement("div");
    board.setAttribute("id", "board");
    document.body.appendChild(board);
    console.log("board created");
    return board; // return board
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

  generatePoints() {
    setInterval(() => {
      this.point = new Points();
      this.points.push(this.point);
    }, 3000);

    setInterval(() => {
      this.enemy = new Enemy();
      this.enemies.push(this.enemy);
    }, 5000);

    setInterval(() => {
      const removedPoint = this.points.shift();
      if (removedPoint.pointEl) {
        this.board.removeChild(removedPoint.pointEl);
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
            this.points.splice(index, 1); // delete from the array
            this.board.removeChild(pointElement.pointEl);
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
    this.pointDisplay = document.createElement("div");
    this.pointDisplay.setAttribute("id", "display-bar");
    this.board.appendChild(this.pointDisplay);

    this.pointDisplay.innerHTML = `
    <div id="progress-bar"></div>
    <div id="total-points"></div>
    `;

    this.pointDisplay.style.width = 20 + "vw";
    this.pointDisplay.style.height = 5 + "vh";
    this.pointDisplay.style.left = 50 + "vw";
    this.pointDisplay.style.top = 50 + "vh";
  }

  updatePointsCollected(points) {
    this.progress = (points / this.pointsToCollect) * 100;
    document.getElementById("progress-bar").style.width = this.progress + "%";
    document.getElementById("total-points").innerHTML = points;

    if (points === this.pointsToCollect) {
      location.href = "youwon.html";
    }
  }

  createTimer() {
    this.timer = document.createElement("div");
    this.timer.setAttribute("id", "display-bar-timer");
    this.board.appendChild(this.timer);

    this.timer.innerHTML = `
    <div id="time-left"></div>
    <div id="timer"></div>
    `;

    this.timer.style.width = 20 + "vw";
    this.timer.style.height = 5 + "vh";
    this.timer.style.left = 30 + "vw";
    this.timer.style.top = 30 + "vh";
  }

  countDown() {
    setInterval(() => {
      if (this.timeRemaining !== 0) {
        this.timeRemaining--;
        let timeLeft = (this.timeRemaining / this.gameDuration) * 100;
        document.getElementById("time-left").style.width = timeLeft + "%";
        document.getElementById("timer").innerHTML = this.timeRemaining;
      } else {
        location.href = "gameover.html";
      }
    }, 1000);
  }
}

//
const beeGame = new Game();
