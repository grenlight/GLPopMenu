import { GLRect } from './GLRect.js';

export class GLSVG {
  constructor() {
    //是不是尖角朝上
    this.isUpDirection = false;
    this.minWidth = 64;
    this.directionOffsetY = 5;

    this.textItems = null;
    this.parentElement = null;
    this.frame = new GLRect(100, 100, 64, 54);

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

  setPosition(parentElement, position) {
    // console.log(this.domElement.getElementById('borderPath'));
    if (parentElement !== this.parentElement) {
      if (this.parentElement) {
        this.parentElement.removeChild(this.domElement);
      }
      parentElement.appendChild(this.domElement);
      this.parentElement = parentElement;
    }

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
    this.domElement.style.top = this.frame.y;
    this.domElement.style.left = this.frame.x;

    this.calculateBorder();
    this.attachText();

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
    let backgroundGroup = this.domElement.getElementById('backgroundGroup');
    let textOffsetY = 23;

    if (this.isUpDirection) {
      textOffsetY = 23 + 17;
      backgroundGroup.setAttribute('transform', 'translate(' + this.frame.halfWidth + ', ' + this.frame.halfHeight + ') rotate(180) translate(' + this.frame.halfWidth * (-1) + ', ' + this.frame.halfHeight * (-1) + ')');
    } else {
      backgroundGroup.setAttribute('transform', 'rotate(0)');
    }
    let testGroup = this.domElement.getElementById('group');
    var textNodes = testGroup.querySelectorAll('text');
    for (var i = 0; i < this.textItems.length; i++) {
      let node = textNodes[i];
      node.setAttribute('x', this.textItems[i].center);
      node.setAttribute('y', textOffsetY);
      node.textContent = this.textItems[i].text;
    }
  }

  calculateBorder() {
    let radius = 3;
    let trangleHeight = 8;
    let trangleWidth = 12;
    let minX = 0.5,
      maxX = this.frame.width - 1,
      minY = 0.5,
      maxY = 36;
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


    let borderElement = this.domElement.getElementById('borderPath');
    borderElement.setAttribute('d', borderPath);
  }

  createSVGElement() {
    let elem = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    elem.setAttributeNS(null, 'id', 'glpopmenu');
    elem.setAttributeNS(null, 'x', 0);
    elem.setAttributeNS(null, 'y', 0);
    elem.setAttributeNS(null, 'width', this.minWidth);
    elem.setAttributeNS(null, 'height', this.frame.height);
    elem.setAttributeNS(null, 'style', 'cursor:hand;display:block;z-index:10000; position: absolute; visibility:visiable;');
    elem.innerHTML = `
          <symbol id="border">
            <path  id="borderPath" d="M3.5 0.5 L256 0.5 A3 3 0 0 1 259 3.5 L259 33 A3 3 0 0 1 256 36 L135.5 36 L129.5 44 L123.5 36 L3.5 36 A3 3 0 0 1 0.5 33 L0.5 3.5 A3 3 0 0 1 3.5 0.5" />
          </symbol>
          <defs>
            <mask id="alphaMask" x="0" y="0" width="400" height="54">
              <rect x="0" y="0" width="400" height="54" style="stroke:none; fill: #333333" />
            </mask>
          </defs>
          <g id="backgroundGroup" transform="rotate(0)">
            <!-- 阴影 -->
            <use xlink:href="#border" x="0" y="3" style="fill:#000000;stroke-width:0; mask:url(#alphaMask); " />
            <use xlink:href="#border" x="0" y="0" style="fill:#555;stroke:#353535;stroke-width:1;" />
          </g>

          <g id="group" style="font-size:16px;fill:#eeeeee;text-anchor: middle">
            <!-- 动态插入进来的文本节点在Safari上无法显示，故事先创建好文本节点 -->
            <text x="0" y="23" ></text>
            <text x="0" y="23" ></text>
            <text x="0" y="23" ></text>
            <text x="0" y="23" ></text>
            <text x="0" y="23" ></text>
            <text x="0" y="23" ></text>
            <text x="0" y="23" ></text>
          </g>
        `;
    return elem;
  }
}
