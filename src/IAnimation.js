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

  destory() {
    this.stopAnimating();
  }

}
