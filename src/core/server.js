import express from 'express';
import { Server } from 'ws';
import config from '../сonfig';

const path = require('path');

const PORT = process.env.PORT || config.localPort;
const INDEX = path.join(process.env.PWD, 'index.html');

const server = express()
  .use((req, res) => res.sendFile(INDEX))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const wss = new Server({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (data) => {
    console.log('received: %s', data);
    wss.clients.forEach((client) => {
      if (client !== ws) client.send(data);
    });
  });

  ws.on('close', () => console.log('Client disconnected'));
});

export default wss;
