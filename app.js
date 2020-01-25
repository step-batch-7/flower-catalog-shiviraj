const Request = require('./src/request');
const {servePage} = require('./src/servePage');
const {serveGuestBook, serveGuestBookPost} = require('./src/serveGuestBook');

const findHandler = function(req) {
  if (req.method === 'POST' && req.url === '/guestBook.html')
    return serveGuestBookPost;
  if (req.method === 'GET' && req.url === '/guestBook.html')
    return serveGuestBook;
  if (req.method === 'GET') return servePage;
};

const handleData = function(text, socket) {
  const remote = {addr: socket.remoteAddress, port: socket.remotePort};
  console.log('New Connection', remote);
  const request = Request.parse(text);
  const handler = findHandler(request);
  const sendResponse = response => response.writeTo(socket);
  handler(request, sendResponse);
};

const handleConnection = function(socket) {
  socket.setEncoding('utf8');
  socket.on('error', err => console.error('Socket Error', err));
  socket.on('close', () => console.log('Socket Closed'));
  socket.on('data', text => handleData(text, socket));
};

module.exports = {handleConnection};
