'use strict';
const http = require('node:http');
const WebSocket = require('ws');

const PORT = Number(process.env.PORT || 10000);
const MAX_PACKET = 8 * 1024 * 1024;
const MAX_JOURNAL = 20000;
const MAGIC = Buffer.from('CBN1');
const clients = new Set();
let snapshot = null;
let journal = [];

function send(socket, packet) {
  if (socket.readyState === WebSocket.OPEN) socket.send(packet, { binary: true });
}
function broadcast(packet, except) {
  for (const client of clients) if (client !== except) send(client, packet);
}
function helloPacket() {
  return Buffer.from([0x43, 0x42, 0x4e, 0x31, 0, 0, 0, 0]);
}
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  if (req.url === '/health' || req.url === '/') {
    res.writeHead(200);
    res.end(JSON.stringify({
      service: 'CrimBlox binary replication relay',
      status: 'ok',
      clients: clients.size,
      hasWorldSnapshot: Boolean(snapshot),
      queuedDeltas: journal.length,
      protocol: 'CBN1 binary'
    }));
    return;
  }
  res.writeHead(404);
  res.end(JSON.stringify({ error: 'not found' }));
});
const wss = new WebSocket.Server({ server, maxPayload: MAX_PACKET, perMessageDeflate: false });

wss.on('connection', (socket) => {
  clients.add(socket);
  socket._crimBloxReady = true;
  if (snapshot) {
    send(socket, snapshot);
    for (const item of journal) send(socket, item);
  } else {
    send(socket, helloPacket());
  }

  socket.on('message', (data, isBinary) => {
    if (!isBinary) return;
    const packet = Buffer.from(data);
    if (packet.length < 8 || packet.length > MAX_PACKET) return;
    if (!packet.subarray(0, 4).equals(MAGIC)) return;
    const type = packet[4];

    // First connected browser seeds the room's serialized Workspace.
    if (type === 1) {
      if (!snapshot) {
        snapshot = Buffer.from(packet);
        journal = [];
        broadcast(packet, socket);
      }
      return;
    }

    // Relayed deltas, destruction, and newly created tree nodes are binary-only.
    if (type !== 2 && type !== 3 && type !== 4) return;
    if (!snapshot) return;
    journal.push(Buffer.from(packet));
    if (journal.length > MAX_JOURNAL) {
      // Keep bounded memory; a new seed snapshot is required to compact the journal.
      journal = journal.slice(-MAX_JOURNAL);
    }
    broadcast(packet, socket);
  });

  socket.on('close', () => clients.delete(socket));
  socket.on('error', () => clients.delete(socket));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('CrimBlox binary relay listening on ' + PORT);
});
