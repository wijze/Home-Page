const path = require('path');
const fs = require('fs');

const notesFilePath = path.join(__dirname, '../', 'data', 'notes.json');

function getNotes(_, res) {
  fs.readFile(notesFilePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading file.');
    } else {
      res.json(data);
    }
  });
}

function handlePush(req, res) {
  fs.readFile(notesFilePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading file.');
    } else {
      let json = JSON.parse(data);
      let action = req.body.action

      if (action == 'addNote') {
        json.notes[req.body.note.id] = req.body.note;
      } else if (action == 'deleteNote') {
        delete json.notes[req.body.id];
      } else if (action == 'updateNote') {
        json.notes[req.body.note.id] = req.body.note;
      } else if (action == "addCategory") {
        json.categories[req.body.category.id] = req.body.category
      } else if (action == 'deleteCategory') {
        delete json.categories[req.body.id];
      } else {
        res.status(400).send('invalid action: '+action);
        return;
      }
      json = JSON.stringify(json, null, 2);

      fs.writeFile(notesFilePath, json, (err) => {
        if (err) {
          res.status(500).send('Error writing to file.');
          return;
        }
      });
      res.sendStatus(200);
    }
  });
}

module.exports = { 'getNotes': getNotes, 'handleNotePush': handlePush };