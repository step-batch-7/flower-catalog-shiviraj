const fs = require('fs');
const Response = require('./response');

const updateComment = function(request) {
  const commentDir = `${__dirname}/../database/comments.json`;
  let allComments = fs.readFileSync(commentDir, 'utf8');
  allComments = JSON.parse(allComments);
  if (request.method === 'POST') {
    const comment = request.body;
    comment.time = new Date();
    allComments.push(request.body);
    fs.writeFile(commentDir, JSON.stringify(allComments, null, 2), () => {});
  }
  return allComments;
};

const getCommentsInHtml = function(allComments) {
  return allComments.reduce((htmlContent, comment) => {
    htmlContent += `<div class="comment">
    <div class="name">${comment.name}</div>
      <div class="time">${comment.time}</div>
      <div class="msg">${comment.comment}</div>
    </div>`;
    return htmlContent;
  }, '');
};

const sendResponse = function(request, allComments, callback) {
  const commentsInHtml = getCommentsInHtml(allComments);
  const response = new Response();
  const filePath = `${__dirname}/../templates${request.url}`;
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (!err) {
      data = data.replace(/__comments__/g, commentsInHtml);
      response.setHeader('Content-Type', 'text/html');
      response.setHeader('Content-Length', data.length);
      response.statusCode = 200;
      response.body = data;
    }
    callback(response);
  });
};

const serveGuestBook = function(request, callback) {
  const allComments = updateComment(request);
  sendResponse(request, allComments, callback);
};

module.exports = {serveGuestBook};
