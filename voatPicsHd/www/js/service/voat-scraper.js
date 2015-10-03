var module = angular.module('app.services');
module.factory('VoatScraper', function ($http, $q, VoatPost, $cacheFactory, CloudFlareProtectedUrlLoader) {
  var voatFrontPageURL = 'https://voat.co/api/frontpage';
  var voatPostCache = $cacheFactory('voatPosts');

  return {
    all : function () {
      var deferred = $q.defer();

      $http
        .get(voatFrontPageURL, {cache: true})
        .success(function (data) {

          var voatPosts = VoatPost.voatApiV1Transformer(data);

          voatPostCache.remove('voatPosts');
          voatPostCache.put('voatPosts', voatPosts);

          deferred.resolve(voatPosts);
        });

      return deferred.promise;
    }
  };
});
