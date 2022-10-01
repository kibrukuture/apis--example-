const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
//

const app = express();
// app.use(express.json());
app.use(
  express.raw({
    inflate: true,
    limit: '50mb',
    type: () => true,
  })
);
app.use(express.text());
app.use(express.json());

// supports text, json, & raw
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public'));
let status;
let logged_in = false;
// "304" reaches to a server.
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public/index.html'));
});
app.get('/log-in', (req, res) => {
  if (logged_in) {
    res.redirect('/access');
    status = true;
  } else res.sendFile(path.resolve(__dirname, 'public/login.html'));
});
app.get('/access', (req, res, next) => {
  //  catch error

  if (!logged_in) res.redirect('/log-in');
  else res.render('access', { status });
});

app.post('/log-in', (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  if (email && password) {
    logged_in = true;
    res.redirect('/access');
  } else res.send('password and email should be provided');
});

app.get('/log-out', (req, res) => {
  logged_in = false;
  res.render('log-out');
});
app.get('/file-upload', (req, res) => {
  res.render('file-upload');
});

app.post('/file-upload-handler', (req, res) => {
  console.log(req.body);
});

app.post('/pdf', (req, res) => {
  console.log(req.body);

  // res.send('we received the application');

  fs.createWriteStream(path.join(__dirname, 'public/home.jpg')).write(req.body);
  console.log('reaching here.....');
  setTimeout(() => {
    res.send('I am reaching here....');
  }, 1000);
});
app.get('/downloads', (req, res) => {
  res.render('download');
});

app.listen(3000, () => console.log('server started'));

// todo: ....get func goes hre
