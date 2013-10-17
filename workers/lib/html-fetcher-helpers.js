var path = require('path');
var fs = require('fs');

exports.readUrls = function(filePath, cb){
  var text = fs.readFileSync(filePath, 'utf8');
  var urls = text.split('\n');
  cb(urls);
};

exports.downloadUrls = function(urls){
  // fixme

};
