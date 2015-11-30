import { GLPoint } from './math/GLPoint.js';
import { GLSize } from './math/GLSize.js';
import { GLRect } from './math/GLRect.js';
import { IAnimation } from './interaction/IAnimation.js';

class GLEdgeInsets {
  constructor(top = 0, left = 0, bottom = 0, right = 0) {
    this.top = top;
    this.left = left;
    this.bottom = bottom;
    this.right = right;
  }
}
/**
*汽泡视图：应用于展示图文消息
*
*特点：
*
*单例；
*自负视图显隐,减小外部调用时的逻辑判断；
*bubbleView 默认显示在点击区域的上方，上方的显示空间不够时显示在点击区域的下方
*显示时阻止 window 滚动及下层 html 的事件响应；
*点击 bubbleView 的其它区域时，bubbleView 消失；
*点击 bubbleView 上面时，消失并执行回调；
*/
var Symbol = require('es6-symbol');
let singleton = Symbol();
let singletonEnforcer = Symbol();

export class GLBubbleView extends IAnimation {
  constructor(enforcer) {
    if (enforcer !== singletonEnforcer) {
      throw 'GLBubbleView 是单例类，调用方法：GLBubbleView.sharedInstance';
    } else {
      super();
      this.isShow = false;
      //是不是尖角朝上
      this.isUpDirection = false;
      this.directionOffsetY = 9;
      this.cornerRadius = 6;
      this.frame = new GLRect(0, 0, 100, 60);
      this.angleFrame = new GLRect(0, 0, 10, 7);
      //左右最小边距
      this.marginLeft = 5;
      this.marginRight = 5;
      this.maxFrameX = window.innerWidth - this.marginRight;

      this.fontSize = 16;
      this.lineHeight = 18;
      //文本内容相关
      this.content = null;
      this.contentSize = GLSize.zero()
      this.contentMargin = new GLEdgeInsets(12, 12, 10, 12);
      this.contentDiv = this.createContentDiv();

      this.panel = this.createPanel(window.innerWidth, window.innerHeight);
      this.panel.appendChild(this.contentDiv);

      this.initCanvas();

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

  /**
  *@param innerCallback {function}  点击发生在汽泡内时执行的回调
  *@param outerCallback {function}  点击发生在汽泡外时执行的回调
  */
  ifNeedsDisplay(text, position, innerCallback, outerCallback) {
    if (this.isShow === true) {
      this.hidden();
    } else {
      this.content = text;
      this.anglePosition = position;
      this.tappedInnerCallback = innerCallback;
      this.tappedOuterCallback = outerCallback;
      this.show();
    }
  }

  show() {
    this.isShow = true;
    this.currentAlpha = 0;
    let pixelLength = this.getTextPixelLength(this.content);
    this.updateContent(pixelLength);
    this.updateBubbleSize(this.anglePosition);
    this.updateBubbleGraph();
    document.body.appendChild(this.panel);
    this.addTapListener(this.panel, this.tappedHandler);
    this.startAnimating();
  }

  hidden() {
    this.isShow = false;
    this.removeTapListener(this.panel, this.tappedHandler);
    document.body.removeChild(this.panel);
    super.stopAnimating();
  }
  stopAnimating() {
    if (this.isShow === false) {
    } else {
      // this.panel.appendChild(this.contentDiv);
    }
  }

  enterFrame() {
    this.isAnimating = true;
    if (this.isShow === true) {
      this.currentAlpha += 0.07;
    } else {
      this.currentAlpha -= 0.09;
    }
    this.stage.alpha = this.currentAlpha;
    this.contentDiv.opacity = this.currentAlpha;

    this.renderer.render(this.stage);
    //边界条件检测
    if (this.currentAlpha < 0.0 || this.currentAlpha > 1.0) {
      this.currentAlpha = (this.currentAlpha < 0.0) ? 0 : 1;
      this.stopAnimating();
    } else {
      super.enterFrame();
    }
  }

  tapped(e) {
    e.preventDefault();
    let tp = this.getTouchedPosition(e);
    let point = new PIXI.Point(tp.x - window.pageXOffset, tp.y - window.pageYOffset)
    if (this.graphics.containsPoint(point)) {
      if (typeof this.tappedInnerCallback === 'function') {
        this.tappedInnerCallback();
      }
    } else {
      if (typeof this.tappedOuterCallback === 'function') {
        this.tappedOuterCallback();
      }
    }
    this.hidden();
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

      let maxWidth = 300 - this.contentMargin.left - this.contentMargin.right;
      if (w > maxWidth) {
        this.contentSize.width = maxWidth;
      }
    }
    this.contentDiv.innerHTML = this.content;
    this.contentDiv.style.width = this.contentSize.width + 'px';
    this.contentDiv.style.height = this.contentSize.height + 'px';
  }

  updateBubbleSize(position) {
    this.frame.width = this.contentSize.width + this.contentMargin.left + this.contentMargin.right;
    this.frame.height = this.contentSize.height + this.contentMargin.top + this.contentMargin.bottom;

    this.frame.x = position.x - this.frame.halfWidth;
    let spaceHeight = this.frame.height + this.directionOffsetY + this.angleFrame.height;
    if (position.y < spaceHeight) {
      this.isUpDirection = true;
      this.angleFrame.y = position.y + this.directionOffsetY;
      this.frame.y = this.angleFrame.y + this.angleFrame.height;
    } else {
      this.isUpDirection = false;
      this.frame.y = position.y - spaceHeight;
      this.angleFrame.y = this.frame.getMaxY();
    }
    //计算在 X 轴上 menu 的 frame（rect）在屏幕内
    this.angleFrame.x = (this.frame.width - this.angleFrame.width) / 2;
    if (this.frame.x < this.marginLeft) {
      this.angleFrame.x -= (this.marginLeft - this.frame.x);
      this.frame.x = this.marginLeft;
    } else if (this.frame.getMaxX() > this.maxFrameX) {
      this.angleFrame.x += (this.frame.getMaxX() - this.maxFrameX);
      this.frame.x = this.maxFrameX - this.frame.width;
    }
    //校验尖角的偏移量
    this.angleFrame.x = this.validateAngleOffsetX(this.angleFrame.x);
    this.angleFrame.x += this.frame.x;
    this.contentDiv.style.top = this.frame.y + this.contentMargin.top + 'px';
    this.contentDiv.style.left = this.frame.x + this.contentMargin.left + 'px';
  }

  //校验尖角的偏移量
  validateAngleOffsetX(angleOffsetX) {
    let maxOffsetX = this.frame.width - this.angleFrame.width - this.cornerRadius / 2;

    if (angleOffsetX > maxOffsetX) {
      angleOffsetX = maxOffsetX;
    } else if (angleOffsetX < this.cornerRadius) {
      angleOffsetX = this.cornerRadius;
    }
    return angleOffsetX;
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
    let style = 'position:fixed; z-index:10000; top:0px; left:0px; width:' + width + 'px; ' + 'height:' + height + 'px;';
    return this.createDiv(style);
  }

  createContentDiv() {
    let style = 'position:absolute; z-index:20000; overflow:auto; word-wrap:break-word; word-break:break-all; padding:0px; color:#252525; font-size:' + this.fontSize + 'px; line-height:' + this.lineHeight + 'px; left:' + this.contentMargin.left + 'px; top:' + this.contentMargin.top + 'px;';
    return this.createDiv(style);
  }

  createDiv(style) {
    let div = document.createElement('div');
    div.setAttribute('style', style);
    return div;
  }

  initCanvas() {
    this.renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, {
      transparent: true,
      resolution: window.devicePixelRatio
    });

    this.renderer.view.setAttribute('style', 'position:absolute; z-index:15000; left:0px; top:0px; width:' + window.innerWidth + 'px; height: ' + window.innerHeight + 'px');
    this.panel.appendChild(this.renderer.view);
    this.stage = new PIXI.Container();
    this.graphics = new PIXI.Graphics();
    this.shadow = new PIXI.Graphics();
  }

  updateBubbleGraph() {
    this.drawBubbleView(this.shadow, 0x000000);
    this.shadow.alpha = 0.1;
    this.drawBubbleView(this.graphics, 0xf8eab5);

    let offsetY = 2;
    if (this.isUpDirection) {
      offsetY = -2;
    }
    this.shadow.y = this.graphics.y + offsetY;

    this.stage.addChild(this.shadow);
    this.stage.addChild(this.graphics);
  }

  drawBubbleView(graphics, color) {
    graphics.clear();
    graphics.beginFill(color);
    graphics.drawRoundedRect(this.frame.x, this.frame.y, this.frame.width, this.frame.height, this.cornerRadius);

    let anglePointY, angleBottomY;
    if (this.isUpDirection) {
      anglePointY = this.angleFrame.y;
      angleBottomY = this.angleFrame.getMaxY();
    } else {
      anglePointY = this.angleFrame.getMaxY();
      angleBottomY = this.angleFrame.y;
    }
    graphics.moveTo(this.angleFrame.x, angleBottomY);
    graphics.lineTo(this.angleFrame.center.x, anglePointY);
    graphics.lineTo(this.angleFrame.getMaxX(), angleBottomY);
    graphics.endFill();
  }
}
