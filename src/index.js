import { GLPoint } from './math/GLPoint.js';
import { GLPopMenu } from './GLPopMenu.js';
import { GLBubbleView } from './GLBubbleView.js';
import { FreeFallingEffect } from './reader_backgroundColor/FreeFallingEffect.js';

window.GLPoint = GLPoint;
window.GLPopMenu = GLPopMenu;
window.GLBubbleView = GLBubbleView;
window.GLBubbleView.sharedInstance;
window.FreeFallingEffect = FreeFallingEffect;

import { textCopied, getText, createNote, repaintNote, updateNote, configBackgroundColor } from './reader_note/Interface.js';

window.EPUBJS.BookInterface = {};
EPUBJS.BookInterface.textCopied = textCopied;
EPUBJS.BookInterface.getText = getText;
EPUBJS.BookInterface.createNote = createNote;
EPUBJS.BookInterface.repaintNote = repaintNote;
EPUBJS.BookInterface.updateNote = updateNote;
EPUBJS.BookInterface.configBackgroundColor = configBackgroundColor;

export * from './reader_note/Hooks.js';
