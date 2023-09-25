var notes = {};

const id = () =>
  new Date().getTime().toString(36) + Math.random().toString(36).slice(2);

// ------------note methods------------

function getNotes() {
  fetch("/notes_endpoint")
    .then((res) => res.json())
    .then((jsonString) => {
      notes = JSON.parse(jsonString).notes;
      for (let id in notes){
        let n = new Note()
        n.configure(notes[id])
        notes[id] = n
      }
      displayNotes();
    });
}

const openNotesContextMenu = (e, id) => {
  e.preventDefault();

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
    notesConfigForm.style.display = 'block'
    notesConfigForm.onsubmit = (e) => {
      notesConfigFormSubmitFunction(e, id)
    };
    close();
  };
  
};

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

    newNode.oncontextmenu = (e) => {
      openNotesContextMenu(e, note.id);
    };
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

function updateNote(id, newConfig) {
  notes[id].configure(newConfig);
  fetch("/notes_endpoint", {
    method: "POST",
    body: JSON.stringify({
      note: notes[id].getSavable(),
      action: "update",
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

// ------------functions performed on load------------

const notesContextMenu = document.getElementById("note_context_menu");
notesContextMenu.onclick = (e) => {
  e.stopPropagation();
};
const notesContextMenuDelete = document.getElementById(
  "note_context_menu_delete"
);
const notesContextMenuRename = document.getElementById(
  "note_context_menu_rename"
);

const notesConfigForm = document.getElementById("note_config_form");
const notesConfigFormSubmitFunction = (e, id) => {
  e.preventDefault();
  let title = notesConfigForm.note_title.value;
  updateNote(id, { title: title });
  notesConfigForm.style.display = 'none'
};

const addNoteForm = document.getElementById("new_note_form");
const submitFunction = (e) => {
  e.preventDefault();
  let title = addNoteForm.text.value;
  title = title ? title : "Untitled";
  addNote(new Note(title));
  addNoteForm.text.value = "";
};
addNoteForm.onsubmit = submitFunction;

includeCssFile("/app/notes/notes.css");
getNotes();
document.title = "Home Page";

// ------------classes------------

class Note {
  constructor(title = "", text = "", tags = "") {
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

  configure(newConfig) {
    Object.assign(this, newConfig);
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
