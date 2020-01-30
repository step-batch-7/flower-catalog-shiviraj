const notFound = function(req, res) {
  res.end('404 Not Found');
};

const methodNotAllowed = function(req, res) {
  res.end('Method Not Allowed');
};

module.exports = {methodNotAllowed, notFound};
