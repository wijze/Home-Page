const id = () =>
  new Date().getTime().toString(36) + Math.random().toString(36).slice(2);


function getNotes() {
  fetch('/notes_endpoint')
    .then((res) => res.json())
    .then((jsonString) => {
      notes = JSON.parse(jsonString).notes;
      for (let id in notes) {
        let n = new Note();
        n.configure(notes[id]);
        notes[id] = n;
      }
      displayNotes();
    });
}

function addNote(note) {
  notes[note.id] = note;
  fetch('/notes_endpoint', {
    method: 'POST',
    body: JSON.stringify({
      note: note.getSavable(),
      action: 'add',
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });

  displayNotes();
}
  
function updateNote(id, newConfig) {
  notes[id].configure(newConfig);
  fetch('/notes_endpoint', {
    method: 'POST',
    body: JSON.stringify({
      note: notes[id].getSavable(),
      action: 'update',
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });

  displayNotes();
}


function deleteNote(id) {
  if (id == currentEditId) {
    closeEditMenu();
  }
  delete notes[id];
  fetch('/notes_endpoint', {
    method: 'POST',
    body: JSON.stringify({
      id: id,
      action: 'delete',
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });

  displayNotes();
}


function displayNotes(display_notes = notes) {
  const notesContainer = document.getElementById('notes_container');
  notesContainer.innerHTML = '';

  for (
    let i = 0;
    i < Math.min(Object.values(display_notes).length, currentMaxNotesVisible);
    i++
  ) {
    const note = Object.values(display_notes)[i];
    const newNode = document.createElement('div');
    newNode.classList.add('note');
    const title = document.createElement('p');
    title.innerText = note.title;
    const tag = document.createElement('span');
    tag.innerText = note.tags.length ? note.tags.length + '#' : '';

    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'D';
    deleteButton.addEventListener('click', (e) => {
      deleteNote(note.id);
      e.stopPropagation();
      e.preventDefault();
    });
    newNode.append(title, tag, deleteButton);

    newNode.oncontextmenu = (e) => {
      openNotesContextMenu(e, note.id);
    };
    newNode.onclick = (e) => {
      e.stopPropagation();
      openNotesEditMenu(note.id);
    };
    notesContainer.appendChild(newNode);
  }
  if (Object.values(display_notes).length > currentMaxNotesVisible) {
    const overflowElement = document.createElement('button');
    overflowElement.innerText = 'show more';
    overflowElement.onclick = () => {
      currentMaxNotesVisible += addNotesVisible;
      displayNotes();
    };
    notesContainer.appendChild(overflowElement);
  }
}


class Note {
  constructor(title = '', text = '', tags = []) {
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