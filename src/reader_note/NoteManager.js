import { GLPopMenu } from '../GLPopMenu.js';
import { GLBubbleView } from '../GLBubbleView.js';
import { createNoteIconButton, createLineElement } from './ElementGenerator.js';
import { getDivData, resolveDivData, resolveCommentIcon } from './Calculator.js';

var Symbol = require('es6-symbol');
let singleton = Symbol();
let singletonEnforcer = Symbol();

export class NoteManager {
  constructor(enforcer) {
    if (enforcer !== singletonEnforcer) {
      throw 'NoteManager NoteManager.sharedInstance';
    } else {
      this.view = null;
      this.document = null;
      this.currentRangeClone = null;
      this.height = 40;
      //当前操作的group
      this.currentGroupID = null;
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
  }

  static get sharedInstance() {
    if (!this[singleton]) {
      this[singleton] = new NoteManager(singletonEnforcer);
    }
    return this[singleton];
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
  _applyInlineStyle(text, comment, startContainer, endContainer, startOffset, endOffset, parent, needStore, dataId) {
    var self_ = this;

    //获取所有的textNode
    var textNodes = EPUBJS.DomUtil.getAllTextNode(parent);
    //找到所有选中文字的坐标信息
    var coordinate = EPUBJS.DomUtil.getCoordinate(startContainer, endContainer, startOffset, endOffset, textNodes);
    //解析坐标信息(几行？每行的宽度 和高度？及其显示位置？)
    var divDatas = getDivData(coordinate);
    // 根据解析来的坐标信息创建出div信息
    var divs = resolveDivData(divDatas);
    // 创建小圆点 如果 comment为null or "" icon为null
    var icon = resolveCommentIcon.call(self_, divDatas[divDatas.length - 1], comment, divs[0].groupId);
    for (var i = 0; i < divs.length; i++) {
      self_.document.body.appendChild(divs[i]);
    }
    if (icon)
      self_.document.body.appendChild(icon);
    // 将数据回传外层
    if (needStore) {
      var position_parent = EPUBJS.DomUtil.getPosition(self_.document.body, parent);
      var position_start = EPUBJS.DomUtil.getPosition(parent, startContainer);
      var position_end = EPUBJS.DomUtil.getPosition(parent, endContainer);
      var uuid = divs[0].groupId;
      /**
       * 返回data含义
        '{"dataId":"9bc1b40b-eafa-44f1-8e11-86e2751b757f",'此条笔记的id
      '"index":2,' 此条笔记所在的html对应页面的index
      '"startContainer":[6,9],' 此条笔记对应的开始节点 从 body元素找起 第一层的第六个元素，第二层的第9个元素
      '"endContainer":[8,1],' 此条笔记对应的开始节点 从 body元素找起 第一层的第六个元素，第二层的第9个元素
      '"startOffset":81,"endOffset":144,' 在起始节点中的文字偏移量
      '"parent":[2],' 起始节点与中止节点公共父元素（直接父元素）位置信息
      '"time":1445755306203,'+ note创建时间
      '"tag":"comment",'+ 此条笔记属于评论（还有 underline 与 copy 对应不同的操作）
          //选中的纯文本信息
      '"text":"篇4种，课文全部经过调整，部分课文完全重写，一些小知识也相应更新，同时采纳读者建议，增设生词表，方便读者查阅。《中文在手》系列丛书主要面向来华旅游、学习、工作的外国人和希望学习汉语、了解中国的外国朋友。整套丛书注重实用性、趣味性，兼顾科学性，突出时代感。所展示的日常交际用语和实用情景对话，基本可以满足外国人在中国的日常交际需要。该丛书既可以作为汉语实用交际手册，又可以作为专题式短期汉语教材使用。",'+
          //评论内容(tag为comment时才有)
      '"comment":"ddddddd"}';
       */
      var data = {
        dataId: uuid,
        index: self_.view.currentChapter.spinePos,
        'startContainer': position_start,
        'endContainer': position_end,
        'startOffset': startOffset,
        'endOffset': endOffset,
        'parent': position_parent,
        'time': new Date().getTime(),
        'tag': 'comment',
        'text': text,
        'comment': comment,
        'chapterName': self_.view.chapterName.innerText
      }
      return data;
    }
  }

}
