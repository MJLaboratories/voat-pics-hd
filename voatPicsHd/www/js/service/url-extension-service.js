var module = angular.module('app.services');
module.factory('UrlExtensionService', function () {
  var isValidExtension = function ext(url) {
    var extension = getExtension(url);
    if (extension == ".gifv") {
      return false;
    }
    return extension.charAt(0) === ".";
  };

  var getExtension = function (url) {
    return (url = url.substr(1 + url.lastIndexOf("/")).split('?')[0]).substr(url.lastIndexOf("."));
  };

  return {
    isValidExtension: isValidExtension
  }
});
