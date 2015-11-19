export class GLCanvas {
  constructor() {
    this.domElement = this.createElement();
    this.ctx = this.domElement.getContext('2d');

  }

  drawBubble(size, anglePosition) {
    this.bubbleSize = size;

  }

  createElement() {
    let elem = document.createElement('canvas');
    let pixelRatio = window.devicePixelRatio;
    let w = 300,
      h = 120;
    elem.width = w * pixelRatio;
    elem.height = h * pixelRatio;
    elem.style.width = w + 'px';
    elem.style.height = h + 'px';

    // this.ctx.scale(pixelRatio, pixelRatio);
    return elem;
  }
}
