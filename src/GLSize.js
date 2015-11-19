export class GLSize {
  constructor(width = 0, height = 0) {
    this.width = width;
    this.height = height;
  }

  static zero() {
    return new GLSize();
  }
}
