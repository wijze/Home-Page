const path = require('path');
const fs = require('fs');

const todoFilePath = path.join(__dirname, '../', 'data', 'todo.json');

function getTodo(_, res) {
  fs.readFile(todoFilePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading file.');
    } else {
      res.json(data);
    }
  });
}

function handlePush(req, res) {
  fs.readFile(todoFilePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading file.');
    } else {
      let json = JSON.parse(data);
      let action = req.body.action

      if (action == 'addTodo') {
        json.todos[req.body.todo.id] = req.body.todo;
      } else if (action == 'deleteTodo') {
        delete json.todos[req.body.id];
      } else if (action == 'updateTodo') {
        json.todos[req.body.todo.id] = req.body.todo;
      } else if (action == "addBoard") {
        json.boards[req.body.board.id] = req.body.board
      } else if (action == 'deleteBoard') {
        delete json.boards[req.body.id];
      } else {
        res.status(400).send('invalid action: '+action);
        return;
      }
      json = JSON.stringify(json, null, 2);

      fs.writeFile(todoFilePath, json, (err) => {
        if (err) {
          res.status(500).send('Error writing to file.');
          return;
        }
      });
      res.sendStatus(200);
    }
  });
}

module.exports = { 'getTodo': getTodo, 'handleTodoPush': handlePush };