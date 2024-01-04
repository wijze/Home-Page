// ------------get elements------------

const addNoteForm = document.getElementById("new_note_form");

// ------------event handler functions------------


const NewNoteSubmitFunction = (e) => {
  e.preventDefault();
  let title = addNoteForm.text.value;
  title = title ? title : "New Note";
  addNote(new Note(title));
  addNoteForm.text.value = "";
};

// ------------apply event handlers------------

function applyEventHandlers() {
  addNoteForm.onsubmit = NewNoteSubmitFunction;
  searchForm.onsubmit = searchFormSubmit;
  newCategoryButton.onclick = openNewCategoryMenu;
}
