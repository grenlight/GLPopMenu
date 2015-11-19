import { IAnimation } from './IAnimation.js';
import { GLPoint } from './GLPoint.js';
import { GLSize } from './GLSize.js';

import { GLRect } from './GLRect.js';
import { GLCanvas } from './GLCanvas.js';

/**
*汽泡视图：应用于展示图文消息
*
*特点：
*
*单例；
*自负视图显隐；
*bubbleView 默认显示在点击区域的上方，上方的显示空间不够时显示在点击区域的下方
*显示时阻止 window 滚动及下层 html 的事件响应；
*点击 bubbleView 的其它区域时，bubbleView 消失；
*点击 bubbleView 上面时，消失并执行回调；
*/

let singleton = Symbol();
let singletonEnforcer = Symbol();

export class GLBubbleView extends IAnimation {
  constructor(enforcer) {
    if (enforcer !== singletonEnforcer) {
      throw 'GLBubbleView 是单例类，调用方法：GLBubbleView.sharedInstance()';
    } else {
      super();

      this.isShow = false;
      this.fontSize = 14;
      this.lineHeight = 16;
      //文本内容相关
      this.content = null;
      this.contentSize = GLSize.zero()
      this.contentMargin = [5, 7, 5, 7];
      this.contentDiv = this.createContentDiv();
      this.contentDiv.style.backgroundColor = '#ff0000';

      this.canvas = new GLCanvas();
      this.canvasSize = GLSize.zero();
      this.panel = this.createPanel(window.innerWidth, window.innerHeight);
      this.panel.appendChild(this.contentDiv);

      this.tappedHandler = (e) => {
        this.tapped(e);
      };

    }
  }

  static get sharedInstance() {
    if (!this[singleton]) {
      this[singleton] = new GLBubbleView(singletonEnforcer);
    }
    return this[singleton];
  }

  ifNeedsDisplay(text, position) {
    if (this.isShow === true) {
      this.hidden();
    } else {
      this.content = text;
      this.anglePosition = position;
      this.show();
    }
  }

  show() {
    this.isShow = true;

    let pixelLength = this.getTextPixelLength(this.content);
    this.updateContent(pixelLength);

    document.body.appendChild(this.panel);
    this.addEventListener();
  }

  hidden() {
    this.isShow = false;
    document.body.removeChild(this.panel);
    this.removeEventListener();
  }

  tapped() {
    this.hidden();
  }

  addEventListener() {
    this.panel.addEventListener('mouseup', this.tappedHandler, false);
    this.panel.addEventListener('touchend', this.tappedHandler, false);
  }

  removeEventListener() {
    this.panel.removeEventListener('mouseup', this.tappedHandler, false);
    this.panel.removeEventListener('touchend', this.tappedHandler, false);
  }

  updateContent(pixelLength) {
    if (pixelLength <= 100) {
      this.contentSize.width = pixelLength;
      this.contentSize.height = this.fontSize;
    } else if (pixelLength <= 200) {
      this.contentSize.width = 100;
      this.contentSize.height = this.lineHeight * 2;
    } else if (pixelLength <= 300) {
      this.contentSize.width = 100;
      this.contentSize.height = this.lineHeight * 3;
    } else {
      let w = pixelLength / 3;
      this.contentSize.width = w;
      this.contentSize.height = this.lineHeight * 3;
      if (w > 300) {
        this.contentSize.width = 300;
      }
    }
    this.contentDiv.innerHTML = this.content;
    this.contentDiv.style.width = this.contentSize.width + 'px';
    this.contentDiv.style.height = this.contentSize.height + 'px';
  }
  //取得字符串的总像素长度
  getTextPixelLength(str) {
    let pixelLength = 0;
    for (var index = 0; index < str.length; index++) {
      var char = str.charAt(index);
      var charCode = str.charCodeAt(index);
      if (this.isDbcCase(charCode)) {
        pixelLength += this.fontSize / 2;
      } else {
        pixelLength += this.fontSize;
      }
    }
    return pixelLength;
  }

  //判断字符是否为半角
  isDbcCase(c) {
    if (c >= 32 && c <= 127) {
      return true;
    } else if (c >= 65377 && c <= 65439) {
      return true;
    }
    return false;
  }

  createPanel(width, height) {
    let style = 'position:fixed; z-index:10000; top:0px; left:0px; background-color:blue; width:' + width + 'px; ' + 'height:' + height + 'px;';
    return this.createDiv(style);
  }

  createContentDiv() {
    let style = 'position:absolute; z-index:20000; overflow:hidden; word-wrap:break-word; padding:0px; color:#333333; font-size:' + this.fontSize + 'px; line-height:' + this.lineHeight + 'px; left:' + this.contentMargin[1] + 'px; top:' + this.contentMargin[0] + 'px;';
    return this.createDiv(style);
  }

  createDiv(style) {
    let div = document.createElement('div');
    div.setAttribute('style', style);
    return div;
  }

}

window.GLPoint = GLPoint;
window.GLBubbleView = GLBubbleView;
