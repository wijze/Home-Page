const notesConfigForm = document.getElementById("note_config_form");

const notesConfigFormSubmitFunction = (id) => {
  let title = notesConfigForm.note_title.value;
  let text = notesConfigForm.note_text.value;
  updateNote(id, {
    title: title,
    text: text,
    tags: tags,
  });
};

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