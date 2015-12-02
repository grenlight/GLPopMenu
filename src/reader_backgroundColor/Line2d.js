export class Line2d {
  constructor(positionX, boxWidth) {
    this.boxWidth = boxWidth;
    this.positionY = 0;
    this.positionX = positionX;

    this.goHome();
  }

  goHome() {
    this.positionY = 0;
    this.frameIndex = 0;
    this.speed = 0.5;
    this.pList = [];
    this.pListLength = 0;
    this.calculatePositionList();
  }

  calculatePositionList() {
    this.positionY += this.speed;
    if (this.positionY > window.innerHeight) {
      this.positionY = window.innerHeight;
    }
    let pl = new PIXI.Point(this.positionX, this.positionY);
    let pr = new PIXI.Point(this.positionX + this.boxWidth, this.positionY);
    this.pList.push([pl, pr]);

    if (this.positionY === window.innerHeight) {
      this.pListLength = this.pList.length;
    } else {
      this.speed += Math.random() * 0.5 + 0.5;
      this.calculatePositionList();
    }
  }

  getCoords() {
    let result;
    if (this.frameIndex < this.pListLength) {
      result = this.pList[this.frameIndex];
      this.frameIndex++;
    } else {
      result = this.pList[this.pListLength - 1];
    }
    return result;
  }

}
