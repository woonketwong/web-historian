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

  var fileLocation;
  var pathname = url.parse(req.url).pathname;

  var setResponseBodyFromFile = function(fileLocation){
    var responseBody, statusCode;
    if(fs.existsSync(fileLocation)){
      statusCode = 302;
      responseBody = fs.readFileSync(fileLocation, 'utf8');
    } else {
      statusCode = 404;
      responseBody = 'Could not find HTML file.';
    }
    console.log('responseBody:',responseBody);
    completeResponse(statusCode, responseBody);
  };

  var completeResponse = function(statusCode, responseBody){

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
      if (pathname === '/') {
        fileLocation = path.join(__dirname, '../web/public/index.html');
        setResponseBodyFromFile(fileLocation);
      }
      break;

    case 'POST':
      var data = '';
      req.on('data', function(chunk) {
        data += chunk;
      });
      req.on('end', function() {
        var urlToAdd = querystring.parse(data)['url'];

        connection.query('select * from siteIndex where url = ' + "'" + urlToAdd + "'", function(err, rows){
          // check whether SQL database already contains row for the URL
          if(rows.length){
            console.log('rows',rows);
            fileLocation = rows[0].filepath;
            setResponseBodyFromFile(fileLocation);
          } else {
            fileLocation = path.join(__dirname, '../data/sites/');
            var SQLStatement = 'insert into siteIndex (url, filepath) values (' +
              "'" + urlToAdd + "'" + ',' + "'" + fileLocation + urlToAdd + "' " + ')';
            connection.query(SQLStatement, function(err){
                completeResponse(201, 'Added to database.');
            });
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
  console.log('test');
};
