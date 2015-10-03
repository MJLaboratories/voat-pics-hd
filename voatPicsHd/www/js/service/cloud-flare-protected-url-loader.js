var module = angular.module('app.services');

module.factory('CloudFlareProtectedUrlLoader', function ($http, $q, $timeout, CloudFlareSolver) {
  var loadUrl = function (url) {
    var deferred = $q.defer();

    $http.get(url)
      .success(function (data) {
        deferred.resolve(data);
      })
      .error(function (data, status, headers) {
        if (CloudFlareSolver.isHttpErrorCausedByCloudFlareProtection(headers)) {
          CloudFlareSolver.solveCloudFlareProtection(url, data, headers).then(function (data) {
            $http.get(url)
              .success(function (data) {
                deferred.resolve(data);
              })
              .error(function (data, status, headers, config) {
                deferred.reject('error loading data: ' + config)
              });
          });
        } else {
          deferred.reject('error fetching \'' +url+ '\/, status: ' + status);
        }
      });

    return deferred.promise;
  };

  return {
    loadUrl: loadUrl
  };
});
