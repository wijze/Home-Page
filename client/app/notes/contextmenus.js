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

const openContextMenu = (e, el) => {
  e.preventDefault();
  e.stopPropagation();

  el.onclick = (e) => {
    e.stopPropagation()
  };

  const close = (e) => {
    el.style.display = "none";
    document.removeEventListener("click", close);
  };

  el.style.left = e.x + "px";
  el.style.top = e.y + "px";
  el.style.display = "block";
  document.addEventListener("click", close);
  return close
}

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