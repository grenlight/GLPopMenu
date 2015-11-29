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

}
