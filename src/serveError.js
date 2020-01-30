const ERROR_CODE = 404;

const notFound = function(req, res) {
  res.writeHead(ERROR_CODE);
  res.end('404 Not Found');
};

const methodNotAllowed = function(req, res) {
  res.writeHead(ERROR_CODE);
  res.end('Method Not Allowed');
};

module.exports = {methodNotAllowed, notFound};
