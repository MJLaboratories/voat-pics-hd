var module = angular.module('app.services');
module.factory('VoatPost', function (UrlExtensionService) {
  var ZERO_COMMENTS_STRING = "discuss";

  function VoatPost(id, title, link, upVoats, downVoats, submittedBy, commentCount, thumbnail) {
    this.id = id;
    this.title = title;
    this.link = link;
    this.upVoats = upVoats;
    this.downVoats = downVoats;
    this.submittedBy = submittedBy;
    this.thumbnail = thumbnail;
    this.commentCountDescription = commentCount;

    var words = commentCount.split(" ");
    if (angular.isNumberOrNumericString(words[0])) {
      this.commentCount = words[0];
    } else if (words[0] === ZERO_COMMENTS_STRING) {
      this.commentCount = "0";
    } else {
      this.commentCount = "unknown"
    }
  }

  VoatPost.build = function (id, title, link, upVoats, downVoats, submittedBy, commentCount, thumbnail) {

    if (!id || id === null || !title || title === null || !link || link === null || !UrlExtensionService.isValidExtension(link)) {
      return null;
    }

    return new VoatPost(
      id, title, link, upVoats, downVoats, submittedBy, commentCount, thumbnail
    );
  };
  /**
   * Return the constructor function
   */
  return VoatPost;
});
