const ERROR_PAGE = '<html><body><center><h1>404 Error</h1><p>Page Not Found</p></center></body></html>';

class Response {
  constructor() {
    this.statusCode = 404;
    this.body = ERROR_PAGE;
    this.headers = [{key: 'Content-Length', value: this.body.length}];
  }
  setHeader(key, value) {
    let header = this.headers.find(h => h.key === key);
    if (header) header.value = value;
    else this.headers.push({key, value});
  }
  generateHeadersText() {
    const lines = this.headers.map(header => `${header.key}: ${header.value}`);
    return lines.join('\r\n');
  }
  writeTo(writable) {
    writable.write(`HTTP/1.1 ${this.statusCode}\r\n`);
    writable.write(this.generateHeadersText());
    writable.write('\r\n\r\n');
    writable.write(this.body);
  }
}

module.exports = Response;
