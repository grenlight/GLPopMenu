import { GLRect } from '../math/GLRect.js';

export class GLSVG {
  constructor() {
    //是不是尖角朝上
    this.isUpDirection = false;
    this.minWidth = 64;
    this.directionOffsetY = 0;

    this.textItems = null;
    this.frame = new GLRect(100, 100, 64, 48);

    //左右最小边距
    this.marginLeft = 5;
    this.marginRight = 5;

    this.screenWidth = window.innerWidth;
    this.maxFrameX = this.screenWidth - this.marginRight;
    this.angleOffsetX = 0;

    this.domElement = this.createSVGElement();
  }

  set width(value) {
    this.frame.width = value < this.minWidth ? this.minWidth : value;
    this.domElement.setAttribute('width', value);
  }

  setPosition(position) {
    this.frame.center = GLPoint.copy(position);
    let spaceHeight = this.frame.height + this.directionOffsetY;
    if (position.y < spaceHeight) {
      this.isUpDirection = true;
      this.frame.y = position.y + this.directionOffsetY;
    } else {
      this.isUpDirection = false;
      this.frame.y = position.y - spaceHeight;
    }
    //计算在 X 轴上 menu 的 frame（rect）在屏幕内
    let angleOffsetX = 0;
    if (this.frame.x < this.marginLeft) {
      angleOffsetX = this.frame.x - this.marginLeft;
      this.frame.x = this.marginLeft;
    } else if (this.frame.getMaxX() > this.maxFrameX) {
      angleOffsetX = this.frame.getMaxX() - this.maxFrameX;
      this.frame.x = this.maxFrameX - this.frame.width;
    }
    //校验尖角的偏移量
    this.angleOffsetX = this.validateAngleOffsetX(angleOffsetX);
    this.domElement.style.top = this.frame.y + 'px';
    this.domElement.style.left = this.frame.x + 'px';
    this.attachText();
    this.calculateBorder();
  }

  //校验尖角的偏移量
  validateAngleOffsetX(angleOffsetX) {
    let maxOffsetX = this.frame.halfWidth - 13;
    if (this.isUpDirection) {
      angleOffsetX *= (-1);
    }
    if (angleOffsetX < -maxOffsetX) {
      angleOffsetX = -maxOffsetX;
    } else if (angleOffsetX > maxOffsetX) {
      angleOffsetX = maxOffsetX;
    }
    return angleOffsetX;
  }

  attachText() {
    let textOffsetY = 21;

    if (this.isUpDirection) {
      textOffsetY = 21 + 16;
      this.backgroundGroup.setAttribute('transform', 'translate(' + this.frame.halfWidth + ', ' + this.frame.halfHeight + ') rotate(180) translate(' + this.frame.halfWidth * (-1) + ', ' + this.frame.halfHeight * (-1) + ')');
    } else {
      this.backgroundGroup.setAttribute('transform', 'rotate(0)');
    }
    let textNodes = this.textGroup.querySelectorAll('text');
    for (var i = 0; i < this.textItems.length; i++) {
      let node = textNodes[i];
      node.setAttribute('x', this.textItems[i].center);
      node.setAttribute('y', textOffsetY);
      node.textContent = this.textItems[i].text;
    }
  }

  calculateBorder() {
    let radius = 3;
    let trangleHeight = 6;
    let trangleWidth = 10;
    let minX = 0.5,
      maxX = this.frame.width - 1,
      minY = 0.5,
      maxY = 32;
    let angleCenterX = maxX / 2 + this.angleOffsetX;
    let borderPath = 'M' + (minX + radius) + ' ' + minY +
      ' L' + (maxX - radius) + ' ' + minY +
      ' A' + radius + ' ' + radius + ' 0 0 1 ' + maxX + ' ' + (minY + radius) +
      ' L' + maxX + ' ' + (maxY - radius) +
      ' A' + radius + ' ' + radius + ' 0 0 1 ' + (maxX - radius) + ' ' + maxY +
      //尖角
      // ' Q'+(midX)+' '+(maxY+trangleHeight/2)+' '+midX+' '+(maxY+trangleHeight);
      // ' A'+radius+' '+radius+' 0 0 1 '+midX+' '+(maxY+trangleHeight);
      ' L' + (angleCenterX + trangleWidth / 2) + ' ' + maxY +
      ' L' + (angleCenterX) + ' ' + (maxY + trangleHeight) +
      ' L' + (angleCenterX - trangleWidth / 2) + ' ' + (maxY) +

      ' L' + (minX + radius) + ' ' + maxY +
      ' A' + radius + ' ' + radius + ' 0 0 1 ' + minX + ' ' + (maxY - radius) +
      ' L' + minX + ' ' + (minY + radius) +
      ' A' + radius + ' ' + radius + ' 0 0 1 ' + (minX + radius) + ' ' + minY;

    this.borderPath.setAttribute('d', borderPath);
  }

  createSVGElement() {
    let svgNS = 'http://www.w3.org/2000/svg';
    let xlinkNS = 'http://www.w3.org/1999/xlink';

    function createElement(name) {
      return document.createElementNS(svgNS, name);
    }

    function setPosition(element, px, py) {
      element.setAttributeNS(null, 'x', px);
      element.setAttributeNS(null, 'y', py);
    }

    function setStyle(element, style) {
      element.setAttributeNS(null, 'style', style);
    }

    function setCommonAttri(element, id, width, height) {
      element.setAttributeNS(null, 'id', id);
      element.setAttributeNS(null, 'width', width);
      element.setAttributeNS(null, 'height', height);
    }

    function createUse(px, py, style) {
      let use = createElement('use');
      setPosition(use, px, py);
      setStyle(use, style);
      use.setAttributeNS(xlinkNS, 'href', '#border');
      return use;
    }

    let noSelect = '-webkit-touch-callout: none; -webkit-user-select: none;-khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;-webkit-tap-highlight-color: rgba(255, 255, 255, 0);';

    let svg = createElement('svg');
    setCommonAttri(svg, 'glpopmenu', this.minWidth, this.frame.height);
    setStyle(svg, 'cursor:hand; position: absolute; visibility:visiable;' + noSelect);

    let symbol = createElement('symbol');
    symbol.setAttributeNS(null, 'id', 'border');

    this.borderPath = document.createElementNS(svgNS, 'path');
    symbol.appendChild(this.borderPath);
    svg.appendChild(symbol);

    let defs = createElement('defs');
    let mask = createElement('mask');
    setCommonAttri(mask, 'alphaMask', '400', '48');

    let rect = createElement('rect');
    setCommonAttri(rect, 'rect', '400', '48');
    setStyle(rect, 'stroke:none; fill: #333333;' + noSelect);
    mask.appendChild(rect);
    defs.appendChild(mask);
    svg.appendChild(defs);

    //阴影
    let use0 = createUse('0', '2', 'fill:#000000;stroke-width:0; mask:url(#alphaMask);');
    let use1 = createUse('0', '0', 'fill:#555;stroke:#353535;stroke-width:1;');

    this.backgroundGroup = createElement('g');
    this.backgroundGroup.appendChild(use0);
    this.backgroundGroup.appendChild(use1);
    svg.appendChild(this.backgroundGroup);

    //文本节点,默认创建 6 个
    this.textGroup = createElement('g');
    setStyle(this.textGroup, 'font-size:16px;fill:#eeeeee;text-anchor: middle');
    for (let i = 0; i < 6; i++) {
      let text = createElement('text');
      text.setAttributeNS(null, 'x', '0');
      text.setAttributeNS(null, 'y', '21');
      this.textGroup.appendChild(text);
    }
    svg.appendChild(this.textGroup);
    return svg;
  }
}
