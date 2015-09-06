var module = angular.module('app.controllers');
module.controller('GalleryCtrl', function ($scope, $stateParams, $cacheFactory) {

  function findWithAttr(array, attr, value) {
    for (var i = 0; i < array.length; i += 1) {
      if (array[i][attr] === value) {
        return i;
      }
    }
  }

  var httpCache = $cacheFactory.get('voatPosts');
  $scope.voatPosts = httpCache.get('voatPosts');
  $scope.activeSlideId = parseInt($stateParams.id);

  $scope.initialSlideIndex = findWithAttr($scope.voatPosts, 'id', $scope.activeSlideId);

});
