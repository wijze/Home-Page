var notes = [];

const id = () =>
  new Date().getTime().toString(36) + Math.random().toString(36).slice(2);

function updateNotes() {
  fetch("/notes_endpoint")
    .then((res) => res.json())
    .then((jsonString) => {
      notes = JSON.parse(jsonString).notes;
      displayNotes();
    });
}

function displayNotes() {
  const notesContainer = document.getElementById("notes_container");
  notesContainer.innerHTML = "";

  Object.values(notes).forEach((note) => {
    const newNode = document.createElement("div");
    newNode.classList.add("note");
    const title = document.createElement("p");
    title.innerText = note.title;
    const deleteButton = document.createElement("button");
    deleteButton.innerText = "D";
    deleteButton.addEventListener("click", () => {
      deleteNote(note.id);
    });

    newNode.append(title, deleteButton);
    notesContainer.appendChild(newNode);
  });
}

function addNote(note) {
  notes[note.id] = note;
  fetch("/notes_endpoint", {
    method: "POST",
    body: JSON.stringify({
      note: note.getSavable(),
      action: "add",
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });

  displayNotes();
}

function deleteNote(id) {
  delete notes[id];
  fetch("/notes_endpoint", {
    method: "POST",
    body: JSON.stringify({
      id: id,
      action: "delete",
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });

  displayNotes();
}

includeCssFile("/app/notes/notes.css");
updateNotes();
document.title = "Home Page";

const addNoteForm = document.getElementById("new_note_form");
const submitFunction = e => {
  e.preventDefault();
  let title = addNoteForm.text.value;
  title = title ? title : "Untitled";
  addNote(new Note(title))
  addNoteForm.text.value = '';
}
addNoteForm.onsubmit = submitFunction;

class Note {
  constructor(title='', text='', tags='') {
    this.id = id();
    this.title = title;
    this.text = text;
    this.tags = tags;
  }

  getSavable() {
    return {
      id: this.id,
      title: this.title,
      text: this.text,
      tags: this.tags,
      todo: false,
      priority: 0,
    };
  }
}

class Todo extends Note {
  constructor(title, text, tags, priority) {
    super(title, text, tags);
    this.priority = priority;
  }

  getSavable() {
    obj = super.getSavable();
    obj.todo = true;
    obj.priority = this.priority;
    return obj;
  }
}
