// ------------get elements------------

const notesContextMenu = document.getElementById("note_context_menu");
const notesContextMenuDelete = document.getElementById(
  "note_context_menu_delete"
);
const notesContextMenuRename = document.getElementById(
  "note_context_menu_rename"
);

const addNoteForm = document.getElementById("new_note_form");

// ------------event handler functions------------


const NewNoteSubmitFunction = (e) => {
  e.preventDefault();
  let title = addNoteForm.text.value;
  title = title ? title : "New note";
  addNote(new Note(title));
  addNoteForm.text.value = "";
};


const openNotesContextMenu = (e, id) => {
  e.preventDefault();
  e.stopPropagation();

  const close = (e) => {
    notesContextMenu.style.display = "none";
    document.removeEventListener("click", cancelContextMenu);
  };

  notesContextMenu.style.left = e.x + "px";
  notesContextMenu.style.top = e.y + "px";
  notesContextMenu.style.display = "block";
  const cancelContextMenu = document.addEventListener("click", close);

  notesContextMenuDelete.onclick = () => {
    deleteNote(id);
    close();
  };
  notesContextMenuRename.onclick = () => {
    openNotesEditMenu(id);
    close();
  };
};

// ------------apply event handlers------------

function applyEventHandlers() {
  addNoteForm.onsubmit = NewNoteSubmitFunction;
  notesContextMenu.onclick = (e) => {
    e.stopPropagation();
  };
  searchForm.onsubmit = searchFormSubmit;
}
