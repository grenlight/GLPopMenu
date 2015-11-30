import { NoteManager } from './NoteManager.js';

export function textCopied() {
  let selectedRange = EPUBJS.DomUtil.getSelection(NoteManager.sharedInstance.view);
  let range = selectedRange.getRangeAt(0);
  let text = range.toString();
  EPUBJS.core.postMessageToMobile('textCopy', text);
}

export function getText() {
  var selectedRange = EPUBJS.DomUtil.getSelection(NoteManager.sharedInstance.view);
  let range = selectedRange.getRangeAt(0);
  let text = range.toString();

  NoteManager.sharedInstance.currentRangeClone = range.cloneRange();
  EPUBJS.core.postMessageToMobile('selectedText', text);
}

export function createNote(comment) {
  var selectedRange = EPUBJS.DomUtil.getSelection(NoteManager.sharedInstance.view);
  var startContainer, endContainer, startOffset, endOffset, parent;
  let range = selectedRange.getRangeAt(0);
  if (!range) {
    // 试图从currentRange中读取数据
    range = NoteManager.sharedInstance.currentRangeClone;
  }
  let text = range.toString();
  if (text.length == 0) {
    return;
  }
  startContainer = range.startContainer;
  endContainer = range.endContainer;
  parent = range.commonAncestorContainer;
  startOffset = range.startOffset;
  endOffset = range.endOffset;
  var data = NoteManager.sharedInstance._applyInlineStyle(text, comment, startContainer, endContainer, startOffset, endOffset, parent, true);
  EPUBJS.core.postMessageToMobile('createNote', data);
}

export function repaintNote(data) {
  var view = NoteManager.sharedInstance.view;
  var d = view.doc;
  if (!data || !(data instanceof Array)) {
    return;
  }
  if (data.length == 0)
    return;
  for (var i = 0; i < data.length; i++) {
    var note = data[i];
    if (note.index != undefined && note.index == view.currentChapter.spinePos) {
      // menu.setDocument(view.doc || view.document);
      var parentEle = EPUBJS.DomUtil.findNode(d.body, note.parent);
      var startContainerEle = EPUBJS.DomUtil.findNode(parentEle, note.startContainer);
      var endContainerEle = EPUBJS.DomUtil.findNode(parentEle, note.endContainer);
      var startOffset = note.startOffset;
      var endOffset = note.endOffset;
      var tag = note.tag;
      var comment = note.comment;
      var text = note.text;
      //添加至任务队列 异步加载 此处页面并未显示 如果直接调用划线将不准确
      setTimeout(function() {
        NoteManager.sharedInstance._applyInlineStyle(text, comment, startContainerEle, endContainerEle, startOffset, endOffset, parentEle, false, note.dataId);
      }, 0)
    }
  }
}

export function updateNote(dataId, comment) {
  NoteManager.sharedInstance.updateNote(dataId, comment);
  EPUBJS.core.postMessageToMobile('updateNote', true);
}
