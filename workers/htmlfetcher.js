// eventually, you'll have some code here that uses the tested helpers
// to actually download the urls you want to download.
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  port     : '3306',
  user     : 'root',
  password : '',
  database : 'webHistorian'
});

var fetchHTML = function(){
  connection.connect();
  var helpers = require('./lib/html-fetcher-helpers');
  var path = require('path');

  // var filePath = path.join(__dirname, "../data/sites.txt");
  // helpers.readUrls(filePath, helpers.downloadUrls);

  connection.query('select * from siteIndex', function(err, rows){
    var urlList = [];
    var filepathList = [];
    _.each(rows, function(row){
      urlList.push(row.url);
      filepathList.push(row.filepath);
    });

    helpers.downloadUrls(row.url, row.filepath);
  });

  connection.end();
};

setInterval(fetchHTML, 5000);