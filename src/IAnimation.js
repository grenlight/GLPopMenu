//动画接口
export class IAnimation {
  constructor() {
    this.animationHandler = null;
  }

  startAnimating() {
    this.requestAnimation();
  }

  stopAnimating() {
    cancelAnimationFrame(this.animationHandler);
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
