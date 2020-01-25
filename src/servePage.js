const fs = require('fs');
const Response = require('./response');

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

const servePage = function(request, callback) {
  const response = new Response();
  const [filePath, contentType] = getContentTypeAndFilePath(request.url);
  fs.readFile(filePath, (err, data) => {
    if (!err) {
      response.setHeader('Content-Type', contentType);
      response.setHeader('Content-Length', data.length);
      response.statusCode = 200;
      response.body = data;
    }
    callback(response);
  });
};

module.exports = {servePage};
