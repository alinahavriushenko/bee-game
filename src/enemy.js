class Enemy {
  constructor() {
    this.width = 20;
    this.height = 20;
    this.board = board;
    this.enemyEl = null;
    this.targetX = null;
    this.targetY = null;
    this.createEnemy();

    this.startingCorner = Math.floor(Math.random() * 4);

    if (this.startingCorner === 0) {
      this.positionX = -this.width - 10;
      this.positionY = -this.height - 10;
      this.targetX = 100;
      this.targetY = 100;
    } else if (this.startingCorner === 1) {
      this.positionX = 100;
      this.positionY = -this.height;
      this.targetX = -this.width;
      this.targetY = 100;
    } else if (this.startingCorner === 2) {
      this.positionX = -this.width;
      this.positionY = 100;
      this.targetX = 100;
      this.targetY = -this.height;
    } else if (this.startingCorner === 3) {
      this.positionX = 100;
      this.positionY = 100;
      this.targetX = -this.width - 10;
      this.targetY = -this.height - 10;
    }
  }

  createEnemy() {
    this.enemyEl = document.createElement("div");
    this.enemyEl.setAttribute("class", "enemy");
    this.board.appendChild(this.enemyEl);

    const enemyImage = document.createElement("img");
    enemyImage.setAttribute("src", "./img/cloud.png");
    this.enemyEl.appendChild(enemyImage);

    this.enemyEl.style.width = this.width + "vw";
    this.enemyEl.style.height = this.height + "vh";
    this.enemyEl.style.left = this.positionX + "vw";
    this.enemyEl.style.top = this.positionY + "vh";
  }

  moveEnemy() {
    if (this.positionX !== this.targetX || this.positionY !== this.targetY) {
      if (this.positionX < this.targetX) {
        this.positionX += 1;
      } else {
        this.positionX -= 1;
      }

      if (this.positionY < this.targetY) {
        this.positionY += 1;
      } else {
        this.positionY -= 1;
      }
    }
    this.enemyEl.style.left = this.positionX + "vw";
    this.enemyEl.style.top = this.positionY + "vh";
  }
}
