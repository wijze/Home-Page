const newBoardButton = document.getElementById('create_new_board')
const newBoardForm = document.getElementById('new_board_form')

const boardsWrapper = document.getElementById('siderbar_boards')

const newBoardSubmit = () => {
  let name = form.name.value;
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