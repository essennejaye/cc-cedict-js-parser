const express = require('express');
const path = require('path');
const routes = require('./router');
const mongoose = require('mongoose');
require('dotenv').config();

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

const app = express();
const port = process.env.PORT || 3001;

app.use(express.static('public'));

app.use('/', routes);

app.listen(port, () => {
  console.log(`SERVER LISTENING ON PORT ${port}`);
});
