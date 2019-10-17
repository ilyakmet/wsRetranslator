import WebSocket from 'ws';
import server from './server';
import config from '../сonfig';
import start from '..';

const address = (server.address().address === '::') ? config.locaWss : server.address().address;

const startConnection = () => {
  const ws = new WebSocket(config.demoserver);

  const wss = new WebSocket(`${address}:${server.address().port}`);

  let db;
  let idStack;

  const generateId = (eventId) => {
    const len = config.idLen - eventId.length;
    return `${eventId}-${'0'.repeat(len)}`;
  };

  const getEvents = () => {
    const req = '{"cmd": "getEvents"}';
    ws.send(req);
  };

  const getData = (eventId) => {
    const reqId = generateId(eventId);
    const req = `{"cmd": "getData", "eventId": "${eventId}", "_reqId": "${reqId}"}`;
    ws.send(req);
  };

  const handleEvents = (obj) => {
    if (obj.events) {
      db = obj.events;
      idStack = Object.keys(obj.events);
      getData(idStack[0]);
    }
  };

  const handleData = (obj) => {
    if (obj.status) {
      idStack.shift();
      const eventId = obj._reqId.split('-')[0];
      if (db[eventId]) {
        const res = JSON.stringify({ event: db[eventId], data: obj.data });
        wss.send(res);
      }
    }
    if (idStack.length) {
      getData(idStack[0]);
    } else {
      getEvents();
    }
  };

  ws.on('open', () => {
    getEvents();
  });

  ws.on('message', (data) => {
    const obj = JSON.parse(data);

    switch (Object.keys(obj)[0]) {
      case 'events':
        handleEvents(obj);
        break;
      case 'status':
        handleData(obj);
        break;
      default:
        console.log('Empty Message');
    }
  });

  ws.on('close', () => {
    console.log('Disconnected!');
  });
};

export default () => start(startConnection);
