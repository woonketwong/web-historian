var path = require('path');
var url = require('url');
var fs = require('fs');
var querystring = require('querystring');
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  port     : '3306',
  user     : 'root',
  password : '',
  database : 'webHistorian'
});

module.exports.datadir = path.join(__dirname, "../data/sites.txt"); // tests will need to override this.

module.exports.handleRequest = function (req, res) {
  console.log(exports.datadir);

  var fileLocation;
  var pathname = url.parse(req.url).pathname;

  var setResponseBodyFromFile = function(fileLocation){
    var responseBody;
    if(fs.existsSync(fileLocation)){
      responseBody = fs.readFileSync(fileLocation, 'utf8');
    } else {
      responseBody = 'Not found';
    }
    completeResponse(200, responseBody);
  };

  var completeResponse = function(statusCode, responseBody){
    connection.end();

    var headers = {
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
    "access-control-allow-headers": "content-type, accept",
    "access-control-max-age": 10,
    "Content-Type": "text/html"
    };

    res.writeHead(statusCode, headers);
    res.end(responseBody);
  };

  switch(req.method){
    case 'GET':
      connection.connect();
      if (pathname === '/') {
        fileLocation = path.join(__dirname, '../web/public/index.html');
        setResponseBodyFromFile(fileLocation);
      } else if (pathname){
        connection.query('select filepath from siteIndex where url = ' + pathname, function(err, rows){
          fileLocation = rows[0].filepath;
          setResponseBodyFromFile(fileLocation);
        });
      }
      break;

    case 'POST':
      connection.connect();
      var data = '';
      req.on('data', function(chunk) {
        data += chunk;
      });
      req.on('end', function() {
        var urlToAdd = querystring.parse(data)['url'];

        connection.query('select * from siteIndex where url = ' + urlToAdd, function(err, rows){
          // check whether SQL database already contains row for the URL
          if(rows.length){
            fileLocation = path.join(__dirname, '../data/sites/');
            connection.query('insert into siteIndex (url, filepath) values (' +
              urlToAdd + ',' + fileLocation + urlToAdd + ')', function(err){
                completeResponse(302, 'Added to database.');
            });
          } else {
            completeResponse(302, 'Already in database.');
          }
        });
      });
      break;

    case 'OPTIONS':
      completeResponse(200, '');
      break;

    default:
      completeResponse(404, 'Not found');
  }

};
