class Points {
  constructor() {
    this.width = 10;
    this.height = 10;
    this.positionX = Math.floor(Math.random() * 100 - this.width + 1);
    this.positionY = Math.floor(Math.random() * 100 - this.width + 1); // Math.floor(Math.random() * (100 - this.height + 1)); // TODO make sure the point is not out of boarder

    this.pointEl = null;
    this.board = board;
    this.createPoints();
  }
  createPoints() {
    this.pointEl = document.createElement("div"); // TODO change div to img
    this.pointEl.setAttribute("class", "point");
    this.board.appendChild(this.pointEl);

    this.pointEl.style.width = this.width + "vw";
    this.pointEl.style.height = this.height + "vh";
    this.pointEl.style.left = this.positionX + "vw";
    this.pointEl.style.top = this.positionY + "vh";
  }
}
