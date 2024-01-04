// global variables
var currentMaxNotesVisible = 5;
const addNotesVisible = 5;

var notes = {};
var currentEditId = null;

// ------------initial config ------------
document.title = "Home Page";
includeCssFile("/app/notes/notes.css");

getNotes();
applyEventHandlers();
