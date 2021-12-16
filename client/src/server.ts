import dotenv from 'dotenv';
dotenv.config();
import http from 'http';
import express from 'express';
import cors from 'cors';
import path from 'path';

function main() {
  const app = express();
  const server = http.createServer(app);

  app.use(
    cors({
      origin: ['https://trello.com', '*'],
    })
  );
  app.set('trust proxy', 1);
  app.use(express.static(path.join(__dirname, '..', 'dist')));
  server.listen(process.env.PORT, () => {
    console.log('Ready to serve React static');
  });

  app.use((req, res, next) => {
    if (req.path.split('/').length > 2) {
      res.redirect('/');
      return;
    }
    next();
  });

  app.all('*', (_, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'dist', 'index.html'));
  });
}

main();
