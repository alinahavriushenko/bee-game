class Player {
  constructor() {
    this.width = 10;
    this.height = 10;
    this.positionX = 50;
    this.positionY = 50;

    this.board = board;
    this.playerImage = null;
    this.createPlayer();
  }
  createPlayer() {
    this.playerElement = document.createElement("div");
    this.playerElement.setAttribute("id", "player");
    this.board.appendChild(this.playerElement);

    this.playerImage = document.createElement("img");
    this.playerImage.setAttribute("src", "../img/bee.png");
    this.playerElement.appendChild(this.playerImage);
    this.playerImage.style.transition = "transform 0.5s ease-in-out";

    this.playerElement.style.width = this.width + "vw";
    this.playerElement.style.height = this.height + "vh";
    this.playerElement.style.left = this.positionX + "vw";
    this.playerElement.style.top = this.positionY + "vh";
  }
  moveUp() {
    if (this.positionY > 0) {
      this.positionY--;
      this.playerImage.style.transform = `rotate(${0}deg)`;
      this.playerElement.style.top = this.positionY + "vh";
    }
  }
  moveDown() {
    if (this.positionY + this.height < 100) {
      this.positionY++;
      this.playerImage.style.transform = `rotate(${180}deg)`;
      this.playerElement.style.top = this.positionY + "vh";
    }
  }
  moveRight() {
    if (this.positionX + this.width < 100) {
      this.positionX++;
      this.playerImage.style.transform = `rotate(${90}deg)`;
      this.playerElement.style.left = this.positionX + "vw";
    }
  }
  moveLeft() {
    if (this.positionX > 0) {
      this.positionX--;
      this.playerImage.style.transform = `rotate(${260}deg)`;
      this.playerElement.style.left = this.positionX + "vw";
    }
  }
  moveUpLeft() {
    this.moveUp();
    this.moveLeft();
    this.playerImage.style.transform = `rotate(${320}deg)`;
  }
  moveDownLeft() {
    this.moveDown();
    this.moveLeft();
    this.playerImage.style.transform = `rotate(${220}deg)`;
  }
  moveDownRight() {
    this.moveDown();
    this.moveRight();
    this.playerImage.style.transform = `rotate(${140}deg)`;
  }
  moveUpRight() {
    this.moveUp();
    this.moveRight();
    this.playerImage.style.transform = `rotate(${60}deg)`;
  }
}
