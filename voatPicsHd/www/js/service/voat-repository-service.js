var module = angular.module('app.services');
module.factory('VoatRepository', function ($http, $q, VoatPost, $cacheFactory, CloudFlareProtectedUrlLoader, VoatPostBuilder) {
  var voatFrontPageURL = 'https://voat.co/v/pics';

  var httpCache = $cacheFactory('voatPosts');

  var loadInitialData = function () {
    var deferred = $q.defer();

    CloudFlareProtectedUrlLoader.loadUrl(voatFrontPageURL).then(function (data) {
      var voatPosts = VoatPostBuilder.build(data);
      httpCache.put('voatPosts', voatPosts);
      deferred.resolve(voatPosts);
    });

    return deferred.promise;
  };

  var loadMoreData = function () {
    return loadInitialData();
  };


  return {
    loadInitialData: loadInitialData,
    loadMoreData: loadInitialData
  };
});
