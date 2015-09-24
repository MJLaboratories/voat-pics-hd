/**
 * Created by Matthew on 24/09/2015.
 */
var module = angular.module('app.services');

module.factory('VoatPostListBuilder', ['VoatPost', '$q', 'VoatScraper', function (VoatPost, $q, VoatScraper) {

  var build = function (url) {
    var voatPostList = [];
    var deferred = $q.defer();
    VoatScraper.scrapePage(url).then(function(data){
      console.log(data);

      var voatToAdd = VoatPost.build(1,'Test Link', 'https://cdn.voat.co/thumbs/ccab3fd4-7be9-4374-87fc-c2336e0f7895.jpg',5, 5,'Matt', 5, 'https://cdn.voat.co/thumbs/ccab3fd4-7be9-4374-87fc-c2336e0f7895.jpg');

      voatPostList.push(voatToAdd);
      deferred.resolve(voatPostList);
    });

    //pull out submissions from full page html. Create voatPosts from model factory method. return list of voat posts

    return deferred.promise;
  };

  return {build: build};
}]);
