export class NoteList {
  constructor() {
    this.list = [];
  }

  clear() {
    this.list = [];
  }

  add(note) {
    this.list[note.groupId] = note;
    console.log(this.list);
  }

  update(groupId, comment) {
    let note = this.list[groupId];
    note.comment = comment;
  }

  delete(groupId) {
    this.list[note.groupId] = null;
  }

  getComment(groupId) {
    let note = this.list[groupId];
    return note.comment;
  }

  getNote(groupId) {
    return this.list[groupId];
  }
}
