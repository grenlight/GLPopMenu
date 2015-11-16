# 类似 iOS UIMenuController 的上下文菜单

---

基于 ECMAScript2015 + SVG 实现。

## 代码说明

> GLPoint, GLRect 是自定义的俩个数据类型，用于辅助坐标计算；

> GLSVG 实现 svg 图形的绘制；

> IAnimation 定义动画接口；

## 调用方法

``` javascript
GLPopMenu.instance
.setMenuItems([{'text':'书摘', 'callback': digest}
,...]);

GLPopMenu.instance
.ifNeedsDisplay(parentElement, position);
```
