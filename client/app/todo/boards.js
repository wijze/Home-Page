const newBoardButton = document.getElementById('create_new_board')
const newBoardForm = document.getElementById('new_board_form')

const sidebarBoardsWrapper = document.getElementById('siderbar_boards')

const sidebarBoardContextMenu = document.getElementById('board_context_menu')
const sidebarBoardContextMenuDelete = document.getElementById('board_context_menu_delete')

const addBoard = (board) => {
  boards[board.id] = board;
  sendData('/todo_endpoint', {
    board: board.getSavable(),
    action: 'addBoard',
  })

  displaySidebar()
}

function deleteBoard(id) {
  delete boards[id];
  sendData('/todo_endpoint', {
    id: id,
    action: 'deleteBoard',
  })
  
  if (id == currentBoardId){
    setActiveBoard(null)
    // setActiveBoard already updates
  } else {
    displaySidebar()
  }
}

const setActiveBoard = (id) => {
  currentBoardId = id
  displaySidebar()
  // update todos
}

const openBoardContextMenu = (e, id) => {
  const close = openContextMenu(e, sidebarBoardContextMenu)
  sidebarBoardContextMenuDelete.onclick = () => {
    deleteBoard(id)
    close()
  }
}

const displaySidebar = () => {
  sidebarBoardsWrapper.innerHTML = ''

  Object.values(boards).forEach((b) => {
    const el = document.createElement("div")
    el.classList.add("sidebar_board")
    const elName = document.createElement("p")
    elName.innerText = b.name
    el.appendChild(elName)

    // apply event handlers
    el.oncontextmenu = (e) => openBoardContextMenu(e, b.id)
    if (b.id == currentBoardId) {
      el.id == "active_board"
    } else {
      el.onclick = () => setActiveBoard(b.id)
    }

    sidebarBoardsWrapper.appendChild(el)
  })

}

const newBoardSubmit = () => {
  let name = newBoardForm.name.value;
  name = name ? name : "New Board";
  addBoard(new Board(name))
  newBoardForm.name.value = "";
};

const createAddBoardMenu = () => addNewMenu(newBoardButton, newBoardForm, newBoardSubmit)

class Board {
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