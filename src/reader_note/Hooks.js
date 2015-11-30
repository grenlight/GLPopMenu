import { NoteManager } from './NoteManager.js';

/**
*EPUBJS每次加载新的html时会调用
*/
EPUBJS.Hooks.register('beforeChapterDisplay').img = function(view) {
  let d = view.doc || view.document;

  NoteManager.sharedInstance.view = view;
  NoteManager.sharedInstance.document = d;
}

EPUBJS.Hooks.register('selected').a = function(view, continuous) {
  var d = view.document;
  var b = d.body;
  var canSelected = false;
  alert('what');
}
