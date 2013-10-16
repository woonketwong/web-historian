var path = require('path');
var url = require('url');
var fs = require('fs');

module.exports.datadir = path.join(__dirname, "../data/sites.txt"); // tests will need to override this.

module.exports.handleRequest = function (req, res) {
  console.log(exports.datadir);

  var headers = {
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
    "access-control-allow-headers": "content-type, accept",
    "access-control-max-age": 10,
    "Content-Type": "text/html"
  };
  var statusCode, responseBody;
  var pathname = url.parse(req.url).pathname;

  switch(req.method){
    case 'GET':
      statusCode = 200;
      if (pathname === '/') {
        responseBody = fs.readFileSync('./web/public/index.html', 'utf8');
      } else if (pathname){
        responseBody = fs.readFileSync('./data/sites' + pathname, 'utf8');
      }
      break;

    case 'POST':
      break;

    case 'OPTIONS':
      statusCode = 200;
      responseBody = '';
      break;

    default:
      statusCode = 404;
      responseBody = 'Not Found';
  }

  res.writeHead(statusCode, headers);
  res.end(responseBody);
};
