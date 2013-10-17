// eventually, you'll have some code here that uses the tested helpers
// to actually download the urls you want to download.

var fetchHTML = function(){
  var helpers = require('./lib/html-fetcher-helpers');
  var path = require('path');

  var filePath = path.join(__dirname, "../data/sites.txt");
  helpers.readUrls(filePath, helpers.downloadUrls);
};

// setInterval(fetchHTML, 5000);