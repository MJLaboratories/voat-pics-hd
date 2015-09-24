/**
 * Created by Matthew on 24/09/2015.
 */
var module = angular.module('app.services');

module.factory('VoatPostListBuilder', ['VoatPost', '$q', 'VoatScraper', function (VoatPost, $q, VoatScraper) {

  var build = function (url) {
    var id, title, imageLink, upVoats, downVoats, author, commentCount, thumbnail, submissions, voatPostList = [], deferred = $q.defer(), voatToAdd;

    VoatScraper.scrapePage(url).then(function (data) {
      // console.log(data);


      submissions = $(data).find('.submission');

      submissions.each(function(index,value){

        var submission = $(value);
        id = submission.attr('data-fullname');
        author = submission.find('.author').text();
        commentCount = submission.find('.comments').text();
        downVoats = submission.find('.score.dislikes').text();
        upVoats = submission.find('.score.likes').text()
        var imageDetails = $(submission.find('.thumbnail'));
        imageLink = imageDetails.attr('href');
        var image = imageDetails.find('img');
        thumbnail = image.attr('src');
        title = image.attr('alt');




        voatToAdd = VoatPost.build(id, title, imageLink, upVoats, downVoats, author, commentCount, thumbnail);

        if(voatToAdd && voatToAdd !== null) {
          voatPostList.push(voatToAdd);
        }
      });


      deferred.resolve(voatPostList);
    });

    //pull out submissions from full page html. Create voatPosts from model factory method. return list of voat posts

    return deferred.promise;
  };

  return {build: build};
}]);
