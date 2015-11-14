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

  enterFarame() {
    this.requestAnimation();
  }

  requestAnimation() {
    this.animationHandler = requestAnimationFrame(() => {
      this.enterFarame();
    });
  }

  destory() {
    this.stopAnimating();
  }

}
