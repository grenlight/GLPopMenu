export class GLPoint {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  static zero() {
    return new GLPoint();
  }

  static copy(p) {
    return new GLPoint(p.x, p.y);
  }

  isEqualTo(p) {
    return (p.x === this.x) && (p.y === this.y);
  }
}
