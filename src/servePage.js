const fs = require('fs');
const ERROR_HTML = `<html><body><center><h1>404 Not Found</h1></center></body></html>`;

const CONTENT_TYPE = {
  html: 'text/html',
  css: 'text/css',
  jpg: 'image/jpg',
  gif: 'image/gif',
  js: 'application/javascript',
  pdf: 'application/pdf'
};

const getContentType = function(path) {
  const [, extension] = path.match(/.*\.(.*)$/) || [];
  return CONTENT_TYPE[extension];
};

const getContentTypeAndFilePath = function(url) {
  if (url === '/') url = '/index.html';
  const path = `${__dirname}/../public${url}`;
  const contentType = getContentType(url);
  return [path, contentType];
};

const servePage = function(request, response) {
  let [filePath, contentType] = getContentTypeAndFilePath(request.url);
  fs.readFile(filePath, (err, data) => {
    let statusCode = 200;
    if (err) {
      statusCode = 404;
      contentType = 'text/html';
      data = ERROR_HTML;
    }
    response.setHeader('Content-Type', contentType);
    response.writeHeader(statusCode);
    response.end(data);
  });
};

module.exports = {servePage};
