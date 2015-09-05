angular.module('starter.services', [])
  // factory method for creating model objects, as proposed at https://medium.com/opinionated-angularjs/angular-model-objects-with-javascript-classes-2e6a067c73bc
  .factory('VoatPost', function () {
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

      //Move to string service
    VoatPost.isValidExtension = function ext(url) {
      var extension = VoatPost.getExtension(url);
      if (extension == ".gifv") {
        return false;
      }
      return extension.charAt(0) === ".";
    };

    VoatPost.getExtension = function (url) {
      return (url = url.substr(1 + url.lastIndexOf("/")).split('?')[0]).substr(url.lastIndexOf("."));
    };

    VoatPost.build = function (data) {

      if (data === null || data.MessageContent === null || data.MessageContent === undefined) {
        return false;
      }

      if (data.MessageContent.indexOf('imgur') < 0 || VoatPost.isValidExtension(data.MessageContent) === false) {
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
  })
  .factory('VoatPostalService', ['$http', '$q', 'VoatPost', '$cacheFactory', function ($http, $q, VoatPost, $cacheFactory) {
    var voatFrontPageURL = 'https://voat.co/api/frontpage';
    var voatPostCache = $cacheFactory('voatPosts');

    return {
      all: function () {
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
  }]);
