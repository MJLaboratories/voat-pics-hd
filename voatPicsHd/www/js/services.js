angular.module('starter.services', [])
  // factory method for creating model objects, as proposed at https://medium.com/opinionated-angularjs/angular-model-objects-with-javascript-classes-2e6a067c73bc
  .factory('VoatPost', function () {
    function VoatPost(id, title, link, upVoats, downVoats, submittedBy, commentCount) {
      // Public properties, assigned to the instance ('this')
      this.id = id;
      this.title = title;
      this.link = link;
      this.upVoats = upVoats;
      this.downVoats = downVoats;
      this.submittedBy = submittedBy;
      this.commentCount = commentCount;
    }

    /**
     * Static method, assigned to class
     * Instance ('this') is not available in static context
     */
    VoatPost.build = function (data) {
      if (data === null || data.MessageContent === null) {
        return false;
      }

      if (data.MessageContent.indexOf('imgur') < 0) {
        return false;
      }

      return new VoatPost(
        data.Id, data.Linkdescription, data.MessageContent, data.Likes, data.Dislikes, data.Name, data.CommentCount
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
  })
  .factory('VoatPostalService', ['$http', '$q', 'VoatPost', function ($http, $q, VoatPost) {
    var voatFrontPageURL = 'https://voat.co/api/frontpage';

    return {
      all: function () {
        var deferred = $q.defer();

        $http
          .get(voatFrontPageURL)
          .success(function(data) {
              voatPosts = VoatPost.voatApiV1Transformer(data);
              deferred.resolve(voatPosts);
            });

        return deferred.promise;
      }
    };
  }]);