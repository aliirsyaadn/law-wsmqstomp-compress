const express = require('express');
const upload = require('express-fileupload');
const v4 = require('uuid');

const app = express();

app.use(upload());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.post('/', async (req, res) => {
  if (req.files) {
    req.header('X-ROUTING-KEY', v4());
    console.log(req.headers);
    res.redirect(307, 'http://localhost:8080/upload');
  }
});

app.get('/progress', (req, res) => {
  res.sendFile(__dirname + '/public/progress.html');
});

let port = 8081;
app.listen(port, () => {
  console.log(`Running at localhost:${port}`);
});
