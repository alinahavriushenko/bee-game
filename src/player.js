class Player {
  constructor() {
    this.width = 10;
    this.height = 10;
    this.positionX = 50;
    this.positionY = 50;

    this.board = board;
    this.createPlayer();
  }
  createPlayer() {
    this.playerElement = document.createElement("div");
    this.playerElement.setAttribute("id", "player");
    this.board.appendChild(this.playerElement);

    this.playerElement.style.width = this.width + "vw";
    this.playerElement.style.height = this.height + "vh";
    this.playerElement.style.left = this.positionX + "vw";
    this.playerElement.style.top = this.positionY + "vh";
  }
  moveUp() {
    if (this.positionY > 0) {
      this.positionY--;
      this.playerElement.style.top = this.positionY + "vh";
    }
  }
  moveDown() {
    if (this.positionY + this.height < 100) {
      this.positionY++;
      this.playerElement.style.top = this.positionY + "vh";
    }
  }
  moveRight() {
    if (this.positionX + this.width < 100) {
      this.positionX++;
      this.playerElement.style.left = this.positionX + "vw";
    }
  }
  moveLeft() {
    if (this.positionX > 0) {
      this.positionX--;
      this.playerElement.style.left = this.positionX + "vw";
    }
  }
  moveUpLeft() {
    this.moveUp();
    this.moveLeft();
  }
  moveDownLeft() {
    this.moveDown();
    this.moveLeft();
  }
  moveDownRight() {
    this.moveDown();
    this.moveRight();
  }
  moveUpRight() {
    this.moveUp();
    this.moveRight();
  }
}
