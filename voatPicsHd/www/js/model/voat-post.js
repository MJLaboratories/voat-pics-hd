var module = angular.module('app.services');
  module.factory('VoatPost', function (UrlExtensionService) {
    function VoatPost(id, title, link, upVoats, downVoats, submittedBy, commentCount, thumbnail) {
      this.id = id;
      this.title = title;
      this.link = link;
      this.upVoats = upVoats;
      this.downVoats = downVoats;
      this.submittedBy = submittedBy;
      this.commentCount = commentCount;
      this.thumbnail = thumbnail;
    }

    VoatPost.build = function (id, title, link, upVoats, downVoats, submittedBy, commentCount, thumbnail) {

      return new VoatPost(
        id, title, link, upVoats, downVoats, submittedBy, commentCount, thumbnail
      );
    };
    /**
     * Return the constructor function
     */
    return VoatPost;
  });
