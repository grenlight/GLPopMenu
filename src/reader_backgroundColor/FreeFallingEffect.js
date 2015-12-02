import { IColorChange } from './IColorChange.js';
import { Line2d } from './Line2d.js';

export class FreeFallingEffect extends IColorChange {
  constructor() {
    super('#ff0000');
    this.lineWidth = 3;
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
    let count = Math.ceil(this.canvasWidth / this.lineWidth);
    for (let i = 0; i < count; i++) {
      let line = new Line2d(this.lineWidth * (i + 0.5), this.lineWidth);
      this.lineList.push(line);
    }
  }

  updateStateBg(color) {
    this.stageBg.clear();
    this.stageBg.beginFill(color);
    this.stageBg.drawRect(0, 0, window.innerWidth, window.innerHeight);
    this.stageBg.endFill();
  }

  drawPolygon(path) {
    this.polygon.clear();
    this.polygon.beginFill(this.currentColor);
    this.polygon.drawPolygon(path);
    this.polygon.endFill();
  }

  stopAnimating() {
    super.stopAnimating();
    this.updateStateBg(this.currentColor);
    for (let i = 0, listLength = this.lineList.length; i < listLength; i++) {
      this.lineList[i].goHome();
    }
  }

  enterFrame() {
    let needRun = false;
    let polygonPath = [this.pTopRight, this.pTopLeft];
    for (let i = 0, listLength = this.lineList.length; i < listLength; i++) {
      let results = this.lineList[i].getCoords();
      let coords = results[0];
      polygonPath.push(coords[0]);
      polygonPath.push(coords[1]);
      needRun = needRun || results[1];
    }
    polygonPath.push(this.pTopRight);
    this.drawPolygon(polygonPath);
    this.renderer.render(this.stage);

    if (needRun) {
      super.enterFrame();
    } else {
      this.stopAnimating();
    }
  }

}
