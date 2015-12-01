import { NoteManager } from './NoteManager.js';

export class NoteObject {
  constructor(parentEle, startContainerEle, endContainerEle, startOffset, endOffset, groupId, comment, text) {
    this.parent = parentEle;
    this.startContainer = startContainerEle;
    this.endContainer = endContainerEle;
    this.startOffset = startOffset;
    this.endOffset = endOffset;
    this.groupId = groupId;
    this.comment = comment;
    this.text = text;
  }

  static createByJSON(json) {
    let doc = NoteManager.sharedInstance.view.doc || NoteManager.sharedInstance.view.document;
    let parentEle = EPUBJS.DomUtil.findNode(doc.body, json.parent);
    let startContainer = EPUBJS.DomUtil.findNode(parentEle, json.startContainer);
    let endContainer = EPUBJS.DomUtil.findNode(parentEle, json.endContainer);

    return new NoteObject(parentEle, startContainer, endContainer, json.startOffset, json.endOffset, json.dataId, json.comment, json.text);
  }

  static createByRange(range, comment) {
    let text = range.toString();
    if (text.length == 0) {
      return null;
    }
    let parentEle = range.commonAncestorContainer;

    return new NoteObject(parentEle, range.startContainer, range.endContainer, range.startOffset, range.endOffset, EPUBJS.core.uuid(), comment, text);
  }

  getJSON() {
    let view = NoteManager.sharedInstance.view;
    let doc = view.doc || view.document;
    let position_parent = EPUBJS.DomUtil.getPosition(doc.body, this.parent);
    let position_start = EPUBJS.DomUtil.getPosition(this.parent, this.startContainer);
    let position_end = EPUBJS.DomUtil.getPosition(this.parent, this.endContainer);
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
      'dataId': this.groupId,
      'index': view.currentChapter.spinePos,
      'startContainer': position_start,
      'endContainer': position_end,
      'startOffset': this.startOffset,
      'endOffset': this.endOffset,
      'parent': position_parent,
      'time': new Date().getTime(),
      'text': this.text,
      'comment': this.comment,
      'chapterName': view.chapterName.innerText
    }
    return data;
  }
}
