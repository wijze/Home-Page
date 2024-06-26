function getNotes() {
  fetch('/notes_endpoint')
    .then((res) => res.json())
    .then((jsonString) => {
      const parsed = JSON.parse(jsonString);
      categories = parsed.categories
      for (let id in parsed.notes) {
        let n = new Note();
        n.configure(parsed.notes[id]);
        notes[id] = n;
      }
      displayNotes();
      displayCategories();
    });
}

function addNote(note) {
  note.category = currenCategoryId
  notes[note.id] = note;
  sendData('/notes_endpoint', {
    note: note.getSavable(),
    action: 'addNote',
  })

  displayNotes();
}
  
function updateNote(id, newConfig) {
  notes[id].configure(newConfig);
  sendData('/notes_endpoint', {
    note: notes[id].getSavable(),
    action: 'updateNote',
  })

  displayNotes();
}


function deleteNote(id) {
  if (id == currentEditId) {
    closeEditMenu();
  }
  delete notes[id];
  sendData('/notes_endpoint', {
    id: id,
    action: 'deleteNote',
  })

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
    if (!(note.category == currenCategoryId || currenCategoryId == "all")){
      continue
    }

    // create the element
    const newNode = document.createElement('div');
    newNode.classList.add('note');
    const title = document.createElement('p');
    title.innerText = note.title;
    const tag = document.createElement('span');
    tag.innerText = note.tags.length ? note.tags.length + '#' : '';

    // add delete button
    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'D';
    deleteButton.addEventListener('click', (e) => {
      deleteNote(note.id);
      e.stopPropagation();
      e.preventDefault();
    });
    newNode.append(title, tag, deleteButton);

    // add other event handlers
    newNode.oncontextmenu = (e) => {
      openNotesContextMenu(e, note.id);
    };
    newNode.onclick = (e) => {
      e.stopPropagation();
      openNotesEditMenu(note.id);
    };

    // make element draggable
    newNode.draggable = true
    newNode.ondragstart = (e) => {
      e.dataTransfer.setData("source", note.id)
    }
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

function addCategory(category) {
  categories[category.id] = category;
  sendData('/notes_endpoint', {
    category: category.getSavable(),
    action: 'addCategory',
  })

  displayCategories()
}

function deleteCategory(id) {
  delete categories[id];
  sendData('/notes_endpoint', {
    id: id,
    action: 'deleteCategory',
  })
  
  if (id == currenCategoryId){
    setActiveCategory("all")
    // setActiveCategory already updates
  } else {
    displayCategories()
  }
}


class Category {
  constructor(name) {
    this.name = name
    this.id = id()
  }

  getSavable(){
    return {
      id:this.id,
      name:this.name
    }
  }
}

class Note {
  constructor(title = '', text = '', tags = [], category="all") {
    this.id = id();
    this.title = title;
    this.text = text;
    this.tags = tags;
    this.category = category
  }

  getSavable() {
    return {
      id: this.id,
      title: this.title,
      text: this.text,
      tags: this.tags,
      category: this.category
    };
  }

  configure(newConfig) {
    Object.assign(this, newConfig);
  }
}