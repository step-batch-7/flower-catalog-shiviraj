const pickupParams = function(query, keyValue) {
  const [key, value] = keyValue.split('=');
  query[key] = value;
  return query;
};

const readParams = function(keyValueTextPairs) {
  const keyValuePairs = keyValueTextPairs.split('&');
  return keyValuePairs.reduce(pickupParams, {});
};

const parseQueryParameters = function(entireUrl) {
  const [url, queryText] = entireUrl.split('?');
  const query = queryText && readParams(queryText);
  return {url, query};
};

const collectHeaderAndContent = (result, line) => {
  if (line === '' && !result.body) {
    result.body = '';
  }
  if ('body' in result) {
    result.body += line;
    return result;
  }
  const [key, value] = line.split(': ');
  result.header[key] = value;
  return result;
};

class Request {
  constructor(method, url, query, header, body) {
    this.method = method;
    this.url = url;
    this.query = query;
    this.header = header;
    this.body = body;
  }
  static parse(requestText) {
    const [requestLine, ...headerAndBody] = requestText.split('\r\n');
    const [method, entireUrl, protocol] = requestLine.split(' ');
    const {url, query} = parseQueryParameters(entireUrl);
    let {header, body} = headerAndBody.reduce(collectHeaderAndContent, {
      header: {}
    });
    if (header['Content-Type'] === 'application/x-www-form-urlencoded') {
      body = readParams(body);
    }
    return new Request(method, url, query, header, body);
  }
}

module.exports = Request;
