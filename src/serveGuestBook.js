const fs = require('fs');
const querystring = require('querystring');

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

const getExistingComments = function() {
  const allComments = fs.readFileSync(COMMENT_DIR, 'utf8');
  return JSON.parse(allComments);
};

const serveGuestBook = function(request, response) {
  const allComments = getExistingComments();
  const commentsInHtml = getCommentsInHTML(allComments);
  fs.readFile(`${TEMPLATE_DIR}${request.url}`, 'utf8', (err, data) => {
    data = data.replace(/__comments__/g, commentsInHtml);
    response.setHeader('Content-Type', 'text/html');
    response.end(data);
  });
};

const updateComment = function(data) {
  const newComment = querystring.parse(data);
  newComment.time = new Date();
  const allComments = getExistingComments();
  allComments.unshift(newComment);
  fs.writeFile(COMMENT_DIR, JSON.stringify(allComments, null, 2), () => {});
};

const updateGuestComment = function(request, response) {
  let data = '';
  request.on('data', chunk => (data += chunk));
  request.on('end', () => {
    updateComment(data);
    response.setHeader('Location', '/guestBook.html');
    response.writeHead(301);
    response.end();
  });
};

module.exports = {serveGuestBook, updateGuestComment};
