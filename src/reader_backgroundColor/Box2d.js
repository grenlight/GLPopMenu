export class Box2d {
  constructor(positionX, boxWidth) {
    this.boxWidth = boxWidth;
    this.graphic = new PIXI.Graphics();
    this.origin = new PIXI.Point(positionX, -window.innerHeight);
    this.positionY = -window.innerHeight;
    this.positionX = positionX;
  }

  setFillColor(color) {
    this.graphic.clear();
    this.graphic.beginFill(color);
    this.graphic.drawRect(0, 0, this.boxWidth, window.innerHeight);
    this.graphic.endFill();
    this.goHome();
  }

  goHome() {
    this.graphic.position = this.origin.clone();
    this.positionY = -window.innerHeight;
    this.frameIndex = 0;
    this.speed = 1 / window.devicePixelRatio;
    this.pList = [];
    this.calculatePositionList();
  }

  calculatePositionList() {
    this.positionY += this.speed;

    if (this.positionY < 0) {
      this.pList.push(this.positionY);
      this.speed += Math.random() * 0.8 + 0.2;
      this.calculatePositionList();
    } else {
      this.positionY = 0;
      this.pList.push(this.positionY);
    }
  }

  updatePosition() {
    if (this.frameIndex < this.pList.length) {
      this.graphic.position.y = this.pList[this.frameIndex];
      this.frameIndex++;
      return true;
    }
    return false
  }

}
