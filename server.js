const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 80;
const app = express();
const uniqid = require('uniqid')
const fs = require('fs')
const util = require('util')
const readFromFile = util.promisify(fs.readFile)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


app.get('/', (req, res) =>
res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
res.sendFile(path.join(__dirname, '/public/notes.html'))
);
app.get('/api/notes', (req, res) =>
readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)))
);

app.post('/api/notes', (req, res) => {
    const newNote = {
        title: req.body.title,
        text: req.body.text,
        id: uniqid()
    };
    readAndAppend(newNote, './db/db.json');
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)))
})

const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );

const readAndAppend = (content, file) => {
fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
    console.error(err);
    } else {
    const parsedData = JSON.parse(data);
    parsedData.push(content);
    writeToFile(file, parsedData);
    }
});
};

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);