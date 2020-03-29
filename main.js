'use strict';

const http = require('http');
const parser = require('./parser.js');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';
const ps = new parser();

// App
const app = http.createServer();
app.on('request', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  await ps.getAll();
  ps.res.retreived = new Date();
  res.end(JSON.stringify(ps.res));
});

app.listen(PORT, HOST);