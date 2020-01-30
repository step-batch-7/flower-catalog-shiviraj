const http = require('http');
const querystring = require('querystring');

const PORT = 3000;

const {App} = require('./app');
const {serveStaticPage} = require('./src/servePage');
const {notFound, methodNotAllowed} = require('./src/serveError');
const {serveGuestBook, updateGuestComment} = require('./src/serveGuestBook');

const readBody = function(req, res, next) {
  let data = '';
  req.on('data', chunk => {
    data += chunk;
  });
  req.on('end', () => {
    req.body = querystring.parse(data);
    next();
  });
};

const addHandlers = function(app) {
  app.use(readBody);
  app.get('', serveStaticPage);
  app.get('/guestBook.html', serveGuestBook);
  app.post('/updateComment', updateGuestComment);
  app.get('.*', notFound);
  app.post('.*', notFound);
  app.use(methodNotAllowed);
};

const main = function() {
  const app = new App();
  addHandlers(app);
  const server = http.createServer(app.serve.bind(app));
  server.listen(PORT, () => process.stdout.write('server is on'));
};

main();
