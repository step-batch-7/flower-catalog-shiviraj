const fs = require('fs');
const {parseText} = require('./parseComment');
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

const sendResponse = function(request, allComments, response) {
  const commentsInHtml = getCommentsInHTML(allComments);
  fs.readFile(`${TEMPLATE_DIR}${request.url}`, 'utf8', (err, data) => {
    data = data.replace(/__comments__/g, commentsInHtml);
    response.setHeader('Content-Type', 'text/html');
    response.end(data);
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

const serveGuestBook = function(request, response) {
  const allComments = getExistingComments();
  sendResponse(request, allComments, response);
};

const serveGuestBookPost = function(request, response) {
  let data = '';
  request.on('data', chunk => (data += chunk));
  request.on('end', () => {
    const newComment = parseText(data);
    updateComment(allComments, newComment);
    sendResponse(request, allComments, response);
  });
  const allComments = getExistingComments();
};

module.exports = {serveGuestBook, serveGuestBookPost};
