const groupWrapper = document.getElementById('groups_wrapper')

// should maybe be optimized to load only current board
function load(){
  fetch('/todo_endpoint')
    .then((res) => res.json())
    .then((jsonString) => {
      const parsed = JSON.parse(jsonString);
      boards = parsed.boards
      groups = parsed.groups
      for (let id in parsed.todos) {
        let t = new Todo();
        t.configure(parsed.notes[id]);
        todos[id] = t;
      }
      
      displaySidebar()
      // display board
    });
}

const displayBoard = () => {
  if (currentBoardId == null){
    // display message to create or open board
    return
  }

  Object.values(groups).forEach((g) => {
    if (g.board == currentBoardId){
      const groupEl = document.createElement("div")
      groupEl.classList.add("container", "group")
      const groupElName = document.createElement("h3")
      groupElName.innerText = g.name
      groupEl.appendChild(groupElName)

      Object.values(todos).forEach((t) => {
        if (t.group == g.id){
          const todoEl = document.createElement("div")
          todoEl.classList.add("container", "todo")
          todoEl.innerText = t.title
          groupEl.appendChild(todoEl)
        }
      })
      groupWrapper.appendChild(groupEl)
    }
  })
}

class Todo {
  constructor(group, title = '', text = '') {
    this.id = id();
    this.title = title;
    this.text = text;
    this.group = group
  }

  getSavable() {
    return {
      id: this.id,
      title: this.title,
      text: this.text,
      group: this.group
    };
  }

  configure(newConfig) {
    Object.assign(this, newConfig);
  }
}

class Group {
  constructor(board, name = '', place=0) {
    this.id = id();
    this.name = name;
    this.place = place
    this.board = board
  }

  getSavable() {
    return {
      id: this.id,
      name: this.name,
      place: this.place,
      board: this.board
    };
  }
}