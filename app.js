require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./routes/routes');
const PORT = process.env.PORT || 5000;
const app = express();
const path = require('path');
const rl = require('readline');

const db = process.env.MONGODB_URI || 'mongodb://localhost:27017/noter';
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => {
    return console.log('Connected to mongo database');
  })
  .catch(err => console.log('error with MongoDB', err));

routes(app);

app.listen(PORT, err => {
  if (err) console.log(err);
  console.log('app listening on: ', PORT);
});

app.use(express.json());
app.use(cors({ origin: '*' }));

app.options('*', cors({ origin: '*' }));
app.get('/', (req, res) => {
  res.status(200).json('Hey, this is my server!');
});

module.exports = app;