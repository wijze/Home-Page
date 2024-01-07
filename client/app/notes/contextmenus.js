const notesContextMenu = document.getElementById("note_context_menu");
const notesContextMenuDelete = document.getElementById(
  "note_context_menu_delete"
);
const notesContextMenuRename = document.getElementById(
  "note_context_menu_rename"
);

const categoryContextMenu = document.getElementById('category_context_menu')
const categoryContextMenuDelete = document.getElementById(
  "category_context_menu_delete"
);

const openNotesContextMenu = (e, id) => {
  const close = openContextMenu(e, notesContextMenu)

  notesContextMenuDelete.onclick = () => {
    deleteNote(id);
    close();
  };
  notesContextMenuRename.onclick = () => {
    openNotesEditMenu(id);
    close();
  };
};

const openCategoryContextMenu = (e, id) => {
  const close = openContextMenu(e, categoryContextMenu)
  categoryContextMenuDelete.onclick = () => {
    deleteCategory(id)
    close()
  }
}