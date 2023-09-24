const express = require('express');
const path = require('path');

const { handlePush, getNotes } = require('./endpoints/notes');

const app = express();
const port = 8000;

const autoOpen = false;

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'client')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index', 'index.html'));
});

app.get('/app', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'app', 'app.html'));
});
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'app', 'notes', 'notes.html'));
});

app.post('/notes_endpoint', (req, res) => {
  handlePush(req, res);
});
app.get('/notes_endpoint', (req, res) => {
  getNotes(req, res);
});

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'client', '404.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

if (autoOpen) {
  import ('open')
  .then((open) => open.default(`http://localhost:${port}`))
    .catch((error) => console.error(error));
}