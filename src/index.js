import { GLPoint } from './math/GLPoint.js';
import { GLPopMenu } from './GLPopMenu.js';
import { GLBubbleView } from './GLBubbleView.js';

window.GLPoint = GLPoint;
window.GLPopMenu = GLPopMenu;
window.GLBubbleView = GLBubbleView;
window.GLBubbleView.sharedInstance;

import { textCopied, getText, createNote, repaintNote, updateNote } from './reader_note/Interface.js';

window.EPUBJS.BookInterface = {};
EPUBJS.BookInterface.textCopied = textCopied;
EPUBJS.BookInterface.getText = getText;
EPUBJS.BookInterface.createNote = createNote;
EPUBJS.BookInterface.repaintNote = repaintNote;
EPUBJS.BookInterface.updateNote = updateNote;
EPUBJS.BookInterface
export * from './reader_note/Hooks.js';
