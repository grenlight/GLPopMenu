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
    this.speed = 1 / window.devicePixelRatio;
    this.pList = [];
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

    if (this.positionY < window.innerHeight) {
      this.speed += Math.random() * 0.8 + 0.2;
      this.calculatePositionList();
    }
  }

  getCoords() {
    let ps, isRun;
    if (this.frameIndex < this.pList.length) {
      ps = this.pList[this.frameIndex];
      this.frameIndex++;
      isRun = true;
    } else {
      ps = this.pList[this.frameIndex - 1];
      isRun = false;
    }
    return [ps, isRun];
  }

}
