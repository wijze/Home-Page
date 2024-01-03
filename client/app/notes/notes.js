var currentMaxNotesVisible = 5;
const addNotesVisible = 5;

var notes = {};
var currentEditId = null;
var tags = [];

const id = () =>
  new Date().getTime().toString(36) + Math.random().toString(36).slice(2);

// ------------get elements------------

const notesContextMenu = document.getElementById('note_context_menu');
const notesContextMenuDelete = document.getElementById(
  'note_context_menu_delete'
);
const notesContextMenuRename = document.getElementById(
  'note_context_menu_rename'
);

const notesConfigForm = document.getElementById('note_config_form');
const addNoteForm = document.getElementById('new_note_form');
const searchForm = document.getElementById('search_notes_form');

// ------------note methods------------

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

// ------------event handler functions------------

const searchFormSubmit = (e) => {
  e.preventDefault();
  const searchQuery = searchForm.search.value;
  if (searchQuery == '') {
    displayNotes();
    return;
  }
  searchForm.search.value = '';

  let ranking = [];
  let parsedQuery = { title: '', tags: [] };
  for (const part of searchQuery.split('+')) {
    if (part.startsWith('#')) {
      parsedQuery.tags.push(part.slice(1));
    } else {
      parsedQuery.title = part;
    }
  }
  for (const note of Object.values(notes)) {
    let score = 0;
    if (note.title.toLowerCase().includes(parsedQuery.title.toLowerCase())) {
      score += 1000;
      score -= note.title.length;
    }
    for (const tag of parsedQuery.tags) {
      lowercase_tags = note.tags.map((tag) => {
        tag.toLowerCase();
      });
      if (lowercase_tags.includes(tag.toLowerCase())) {
        score += 10;
      }
    }
    ranking.push([note.id, score]);
  }
  ranking.sort((a, b) => b[1] - a[1]);
  ranking.slice(0, currentMaxNotesVisible);
  let final_notes = {};
  for (const note of ranking) {
    final_notes[note[0]] = notes[note[0]];
  }
  notes = final_notes;
  displayNotes();
};

const notesConfigFormSubmitFunction = (id) => {
  let title = notesConfigForm.note_title.value;
  let text = notesConfigForm.note_text.value;
  updateNote(id, {
    title: title,
    text: text,
    tags: tags,
  });
};

const NewNoteSubmitFunction = (e) => {
  e.preventDefault();
  let title = addNoteForm.text.value;
  title = title ? title : 'New note';
  addNote(new Note(title));
  addNoteForm.text.value = '';
};

// does not save
const closeEditMenu = () => {
  notesConfigForm.style.right = '-25rem';
  currentEditId = null;
  document.onclick = null;
  notesConfigForm.onchange = null;
};

const updateNotesEditMenuTags = (remove) => {
  const tagsElement = document.getElementById('note_config_tags');
  tagsElement.innerHTML = '';
  for (const tag of tags) {
    const newElement = document.createElement('div');
    newElement.innerText = tag;
    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'D';
    deleteButton.onclick = () => {
      remove(tag);
    };
    newElement.appendChild(deleteButton);
    tagsElement.appendChild(newElement);
  }
};

const openNotesEditMenu = (id) => {
  closeEditMenu();
  currentEditId = id;
  notesConfigForm.style.right = '0px';
  notesConfigForm.note_title.value = notes[id].title;
  notesConfigForm.note_text.value = notes[id].text;
  tags = notes[id].tags;

  const removeTag = (tag) => {
    let i = tags.indexOf(tag);
    if (i >= 0) {
      tags.splice(i, 1);
      updateNotesEditMenuTags(removeTag);
      notesConfigFormSubmitFunction(id);
    }
  };
  updateNotesEditMenuTags(removeTag);

  // ways to close menu
  document.addEventListener('click', closeEditMenu);
  notesConfigForm.onclick = (e) => {
    e.stopPropagation();
  };
  document.getElementById('note_config_close').onclick = (e) => {
    closeEditMenu();
  };
  document.getElementById('note_config_delete').onclick = () => {
    deleteNote(id);
  };

  // save/ submit
  notesConfigForm.onchange = () => {
    notesConfigFormSubmitFunction(id);
  };
  notesConfigForm.onsubmit = (e) => {
    e.preventDefault();
  };
  notesConfigForm.onkeydown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      document.activeElement.blur();
      closeEditMenu();
    }
  };
  notesConfigForm.new_tag.onkeydown = (e) => {
    if (e.key === 'Enter' && notesConfigForm.new_tag.value != '') {
      if (!tags.includes(notesConfigForm.new_tag.value)) {
        tags.push(notesConfigForm.new_tag.value);
        notesConfigFormSubmitFunction(id);
        updateNotesEditMenuTags(removeTag);
        notesConfigForm.new_tag.value = '';
      }
      notesConfigForm.new_tag.value = '';
    }
  };
};

const openNotesContextMenu = (e, id) => {
  e.preventDefault();
  e.stopPropagation();

  const close = (e) => {
    notesContextMenu.style.display = 'none';
    document.removeEventListener('click', cancelContextMenu);
  };

  notesContextMenu.style.left = e.x + 'px';
  notesContextMenu.style.top = e.y + 'px';
  notesContextMenu.style.display = 'block';
  const cancelContextMenu = document.addEventListener('click', close);

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

addNoteForm.onsubmit = NewNoteSubmitFunction;
notesContextMenu.onclick = (e) => {
  e.stopPropagation();
};
searchForm.onsubmit = searchFormSubmit;

// ------------other initial config ------------

includeCssFile('/app/notes/notes.css');
getNotes();
document.title = 'Home Page';

// ------------classes------------

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
