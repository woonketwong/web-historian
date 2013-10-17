var path = require('path');
var fs = require('fs');
var http = require('http-get');
var _ = require('underscore');

exports.readUrls = function(filePath, cb){
  var text = fs.readFileSync(filePath, 'utf8');
  var urls = text.split('\n');
  cb(urls);
};

exports.downloadUrls = function(urls, filepath){
  // fixme
  var filePath = '';
  _.each(urls, function(url){
    filepath = filepath || path.join(__dirname, "../../data/sites/", url);
    http.get(url, filepath, function(error, result){
      if (error) {
        console.log('Error downloading URL:', error);
      }
    });
  });
  return true;
};