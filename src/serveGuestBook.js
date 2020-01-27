const fs = require('fs');
const Response = require('./response');
const COMMENT_DIR = `${__dirname}/../database/comments.json`;
const TEMPLATE_DIR = `${__dirname}/../templates`;

const getCommentsInHTML = function(allComments) {
  return allComments.reduce((htmlContent, comment) => {
    const msg = comment.msg.replace(/(\n)/g, '<br />');
    htmlContent += `<div class="comment">
    <div class="name">${comment.name}</div>
      <div class="time">Commented On: &nbsp; ${comment.time}</div>
      <div class="msg">${msg}</div>
    </div>`;
    return htmlContent;
  }, '');
};

const sendResponse = function(request, allComments, callback) {
  const commentsInHtml = getCommentsInHTML(allComments);
  const response = new Response();
  fs.readFile(`${TEMPLATE_DIR}${request.url}`, 'utf8', (err, data) => {
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

const getExistingComments = function() {
  const allComments = fs.readFileSync(COMMENT_DIR, 'utf8');
  return JSON.parse(allComments);
};

const updateComment = function(allComments, newComment) {
  newComment.time = new Date();
  allComments.unshift(newComment);
  fs.writeFile(COMMENT_DIR, JSON.stringify(allComments, null, 2), () => {});
};

const serveGuestBook = function(request, callback) {
  const allComments = getExistingComments();
  sendResponse(request, allComments, callback);
};

const serveGuestBookPost = function(request, callback) {
  const allComments = getExistingComments();
  updateComment(allComments, request.body);
  sendResponse(request, allComments, callback);
};

module.exports = {serveGuestBook, serveGuestBookPost};
