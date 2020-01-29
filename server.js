const http = require('http');
const {servePage} = require('./src/servePage');
const {serveGuestBook, updateGuestComment} = require('./src/serveGuestBook');

const findHandler = function(req) {
  if (req.method === 'POST' && req.url === '/guestBook.html')
    return updateGuestComment;
  if (req.method === 'GET' && req.url === '/guestBook.html')
    return serveGuestBook;
  return servePage;
};

const handleData = function(request, response) {
  const handler = findHandler(request);
  handler(request, response);
};

const main = function() {
  const server = http.createServer(handleData);
  server.on('close', () => console.log('Server Closed'));
  server.on('end', () => console.log('Server Ended'));
  server.listen(3000, () => console.log('server is on'));
};

main();
