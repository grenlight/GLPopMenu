import { GLSVG } from './elements/GLSVG.js';
import { IAnimation } from './interaction/IAnimation.js';
import { GLPoint } from './math/GLPoint.js';
import { GLRect } from './math/GLRect.js';

/**
*类 iOS 文本 Selection 菜单
*
*当 position.y < frame 的高度时，尖角自动朝上
*当 position.y > frame 的高度时，尖角自动朝下
*当 (screen.width - position.x) < frame.width/2 || position.x < frame.width/2 *时，保持尖角在屏幕的相对位置不变，整体位置向左|右移，保证bounds落在屏幕内
*/
var Symbol = require('es6-symbol');
let singleton = Symbol();
let singletonEnforcer = Symbol();

export class GLPopMenu extends IAnimation {
  constructor(enforcer) {
    if (enforcer !== singletonEnforcer) {
      throw '大兄弟，俺是个单例类啊';
    } else {
      super();
      this.width = 0;
      this.tapRanges = [];
      /**
      *鼠标经过的按钮区域索引
      *实际上是没有按钮结点的，通过鼠标坐标位置确定当前落在哪个虚拟按钮区域
      */
      this.movedIndex = 0;

      this.currentScale = this.currentAlpha = 0;
      this.currentTranslate = 30;

      this.isShow = false;
      this.panel = this.createPanel();

      // this.animationNode = this.group;
      this.svg = new GLSVG();
      this.addTapListener(this.svg.domElement, (e) => {
        this.menuTapped(e);
      });
      this.panel.appendChild(this.svg.domElement);

      this.tappedHandler = (e) => {
        this.panelTapped(e);
      };
    }
  }

  static get instance() {
    if (!this[singleton]) {
      this[singleton] = new GLPopMenu(singletonEnforcer);
    }
    return this[singleton];
  }

  /**
  *设置菜单项
  *
  *@param {Array} -> {text, callback}  items 菜单项及回调
  */
  setMenuItems(items) {
    this.parseItems(items);
  }

  /**
  *显示或隐藏菜单
  *
  *@param {Array} point 显示在屏幕上的X,Y坐标
  */
  ifNeedsDisplay(position) {
    if (this.isShow === true) {
      this.quitDisplay();
    } else {
      document.body.appendChild(this.panel);
      this.addTapListener(this.panel, this.tappedHandler);
      this.svg.setPosition(position);
      this.dispaly();
    }
  }

  //显示
  dispaly() {
    this.isShow = true;
    this.svg.domElement.style.opacity = this.currentAlpha = 0;

    this.startAnimating();
  }

  //退出显示
  quitDisplay() {
    this.isShow = false;
    this.startAnimating();
  }

  stopAnimating() {
    super.stopAnimating();
    if (this.isShow === false) {
      document.body.removeChild(this.panel);
      this.removeTapListener(this.panel, this.tappedHandler);
    }
  }

  enterFrame() {
    this.isAnimating = true;
    if (this.isShow === true) {
      this.currentAlpha += 0.07;
    } else {
      this.currentAlpha -= 0.09;
    }
    //边界条件检测
    if (this.currentAlpha < 0.0 || this.currentAlpha > 1.0) {
      this.currentAlpha = this.currentAlpha < 0.0 ? 0 : 1;
      this.stopAnimating();
    } else {
      super.enterFrame();
    }

    this.svg.domElement.style.opacity = this.currentAlpha;
  }

  panelTapped(e) {
    e.preventDefault();
    this.quitDisplay();
  }

  menuTapped(e) {
    e.preventDefault();
    var touchX, touchY;
    let tp = this.getTouchedPosition(e);
    var rect = this.svg.frame;
    touchX = tp.x - rect.x;
    touchY = tp.y - rect.y;

    for (var i = 0; i < this.tapRanges.length; i++) {
      if (touchX < this.tapRanges[i].to) {
        this.tapRanges[i].callback();
        this.quitDisplay();
        break;
      }
    }
  }

  parseItems(items) {
    //按钮的点击范围
    this.tapRanges = [];
    let length = 0;
    let padding = 10;
    let rangeFrom = padding;
    for (var i = 0; i < items.length; i++) {
      let text = items[i].text;
      let pixelLength = text.length * 16 + padding * 2;
      let tempTo = rangeFrom + pixelLength;

      this.tapRanges[i] = {
        text: text,
        from: rangeFrom,
        to: tempTo,
        center: (rangeFrom + pixelLength / 2),
        callback: items[i].callback
      };
      length += text.length;
      rangeFrom = tempTo;
    }
    var lastItem = this.tapRanges[(items.length - 1)];
    lastItem.to = lastItem.to + padding;
    this.width = lastItem.to;

    this.svg.width = this.width;
    this.svg.textItems = this.tapRanges;
  }

  createPanel() {
    let style = 'position:fixed; z-index:20000; top:0px; left:0px; width:' + window.innerWidth + 'px; ' + 'height:' + window.innerHeight + 'px;';
    let div = document.createElement('div');
    div.setAttribute('style', style);
    return div;
  }

}
