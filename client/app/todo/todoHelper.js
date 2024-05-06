const groupWrapper = document.getElementById('groups_wrapper')

const boardElement = document.getElementById('board')
const boardNotOpenMessage = document.getElementById('board_not_open_message')

const newTodoTemplate = document.getElementById('newTodo')

const todoContextmenu = document.getElementById('todo_contextmenu')
const todoContextmenuDelete = document.getElementById('todo_contextmenu_delete')

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
        t.configure(parsed.todos[id]);
        todos[id] = t;
      }
      
      displaySidebar()
      displayBoard()
    });
}

const addTodo = (todo) => {
  todos[todo.id] = todo;
  sendData('/todo_endpoint', {
    todo: todo.getSavable(),
    action: 'addTodo',
  })

  displayBoard()
}

const displayBoard = () => {
  groupWrapper.innerHTML = ''

  if (currentBoardId == null){
    boardElement.style.display = "none"
    boardNotOpenMessage.style.display = "block"
    return
  }
  boardElement.style.display = "flex"
  boardNotOpenMessage.style.display = "none"

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

      const newTodoEl = newTodoTemplate.content.cloneNode(true);
      const newTodoButton = newTodoEl.firstElementChild
      const newTodoForm = newTodoEl.lastElementChild
      newTodoForm.style.display = "none"
      groupEl.appendChild(newTodoEl)
  
      const newTodoSubmit = () => {
        let name = newTodoForm.name.value;
        name = name ? name : "New Todo";
        addTodo(new Todo(g.id, name))
        newTodoForm.name.value = "";
      }
      addNewMenu(newTodoButton, newTodoForm, newTodoSubmit)

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