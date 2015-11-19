/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _IAnimationJs = __webpack_require__(1);

	var _GLPointJs = __webpack_require__(2);

	var _GLSizeJs = __webpack_require__(3);

	var _GLRectJs = __webpack_require__(4);

	var _GLCanvasJs = __webpack_require__(5);

	/**
	*汽泡视图：应用于展示图文消息
	*
	*特点：
	*
	*单例；
	*自负视图显隐；
	*bubbleView 默认显示在点击区域的上方，上方的显示空间不够时显示在点击区域的下方
	*显示时阻止 window 滚动及下层 html 的事件响应；
	*点击 bubbleView 的其它区域时，bubbleView 消失；
	*点击 bubbleView 上面时，消失并执行回调；
	*/

	var singleton = Symbol();
	var singletonEnforcer = Symbol();

	var GLBubbleView = (function (_IAnimation) {
	  _inherits(GLBubbleView, _IAnimation);

	  function GLBubbleView(enforcer) {
	    var _this = this;

	    _classCallCheck(this, GLBubbleView);

	    if (enforcer !== singletonEnforcer) {
	      throw 'GLBubbleView 是单例类，调用方法：GLBubbleView.sharedInstance()';
	    } else {
	      _get(Object.getPrototypeOf(GLBubbleView.prototype), 'constructor', this).call(this);

	      this.isShow = false;
	      this.fontSize = 14;
	      this.lineHeight = 16;
	      //文本内容相关
	      this.content = null;
	      this.contentSize = _GLSizeJs.GLSize.zero();
	      this.contentMargin = [5, 7, 5, 7];
	      this.contentDiv = this.createContentDiv();
	      this.contentDiv.style.backgroundColor = '#ff0000';

	      this.canvas = new _GLCanvasJs.GLCanvas();
	      this.canvasSize = _GLSizeJs.GLSize.zero();
	      this.panel = this.createPanel(window.innerWidth, window.innerHeight);
	      this.panel.appendChild(this.contentDiv);

	      this.tappedHandler = function (e) {
	        _this.tapped(e);
	      };
	    }
	  }

	  _createClass(GLBubbleView, [{
	    key: 'ifNeedsDisplay',
	    value: function ifNeedsDisplay(text, position) {
	      if (this.isShow === true) {
	        this.hidden();
	      } else {
	        this.content = text;
	        this.anglePosition = position;
	        this.show();
	      }
	    }
	  }, {
	    key: 'show',
	    value: function show() {
	      this.isShow = true;

	      var pixelLength = this.getTextPixelLength(this.content);
	      this.updateContent(pixelLength);

	      document.body.appendChild(this.panel);
	      this.addEventListener();
	    }
	  }, {
	    key: 'hidden',
	    value: function hidden() {
	      this.isShow = false;
	      document.body.removeChild(this.panel);
	      this.removeEventListener();
	    }
	  }, {
	    key: 'tapped',
	    value: function tapped() {
	      this.hidden();
	    }
	  }, {
	    key: 'addEventListener',
	    value: function addEventListener() {
	      this.panel.addEventListener('mouseup', this.tappedHandler, false);
	      this.panel.addEventListener('touchend', this.tappedHandler, false);
	    }
	  }, {
	    key: 'removeEventListener',
	    value: function removeEventListener() {
	      this.panel.removeEventListener('mouseup', this.tappedHandler, false);
	      this.panel.removeEventListener('touchend', this.tappedHandler, false);
	    }
	  }, {
	    key: 'updateContent',
	    value: function updateContent(pixelLength) {
	      if (pixelLength <= 100) {
	        this.contentSize.width = pixelLength;
	        this.contentSize.height = this.fontSize;
	      } else if (pixelLength <= 200) {
	        this.contentSize.width = 100;
	        this.contentSize.height = this.lineHeight * 2;
	      } else if (pixelLength <= 300) {
	        this.contentSize.width = 100;
	        this.contentSize.height = this.lineHeight * 3;
	      } else {
	        var w = pixelLength / 3;
	        this.contentSize.width = w;
	        this.contentSize.height = this.lineHeight * 3;
	        if (w > 300) {
	          this.contentSize.width = 300;
	        }
	      }
	      this.contentDiv.innerHTML = this.content;
	      this.contentDiv.style.width = this.contentSize.width + 'px';
	      this.contentDiv.style.height = this.contentSize.height + 'px';
	    }

	    //取得字符串的总像素长度
	  }, {
	    key: 'getTextPixelLength',
	    value: function getTextPixelLength(str) {
	      var pixelLength = 0;
	      for (var index = 0; index < str.length; index++) {
	        var char = str.charAt(index);
	        var charCode = str.charCodeAt(index);
	        if (this.isDbcCase(charCode)) {
	          pixelLength += this.fontSize / 2;
	        } else {
	          pixelLength += this.fontSize;
	        }
	      }
	      return pixelLength;
	    }

	    //判断字符是否为半角
	  }, {
	    key: 'isDbcCase',
	    value: function isDbcCase(c) {
	      if (c >= 32 && c <= 127) {
	        return true;
	      } else if (c >= 65377 && c <= 65439) {
	        return true;
	      }
	      return false;
	    }
	  }, {
	    key: 'createPanel',
	    value: function createPanel(width, height) {
	      var style = 'position:fixed; z-index:10000; top:0px; left:0px; background-color:blue; width:' + width + 'px; ' + 'height:' + height + 'px;';
	      return this.createDiv(style);
	    }
	  }, {
	    key: 'createContentDiv',
	    value: function createContentDiv() {
	      var style = 'position:absolute; z-index:20000; overflow:hidden; word-wrap:break-word; padding:0px; color:#333333; font-size:' + this.fontSize + 'px; line-height:' + this.lineHeight + 'px; left:' + this.contentMargin[1] + 'px; top:' + this.contentMargin[0] + 'px;';
	      return this.createDiv(style);
	    }
	  }, {
	    key: 'createDiv',
	    value: function createDiv(style) {
	      var div = document.createElement('div');
	      div.setAttribute('style', style);
	      return div;
	    }
	  }], [{
	    key: 'sharedInstance',
	    get: function get() {
	      if (!this[singleton]) {
	        this[singleton] = new GLBubbleView(singletonEnforcer);
	      }
	      return this[singleton];
	    }
	  }]);

	  return GLBubbleView;
	})(_IAnimationJs.IAnimation);

	exports.GLBubbleView = GLBubbleView;

	window.GLPoint = _GLPointJs.GLPoint;
	window.GLBubbleView = GLBubbleView;

/***/ },
/* 1 */
/***/ function(module, exports) {

	//动画接口
	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var IAnimation = (function () {
	  function IAnimation() {
	    _classCallCheck(this, IAnimation);

	    this.animationHandler = null;
	    this.isAnimating = false;
	  }

	  _createClass(IAnimation, [{
	    key: "startAnimating",
	    value: function startAnimating() {
	      this.isAnimating = true;
	      this.requestAnimation();
	    }
	  }, {
	    key: "stopAnimating",
	    value: function stopAnimating() {
	      cancelAnimationFrame(this.animationHandler);
	      this.isAnimating = false;
	    }
	  }, {
	    key: "enterFrame",
	    value: function enterFrame() {
	      this.requestAnimation();
	    }
	  }, {
	    key: "requestAnimation",
	    value: function requestAnimation() {
	      var _this = this;

	      this.animationHandler = requestAnimationFrame(function () {
	        _this.enterFrame();
	      });
	    }
	  }, {
	    key: "destory",
	    value: function destory() {
	      this.stopAnimating();
	    }
	  }]);

	  return IAnimation;
	})();

	exports.IAnimation = IAnimation;

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var GLPoint = (function () {
	  function GLPoint() {
	    var x = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
	    var y = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

	    _classCallCheck(this, GLPoint);

	    this.x = x;
	    this.y = y;
	  }

	  _createClass(GLPoint, [{
	    key: "isEqualTo",
	    value: function isEqualTo(p) {
	      return p.x === this.x && p.y === this.y;
	    }

	    //转换点的位置，p的参考系从 this.parent 转到 this
	  }, {
	    key: "converPoint",
	    value: function converPoint(p) {
	      return new GLPoint(p.x - this.x, p.y - this.y);
	    }
	  }], [{
	    key: "zero",
	    value: function zero() {
	      return new GLPoint();
	    }
	  }, {
	    key: "copy",
	    value: function copy(p) {
	      return new GLPoint(p.x, p.y);
	    }
	  }]);

	  return GLPoint;
	})();

	exports.GLPoint = GLPoint;

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var GLSize = (function () {
	  function GLSize() {
	    var width = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
	    var height = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

	    _classCallCheck(this, GLSize);

	    this.width = width;
	    this.height = height;
	  }

	  _createClass(GLSize, null, [{
	    key: "zero",
	    value: function zero() {
	      return new GLSize();
	    }
	  }]);

	  return GLSize;
	})();

	exports.GLSize = GLSize;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _GLPointJs = __webpack_require__(2);

	var GLRect = (function () {
	  function GLRect() {
	    var x = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
	    var y = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
	    var w = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
	    var h = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];

	    _classCallCheck(this, GLRect);

	    this._x = x;
	    this._y = y;
	    this._width = w;
	    this._height = h;
	    this.halfWidth = w / 2.0;
	    this.halfHeight = h / 2.0;
	    this._center = new _GLPointJs.GLPoint(x + this.halfWidth, y + this.halfHeight);
	  }

	  _createClass(GLRect, [{
	    key: 'setPosition',
	    value: function setPosition(value) {
	      this.x = value.x;
	      this.y = value.y;
	    }
	  }, {
	    key: 'getPosition',
	    value: function getPosition() {
	      return new _GLPointJs.GLPoint(this.x, this.y);
	    }
	  }, {
	    key: 'getMaxX',
	    value: function getMaxX() {
	      return this.x + this._width;
	    }
	  }, {
	    key: 'getMaxY',
	    value: function getMaxY() {
	      return this.y + this._height;
	    }

	    //转换点的位置，p的参考系从 this.parent 转到 this
	  }, {
	    key: 'converPoint',
	    value: function converPoint(p) {
	      return new _GLPointJs.GLPoint(p.x - this.x, p.y - this.y);
	    }
	  }, {
	    key: 'convertRect',
	    value: function convertRect(rect) {
	      return new GLRect(rect.x - this.x, rect.y - this.y, rect.width, rect.height);
	    }
	  }, {
	    key: 'center',
	    set: function set(value) {
	      this._center = value;
	      this._x = this._center.x - this.halfWidth;
	      this._y = this._center.y - this.halfHeight;
	    },
	    get: function get() {
	      return this._center;
	    }
	  }, {
	    key: 'width',
	    set: function set(value) {
	      this._width = value;
	      this.halfWidth = value / 2.0;
	      this._center.x = this._x + this.halfWidth;
	    },
	    get: function get() {
	      return this._width;
	    }
	  }, {
	    key: 'height',
	    set: function set(value) {
	      this._height = value;
	      this.halfHeight = value / 2.0;
	      this._center.y = this._y + this.halfHeight;
	    },
	    get: function get() {
	      return this._height;
	    }
	  }, {
	    key: 'x',
	    set: function set(value) {
	      this._x = value;
	      this._center.x = this._x + this.halfWidth;
	    },
	    get: function get() {
	      return this._x;
	    }
	  }, {
	    key: 'y',
	    set: function set(value) {
	      this._y = value;
	      this._center.y = this._y + this.halfHeight;
	    },
	    get: function get() {
	      return this._y;
	    }
	  }]);

	  return GLRect;
	})();

	exports.GLRect = GLRect;

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var GLCanvas = (function () {
	  function GLCanvas() {
	    _classCallCheck(this, GLCanvas);

	    this.domElement = this.createElement();
	    this.ctx = this.domElement.getContext('2d');
	  }

	  _createClass(GLCanvas, [{
	    key: 'drawBubble',
	    value: function drawBubble(size, anglePosition) {
	      this.bubbleSize = size;
	    }
	  }, {
	    key: 'createElement',
	    value: function createElement() {
	      var elem = document.createElement('canvas');
	      var pixelRatio = window.devicePixelRatio;
	      var w = 300,
	          h = 120;
	      elem.width = w * pixelRatio;
	      elem.height = h * pixelRatio;
	      elem.style.width = w + 'px';
	      elem.style.height = h + 'px';

	      // this.ctx.scale(pixelRatio, pixelRatio);
	      return elem;
	    }
	  }]);

	  return GLCanvas;
	})();

	exports.GLCanvas = GLCanvas;

/***/ }
/******/ ]);