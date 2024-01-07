var boards = {};
var groups = {};
var todos = {};

currentBoardId = null;

// ------------initial config ------------
document.title = "Home Page";
includeCssFile("/app/todo/todo.css");

createAddBoardMenu()
load()