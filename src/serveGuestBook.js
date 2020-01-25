const fs = require('fs');
const Response = require('./response');

const decodeComment = function(comment) {
  comment.time = new Date();
  comment.name = comment.name.replace(/\+/g, ' ');
  comment.comment = comment.comment.replace(/\+/g, ' ');
  comment.comment = comment.comment.replace(/%0D%0A/g, '\n');
  return comment;
};

const updateComment = function(request) {
  const commentDir = `${__dirname}/../database/comments.json`;
  let allComments = fs.readFileSync(commentDir, 'utf8');
  allComments = JSON.parse(allComments);
  if (request.method === 'POST') {
    const newComment = decodeComment(request.body);
    allComments.push(newComment);
    fs.writeFile(commentDir, JSON.stringify(allComments, null, 2), () => {});
  }
  return allComments;
};

const getCommentsInHtml = function(allComments) {
  allComments = allComments.reverse();
  return allComments.reduce((htmlContent, comment) => {
    comment.comment = comment.comment.replace(/(\n)/g, '<br />');
    htmlContent += `<div class="comment">
    <div class="name">${comment.name}</div>
      <div class="time">Commented On: &nbsp; ${comment.time}</div>
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
