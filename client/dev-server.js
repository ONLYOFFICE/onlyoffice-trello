const http = require('http');
const path = require('path');
const express = require('express');
const cors = require('cors');

function main() {
  const app = express();
  const server = http.createServer(app);
  app.use(
    cors({
      origin: ['https://trello.com', '*'],
    }),
  );
  app.set('trust proxy', 1);
  app.use(express.static(path.join(__dirname, 'dist')));
  server.listen(6541, () => {
    console.log('Serving static files');
  });
  app.use((req, res, next) => {
    if (req.path.split('/').length > 2) {
      res.redirect('/');
      return;
    }
    next();
  });
  app.all('*', (_, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

main();
