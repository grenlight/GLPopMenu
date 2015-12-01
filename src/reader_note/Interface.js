import { NoteManager } from './NoteManager.js';
import { NoteObject } from './NoteObject.js';

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
  let range = selectedRange.getRangeAt(0);
  if (!range) {
    // 试图从currentRange中读取数据
    range = NoteManager.sharedInstance.currentRangeClone;
  }
  let note = NoteObject.createByRange(range, comment);
  if (!note) {
    return;
  }
  var data = NoteManager.sharedInstance._applyInlineStyle(note, true);
  EPUBJS.core.postMessageToMobile('createNote', data);

  NoteManager.sharedInstance.noteList.add(note);
}

export function repaintNote(data) {
  if (!data || !(data instanceof Array) || data.length === 0) {
    return;
  }

  NoteManager.sharedInstance.noteList.clear();
  let view = NoteManager.sharedInstance.view;
  for (var i = 0; i < data.length; i++) {
    let noteJSON = data[i];

    if (noteJSON.index != undefined && noteJSON.index == view.currentChapter.spinePos) {
      let note = NoteObject.createByJSON(noteJSON);
      NoteManager.sharedInstance.noteList.add(note);
      //添加至任务队列 异步加载 此处页面并未显示 如果直接调用划线将不准确
      setTimeout(function() {
        NoteManager.sharedInstance._applyInlineStyle(note, false);
      }, 0)
    }
  }
}

export function updateNote(dataId, comment) {
  NoteManager.sharedInstance.noteList.update(dataId, comment);
  EPUBJS.core.postMessageToMobile('updateNote', true);
}

//配置背景颜色
export function configBackgroundColor(color) {

}
