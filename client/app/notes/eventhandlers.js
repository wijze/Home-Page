// ------------get elements------------

const notesContextMenu = document.getElementById("note_context_menu");
const notesContextMenuDelete = document.getElementById(
  "note_context_menu_delete"
);
const notesContextMenuRename = document.getElementById(
  "note_context_menu_rename"
);

const notesConfigForm = document.getElementById("note_config_form");
const addNoteForm = document.getElementById("new_note_form");
const searchForm = document.getElementById("search_notes_form");

// ------------event handler functions------------

const searchFormSubmit = (e) => {
  e.preventDefault();
  const searchQuery = searchForm.search.value;
  if (searchQuery == "") {
    displayNotes();
    return;
  }
  searchForm.search.value = "";

  let ranking = [];
  let parsedQuery = { title: "", tags: [] };
  for (const part of searchQuery.split("+")) {
    if (part.startsWith("#")) {
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
  title = title ? title : "New note";
  addNote(new Note(title));
  addNoteForm.text.value = "";
};

// does not save
const closeEditMenu = () => {
  notesConfigForm.style.right = "-25rem";
  currentEditId = null;
  document.onclick = null;
  notesConfigForm.onchange = null;
};

const updateNotesEditMenuTags = (remove) => {
  const tagsElement = document.getElementById("note_config_tags");
  tagsElement.innerHTML = "";
  for (const tag of tags) {
    const newElement = document.createElement("div");
    newElement.innerText = tag;
    const deleteButton = document.createElement("button");
    deleteButton.innerText = "D";
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
  notesConfigForm.style.right = "0px";
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
  document.addEventListener("click", closeEditMenu);
  notesConfigForm.onclick = (e) => {
    e.stopPropagation();
  };
  document.getElementById("note_config_close").onclick = (e) => {
    closeEditMenu();
  };
  document.getElementById("note_config_delete").onclick = () => {
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
    if (e.key === "Enter" && e.ctrlKey) {
      document.activeElement.blur();
      closeEditMenu();
    }
  };
  notesConfigForm.new_tag.onkeydown = (e) => {
    if (e.key === "Enter" && notesConfigForm.new_tag.value != "") {
      if (!tags.includes(notesConfigForm.new_tag.value)) {
        tags.push(notesConfigForm.new_tag.value);
        notesConfigFormSubmitFunction(id);
        updateNotesEditMenuTags(removeTag);
        notesConfigForm.new_tag.value = "";
      }
      notesConfigForm.new_tag.value = "";
    }
  };
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
