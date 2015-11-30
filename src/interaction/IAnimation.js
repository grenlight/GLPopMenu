import { GLPoint } from '../math/GLPoint.js';

//动画接口
export class IAnimation {
  constructor() {
    this.animationHandler = null;
    this.isAnimating = false;
  }

  startAnimating() {
    this.isAnimating = true;
    this.requestAnimation();
  }

  stopAnimating() {
    cancelAnimationFrame(this.animationHandler);
    this.isAnimating = false;
  }

  enterFrame() {
    this.requestAnimation();
  }

  requestAnimation() {
    this.animationHandler = requestAnimationFrame(() => {
      this.enterFrame();
    });
  }

  addTapListener(element, handler) {
    element.addEventListener('mouseup', handler, false);
    element.addEventListener('touchend', handler, false);
  }

  removeTapListener(element, handler) {
    element.removeEventListener('mouseup', handler, false);
    element.removeEventListener('touchend', handler, false);
  }

  destory() {
    this.stopAnimating();
  }

  getTouchedPosition(e) {
    if (e.pageX) {
      return new GLPoint(e.pageX, e.pageY);
    } else {
      return new GLPoint(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
    }
  }

}
