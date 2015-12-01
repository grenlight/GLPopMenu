import { IColorChange } from './IColorChange.js';
import { Box2d } from './Box2d.js';

export class FreeFallingEffect extends IColorChange {
  constructor() {
    super('#ff0000');
    this.boxWidth = 3;
    this.initCanvas();
    this.generateStateAndBg();
    this.generateBoxList();
  }

  initCanvas() {
    this.renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, {
      transparent: true,
      resolution: window.devicePixelRatio
    });

    this.renderer.view.setAttribute('style', 'position:fixed; z-index:-10000; left:0px; top:0px; width:' + window.innerWidth + 'px; height: ' + window.innerHeight + 'px');
    document.body.appendChild(this.renderer.view);
  }

  generateStateAndBg() {
    this.stage = new PIXI.Container();
    this.stageBg = new PIXI.Graphics();
    this.stage.addChild(this.stageBg);
    this.updateStateBg(this.lastColor);
  }

  updateStateBg(color) {
    this.stageBg.clear();
    this.stageBg.beginFill(color);
    this.stageBg.drawRect(0, 0, this.boxWidth, window.innerHeight);
    this.stageBg.endFill();
  }


  generateBoxList() {
    this.boxList = [];
    let count = Math.ceil(window.innerWidth / this.boxWidth);
    let position = new PIXI.Point(0, -window.innerHeight);
    for (let i = 0; i < count; i++) {
      let box = new Box2d(this.boxWidth / 2 + this.boxWidth * i, this.boxWidth);
      this.stage.addChild(box.graphic);
      this.boxList.push(box);
    }
  }

  stopAnimating() {
    super.stopAnimating();
    this.updateStateBg(this.currentColor);
    for (let i = 0, listLength = this.boxList.length; i < listLength; i++) {
      this.boxList[i].setFillColor(this.currentColor);
    }
  }

  enterFrame() {
    let needRun = false;
    for (let i = 0, listLength = this.boxList.length; i < listLength; i++) {
      let isRun = this.boxList[i].updatePosition();
      needRun = needRun || isRun;
    }
    this.renderer.render(this.stage);

    if (needRun) {
      super.enterFrame();
    } else {
      this.stopAnimating();
    }
  }

}
