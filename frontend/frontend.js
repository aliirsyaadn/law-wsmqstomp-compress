const express = require('express');
const upload = require('express-fileupload');
const axios = require('axios');

const app = express();

app.use(upload());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.post('/', (req, res) => {
  if (req.files) {
    res.redirect(307, 'http://localhost:8080/upload');
  }
});

let port = 8081;
app.listen(port, () => {
  console.log(`Running at localhost:${port}`);
});
