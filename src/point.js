class Points {
  constructor() {
    this.width = 10;
    this.height = 10;
    this.positionX = Math.floor(Math.random() * (100 - this.width) + 1);
    this.positionY = Math.floor(Math.random() * (100 - this.width) + 1);
    this.imageSrc = Math.floor(Math.random() * (4 - 1 + 1) + 1);

    this.pointEl = null;
    this.board = board;
    this.createPoints();
  }
  createPoints() {
    this.pointEl = document.createElement("div");
    this.pointEl.setAttribute("class", "point");
    this.board.appendChild(this.pointEl);
    console.log(this.imageSrc);

    const flower = document.createElement("img");
    flower.setAttribute("src", `./img/flower-${this.imageSrc}.gif`);
    this.pointEl.appendChild(flower);

    this.pointEl.style.width = this.width + "vw";
    this.pointEl.style.height = this.height + "vh";
    this.pointEl.style.left = this.positionX + "vw";
    this.pointEl.style.top = this.positionY + "vh";
  }
}
