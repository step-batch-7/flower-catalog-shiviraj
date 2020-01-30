const fs = require('fs');

const MIME_TYPES = {
  html: 'text/html',
  css: 'text/css',
  jpg: 'image/jpg',
  gif: 'image/gif',
  js: 'application/javascript',
  pdf: 'application/pdf'
};

const getAbsolutePath = function(url) {
  const path = url === '/' ? '/index.html' : url;
  return `${__dirname}/../public${path}`;
};

const serveStaticPage = function(req, res, next) {
  const absolutePath = getAbsolutePath(req.url);
  fs.readFile(absolutePath, (err, data) => {
    if (!err) {
      const extension = absolutePath.split('.').pop();
      res.setHeader('Content-Type', MIME_TYPES[extension]);
      res.end(data);
    }
    next();
  });
};

module.exports = {serveStaticPage};
