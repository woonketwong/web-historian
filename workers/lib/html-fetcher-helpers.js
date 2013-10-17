var path = require('path');
var fs = require('fs');
var http = require('http-get');
var _ = require('underscore');

exports.readUrls = function(filePath, cb){
  var text = fs.readFileSync(filePath, 'utf8');
  var urls = text.split('\n');
  cb(urls);
};

exports.downloadUrls = function(urls){
  // fixme
  var filePath = '';
  _.each(urls, function(url){
    filePath = path.join(__dirname, "../../data/sites/", url);
    http.get(url, filePath, function(error, result){
      if (error) {
        console.log('Error downloading URL:', error);
      }
    });
  });
  return true;
};