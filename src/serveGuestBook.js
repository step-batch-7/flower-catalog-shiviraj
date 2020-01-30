const fs = require('fs');

const STATUS_OK = 200;
const STATUS_MOVED = 301;
const COMMENT_DIR = `${__dirname}/../database/comments.json`;
const TEMPLATE_DIR = `${__dirname}/../templates`;

const getCommentsInHTML = function(allComments) {
  return allComments.reduce((htmlContent, comment) => {
    const msg = comment.msg.replace(/(\n)/g, '<br />');
    const htmlComment = `<div class="comment">
    <div class="name">${comment.name}</div>
      <div class="time">Commented On: &nbsp; ${comment.time}</div>
      <div class="msg">${msg}</div>
    </div>`;
    return htmlContent + htmlComment;
  }, '');
};

const getExistingComments = function() {
  const allComments = fs.readFileSync(COMMENT_DIR, 'utf8');
  return JSON.parse(allComments);
};

const serveGuestBook = function(req, res, next) {
  const allComments = getExistingComments();
  const commentsInHtml = getCommentsInHTML(allComments);
  fs.readFile(`${TEMPLATE_DIR}${req.url}`, 'utf8', (err, data) => {
    if (err) {
      next();
      return;
    }
    const htmlContent = data.replace(/__comments__/g, commentsInHtml);
    res.setHeader('Content-Type', 'text/html');
    res.writeHead(STATUS_OK);
    res.write(htmlContent);
    res.end();
  });
};

const updateComment = function(newComment) {
  newComment.time = new Date();
  const allComments = getExistingComments();
  allComments.unshift(newComment);
  fs.writeFile(COMMENT_DIR, JSON.stringify(allComments), () => {});
};

const updateGuestComment = function(req, response) {
  updateComment(req.body);
  response.setHeader('Location', '/guestBook.html');
  response.writeHead(STATUS_MOVED);
  response.end();
};

module.exports = {serveGuestBook, updateGuestComment};
