import { Color } from '../utils/Color.js';
import { IAnimation } from '../interaction/IAnimation.js';

export class IColorChange extends IAnimation {

  constructor(hexColor = '#fafafa') {
    //丢，阮一峰说babel已经支持new.target，实际上不支持
    // if (new.target === ColorChangeInterface) {
    //   throw new Error('ColorChangeInterface 是接口，不能实例化。');
    // }
    super();
    let color = Color.str2hex(hexColor);
    this.lastColor = color;
    this.currentColor = this.lastColor;
  }

  drawStaticColor() {}

  changeToColor(color) {
    let hex = Color.str2hex(color);

    this.lastColor = this.currentColor;
    this.currentColor = hex;

    this.stopAnimating();
    this.startAnimating();
  }


}
