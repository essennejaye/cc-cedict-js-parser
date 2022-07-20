const express = require('express');
const path = require('path');
const routes = require('./router');

const app = express();
const port = process.env.PORT || 3001;

app.use(express.static('public'));

app.use('/', routes);

app.listen(port, () => {
  console.log(`SERVER LISTENING ON PORT ${port}`);
});
