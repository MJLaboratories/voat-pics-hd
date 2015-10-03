var module = angular.module('app.model');

module.factory('VoatPostBuilder', function (VoatPost) {

  var build = function (data) {
    var voatPosts = [];
    var submissions = $(data).find('.submission');

    submissions.each(function (index, value) {
      var submission = $(value),
          id = submission.attr('data-fullname'),
          author = submission.find('.author').text(),
          commentCount = submission.find('.comments').text(),
          downVoats = submission.find('.score.dislikes').text(),
          upVoats = submission.find('.score.likes').text(),
          imageDetails = $(submission.find('.thumbnail')),
          imageLink = imageDetails.attr('href'),
          image = imageDetails.find('img'),
          thumbnail = image.attr('src'),
          title = image.attr('alt');

      var voatToAdd = VoatPost.build(id, title, imageLink, upVoats, downVoats, author, commentCount, thumbnail);

      if (voatToAdd && voatToAdd !== null) {
        voatPosts.push(voatToAdd);
      }
    });

    return voatPosts;
  };

  return {
    build: build
  };
});
