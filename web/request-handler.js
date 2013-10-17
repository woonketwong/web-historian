var path = require('path');
var url = require('url');
var fs = require('fs');
var querystring = require('querystring');

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
  var statusCode = 404;
  var responseBody = '';
  var fileLocation;
  var pathname = url.parse(req.url).pathname;

  switch(req.method){
    case 'GET':
      if (pathname === '/') {
        fileLocation = path.join(__dirname, '../web/public/index.html');
      } else if (pathname){
        fileLocation = path.join(__dirname, '../data/sites', pathname);
      }
      if(fs.existsSync(fileLocation)){
        statusCode = 200;
        responseBody = fs.readFileSync(fileLocation, 'utf8');
      }
      break;

    case 'POST':
      statusCode = 302;
      var data = '';
      req.on('data', function(chunk) {
        data += chunk;
      });
      req.on('end', function() {
        data = querystring.parse(data)['url'] + '\n';
        fileLocation = path.join(__dirname, "../data/sites.txt");
        fs.appendFileSync(fileLocation, data);
        responseBody = "OK";
      });
      break;

    case 'OPTIONS':
      statusCode = 200;
      responseBody = '';
      break;

    default:
      responseBody = 'Not Found';
  }

  res.writeHead(statusCode, headers);
  res.end(responseBody);
};
