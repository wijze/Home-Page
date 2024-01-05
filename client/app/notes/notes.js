// global variables
var currentMaxNotesVisible = 5;
const addNotesVisible = 5;

var notes = {};
var categories = {};
var currentEditId = null;
var currenCategoryId = "all"

// ------------initial config ------------
document.title = "Home Page";
includeCssFile("/app/notes/notes.css");

getNotes();
applyEventHandlers();
