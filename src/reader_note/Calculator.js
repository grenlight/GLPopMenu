import { NoteManager } from './NoteManager.js';
import { createNoteIconButton, createLineElement } from './ElementGenerator.js';

/**
 * 通过解析所有字的坐标信息 获取矩形区域的信息
 * 返回 二维数组[][]
 */
export function getDivData(coors) {
  let begin_y = coors[0].y;
  var divData = [coors[0]];
  var divDatas = [];
  if (coors.length === 1) {
    divDatas.push(divData);
    return divDatas;
  }
  for (var i = 1; i < coors.length; i++) {
    var coor = coors[i];
    var y = coor.y;
    if (begin_y === y) {
      divData.push(coor);
    } else {
      divDatas.push(divData);
      divData = [coors[i]];
      begin_y = coors[i].y;
    }
    if (i === coors.length - 1) {
      divDatas.push(divData);
    }
  }
  return divDatas;
}

/**
 * 创建矩形区域
 */
export function resolveDivData(divDatas, groupId) {
  if (!divDatas || divDatas.length === 0) {
    return null;
  }

  //笔记区域点击后的回调
  var callback = function(evt) {
    evt.preventDefault();
    evt.stopPropagation();

    NoteManager.sharedInstance.currentGroupID = evt.target.groupId;
    //show menu
    var rect = evt.target.getBoundingClientRect();
    var offsetY = NoteManager.sharedInstance.view.render.padding.top;
    var position = new GLPoint(rect.left + rect.width / 2, rect.top + offsetY);
    NoteManager.sharedInstance.popMenu.ifNeedsDisplay(position);
  }

  var divs = [];
  for (var i = 0; i < divDatas.length; i++) {
    var div = createLineElement(groupId, divDatas[i]);
    div.addEventListener('touchend', callback, false);
    divs.push(div);
  }

  return divs;
}


/**
 * 创建划线笔记后的小圆点
 */
export function resolveCommentIcon(data, comment, groupId) {
  if (!comment || comment.trim().length === 0) {
    return null;
  }
  var self_ = this;
  var icon = createNoteIconButton(groupId);
  icon.addEventListener('touchend', function(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    NoteManager.sharedInstance.currentGroupID = groupId;
    let newComment = NoteManager.sharedInstance.noteList.getComment(groupId);
    var rect = icon.getBoundingClientRect();
    var offsetY = NoteManager.sharedInstance.view.render.padding.top;
    var position = new GLPoint(rect.left + 7, rect.top + 7 + offsetY);
    GLBubbleView.sharedInstance.ifNeedsDisplay(newComment, position, NoteManager.sharedInstance.editANote, null);

  }, false);

  if (data.length == 1) {
    icon.style.top = Math.floor(data[0].y + data[0].height / 2) - 6 + 'px';
    icon.style.left = (NoteManager.sharedInstance.view.chapterPos - 1) * NoteManager.sharedInstance.view.pageWidth + data[0].x + data[0].width + 'px';
  } else {
    icon.style.top = Math.floor(data[data.length - 1].y + data[data.length - 1].height / 2) - 6 + 'px';
    icon.style.left = (NoteManager.sharedInstance.view.chapterPos - 1) * NoteManager.sharedInstance.view.pageWidth + data[data.length - 1].x + data[data.length - 1].width + 'px';
  }
  return icon;
}
