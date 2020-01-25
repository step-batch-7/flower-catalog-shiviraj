const {Server} = require('net');
const {handleConnection} = require('./app');

const main = function() {
  const server = new Server();
  server.on('connection', handleConnection);
  server.on('close', () => console.log('Server Closed'));
  server.on('end', () => console.log('Server Ended'));
  server.listen(3000, () => console.log('server is on'));
};

main();
