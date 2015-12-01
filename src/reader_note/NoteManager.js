import { GLPopMenu } from '../GLPopMenu.js';
import { GLBubbleView } from '../GLBubbleView.js';
import { getDivData, resolveDivData, resolveCommentIcon } from './Calculator.js';
import { NoteList } from './NoteList.js';

var Symbol = require('es6-symbol');
let singleton = Symbol();
let singletonEnforcer = Symbol();

export class NoteManager {
  constructor(enforcer) {
    if (enforcer !== singletonEnforcer) {
      throw 'Need use NoteManager.sharedInstance to access.';
    } else {
      this.view = null;
      this.document = null;
      this.currentRangeClone = null;
      this.height = 40;
      //当前操作的group
      this.currentGroupID = null;
      this.noteList = new NoteList();
      this.configPopMenu();
    }
  }

  static get sharedInstance() {
    if (!this[singleton]) {
      this[singleton] = new NoteManager(singletonEnforcer);
    }
    return this[singleton];
  }

  configPopMenu() {
    this.popMenu = GLPopMenu.instance;
    this.popMenu.setMenuItems([{
      'text': '编辑',
      'callback': this.editANote.bind(this)
    },
      {
        'text': '删除',
        'callback': this.deleteANote.bind(this)
      }]);
  }

  setSelectionRange(range_) {
    this.range = range_;
  }
  getSelectionRange() {
    return this.range;
  }


  //删除一条笔记
  deleteANote() {
    this.clearInlineStyle(this.currentGroupID);
    EPUBJS.core.postMessageToMobile('deleteNote', this.currentGroupID);
  }

  //编辑一条笔记
  editANote() {
    EPUBJS.core.postMessageToMobile('editNote', NoteManager.sharedInstance.currentGroupID);
  }

  //更新页面上的笔记
  updateNote(groupId, comment) {
    var treeWalker = this.document.createTreeWalker(this.document.body, NodeFilter.SHOW_ELEMENT, {
      acceptNode: function(node) {
        if (node.tagName.toLowerCase().trim() === 'div' && node.groupId == groupId) {
          return NodeFilter.FILTER_ACCEPT;
        } else {
          return NodeFilter.FILTER_SKIP;
        }
      }
    }, false);
    while (treeWalker.nextNode()) {
      node = treeWalker.currentNode;
      node.data = comment;
    }
  }
  /**
   * 清除笔记
     @param 此条笔记的uuid(dataId)
   */
  clearInlineStyle(groupId) {
    var treeWalker = this.document.createTreeWalker(this.document.body, NodeFilter.SHOW_ELEMENT, {
      acceptNode: function(node) {
        if (node.tagName.toLowerCase().trim() === 'div' && node.groupId == groupId) {
          return NodeFilter.FILTER_ACCEPT;
        } else {
          return NodeFilter.FILTER_SKIP;
        }
      }
    }, false);
    var divs = [];
    while (treeWalker.nextNode()) {
      let node = treeWalker.currentNode;
      divs.push(node);
    }
    for (var i = 0; i < divs.length; i++) {
      var div = divs[i];
      div.parentElement.removeChild(div);
    }
  }

  /**
   * 划线
     @param text 选中的纯文本
     @param comment 选中文本的笔记信息 可为null
     @param startContainer 起始节点 / Range.startContainer
     @param endContainer 终止节点 / Range.endContainer
     @param startOffset 起始节点中的偏移量 Range.startOffset
     @param endOffset 终止节点中的偏移量 Range.endOffset
     @param parent 起始节点与终止节点的共同直接父元素 Range.commonAncestorContainer
     @param needStore 当前划线信息是否需要存储 重绘的线不需要 新增的笔记需要存储 true 存储｜false 不存储
   */
  _applyInlineStyle(note, needStore) {
    //获取所有的textNode
    var textNodes = EPUBJS.DomUtil.getAllTextNode(note.parent);
    //找到所有选中文字的坐标信息
    var coordinate = EPUBJS.DomUtil.getCoordinate(note.startContainer, note.endContainer, note.startOffset, note.endOffset, textNodes);
    //解析坐标信息(几行？每行的宽度 和高度？及其显示位置？)
    var divDatas = getDivData(coordinate);
    // 根据解析来的坐标信息创建出div信息
    var divs = resolveDivData(divDatas, note.groupId);
    // 创建小圆点 如果 comment为null or "" icon为null
    var icon = resolveCommentIcon(divDatas[divDatas.length - 1], note.comment, note.groupId);
    for (var i = 0; i < divs.length; i++) {
      this.document.body.appendChild(divs[i]);
    }
    if (icon)
      this.document.body.appendChild(icon);
    // 将数据回传外层
    if (needStore) {
      return note.getJSON();
    }
  }

}
