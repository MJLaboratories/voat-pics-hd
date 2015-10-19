var module = angular.module('app.services');
module.factory('ImagePreloader', function ($q, $http, $timeout) {

  function qlimit(maxConcurrency) {
    var outstandingCount = 0;
    var queue = [];

    /**
     * Returns a promise which will resolve when
     * the concurrency is not saturated
     */
    function initialPromise() {
      if(outstandingCount < maxConcurrency) {
        outstandingCount++;
        return Q.resolve();
      }

      var defer = Q.defer();
      queue.push(defer);
      return defer.promise;
    }

    /**
     * Called after the factory promise is fulfilled.
     */
    function complete() {
      var next = queue.shift();

      if(next) {
        next.resolve();
      } else {
        outstandingCount--;
      }
    }

    /**
     * Returns a concurrency-limited promise
     */
    return function(factory) {
      return function() {
        var args = Array.prototype.slice.apply(arguments);

        return initialPromise()
          .then(function() {
            return factory.apply(null, args);
          })
          .finally(complete);

      };
    };
  }

  var qlimitInstance = qlimit(1);

  var preloadImages = function (imageUrls) {
    if (!angular.isArray(imageUrls)) {
      throw new Error('imageUrls must be an array');
    }

    _.each(imageUrls, preloadImage);
  };

  var preloadImage = function (imageUrl) {
    qlimitInstance(loadImage(imageUrl));
  };

  var loadImage = function (imageUrl) {
    console.log('loading image: ' +imageUrl);

    $timeout({}, 1000);

    //$http.get(imageUrl, {cache: true});
  };

  return {
    preloadImages: preloadImages
  };
});
