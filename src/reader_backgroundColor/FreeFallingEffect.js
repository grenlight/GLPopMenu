import { IColorChange } from './IColorChange.js';
import { Line2d } from './Line2d.js';

/**
*线条随机下落效果
*
*里面一些写法是为了提高运行时的效率，并非多此一举
*/
export class FreeFallingEffect extends IColorChange {
  constructor() {
    super('#ff0000');
    this.lineWidth = 3;
    this.oneLoopFrames = 100;
    this.canvasWidth = window.innerWidth;
    this.canvasHeight = window.innerHeight;
    this.initCanvas();
    this.generateState();
    this.generateLineList();
  }

  initCanvas() {
    this.renderer = PIXI.autoDetectRenderer(this.canvasWidth, this.canvasHeight, {
      transparent: true,
      resolution: window.devicePixelRatio
    });

    this.renderer.view.setAttribute('style', 'position:fixed; z-index:-10000; left:0px; top:0px; width:' + this.canvasWidth + 'px; height: ' + this.canvasHeight + 'px');
    document.body.appendChild(this.renderer.view);
  }

  generateState() {
    this.stage = new PIXI.Container();
    this.stageBg = new PIXI.Graphics();
    this.stage.addChild(this.stageBg);
    this.updateStateBg(this.lastColor);

    this.polygon = new PIXI.Graphics();
    this.stage.addChild(this.polygon);

    this.pTopRight = new PIXI.Point(this.canvasWidth, 0);
    this.pTopLeft = new PIXI.Point(0, 0);
  }

  generateLineList() {
    this.lineList = [];
    this.lineCount = 0;
    let count = Math.ceil(this.canvasWidth / this.lineWidth);
    for (let i = 0; i < count; i++) {
      let line = new Line2d(this.lineWidth * i, this.lineWidth);
      this.lineList.push(line);
    }
    this.lineCount = this.lineList.length;
    this.calculatePathList();
  }

  calculatePathList() {
    this.pathList = [];
    for (let i = 0; i < this.oneLoopFrames; i++) {
      let polygonPath = [this.pTopRight, this.pTopLeft];
      for (let i = 0; i < this.lineCount; i++) {
        polygonPath = polygonPath.concat(this.lineList[i].getCoords());
      }
      polygonPath.push(this.pTopRight);
      this.pathList.push(polygonPath);
    }
  }

  updateStateBg(color) {
    this.stageBg.clear();
    this.stageBg.beginFill(color);
    this.stageBg.drawRect(0, 0, window.innerWidth, window.innerHeight);
    this.stageBg.endFill();
    this.renderer.render(this.stage);
  }

  updatePolygon(path) {
    this.polygon.clear();
    this.polygon.beginFill(this.currentColor);
    this.polygon.drawPolygon(path);
    this.polygon.endFill();
    this.renderer.render(this.stage);
  }

  stopAnimating() {
    super.stopAnimating();
    this.updateStateBg(this.currentColor);
    for (let i = 0, listLength = this.lineList.length; i < listLength; i++) {
      this.lineList[i].goHome();
    }
  }

  enterFrame() {
    let polygonPath = this.pathList[this.frameIndex];
    this.updatePolygon(polygonPath);

    if (this.frameIndex < this.oneLoopFrames) {
      super.enterFrame();
    } else {
      this.stopAnimating();
    }
  }

}
