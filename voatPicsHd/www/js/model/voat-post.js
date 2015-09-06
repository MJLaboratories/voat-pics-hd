var module = angular.module('app.services');
  // factory method for creating model objects, as proposed at https://medium.com/opinionated-angularjs/angular-model-objects-with-javascript-classes-2e6a067c73bc
  module.factory('VoatPost', function (UrlExtensionService) {
    function VoatPost(id, title, link, upVoats, downVoats, submittedBy, commentCount, thumbnail) {
      // Public properties, assigned to the instance ('this')
      this.id = id;
      this.title = title;
      this.link = link;
      this.upVoats = upVoats;
      this.downVoats = downVoats;
      this.submittedBy = submittedBy;
      this.commentCount = commentCount;
      if (thumbnail === undefined || thumbnail ===null) {
        this.thumbnail = link;
      }
      else {
        this.thumbnail = 'https://cdn.voat.co/thumbs/' + thumbnail;
      }
    }

    /**
     * Static method, assigned to class
     * Instance ('this') is not available in static context
     */

    VoatPost.build = function (data) {

      if (data === null || data.MessageContent === null || data.MessageContent === undefined) {
        return false;
      }

      if (data.MessageContent.indexOf('imgur') < 0 || UrlExtensionService.isValidExtension(data.MessageContent) === false) {
        return false;
      }

      return new VoatPost(
        data.Id, data.Linkdescription, data.MessageContent, data.Likes, data.Dislikes, data.Name, data.CommentCount, data.Thumbnail
      );
    };

    VoatPost.voatApiV1Transformer = function (responseData) {
      // handle arrays
      if (angular.isArray(responseData)) {
        return responseData
          .map(VoatPost.build)
          .filter(Boolean);
      }

      // handle single objects
      return VoatPost.build(responseData);
    };

    /**
     * Return the constructor function
     */
    return VoatPost;
  });
