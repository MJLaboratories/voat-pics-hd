var module = angular.module('app.controllers');
module.controller('GalleryCtrl', function ($scope, $stateParams, $cacheFactory, $ionicSlideBoxDelegate, $ionicScrollDelegate, $ionicNavBarDelegate) {

  function findWithAttr(array, attr, value) {
    for (var i = 0; i < array.length; i += 1) {
      if (array[i][attr] === value) {
        return i;
      }
    }
  }

  $scope.minZoom = 1;
  $scope.showNavigation = true;
  $scope.showImageTitle = true;

  function getScrollDelegate () {
    return $ionicScrollDelegate.$getByHandle('scrollHandle-' + $scope.activeSlideIndex);
  };

  $scope.slideHasChanged = function ($index) {
    console.log("active slide changed: " + $index);
  };

  $scope.updateSlideStatus = function(activeSlideIndex) {
    var scrollDelegate = getScrollDelegate();
    var scrollPosition = scrollDelegate.getScrollPosition();
    var currentZoomLevel = scrollPosition.zoom;
    var scrollDetails = scrollDelegate.handle + ": Top: " + scrollPosition.top + ". Left: " + scrollPosition.left+ ". Zoom: " + currentZoomLevel;

    console.log(scrollDetails);

    if (currentZoomLevel == $scope.minZoom) {
      console.log("minimum zoom reached: sliding enabled");
      $ionicSlideBoxDelegate.enableSlide(true);
    } else {
      console.log("zoomed: sliding disabled");
      $ionicSlideBoxDelegate.enableSlide(false);
    }
  };

  $scope.toggleImageOnly = function () {
    $scope.showNavigation = !$scope.showNavigation;
    $scope.showImageTitle = !$scope.showImageTitle;
    $ionicNavBarDelegate.showBar($scope.showNavigation);
  };

  $scope.toggleZoom = function () {
    var scrollDelegate = getScrollDelegate();
    var currentZoomLevel = scrollDelegate.getScrollPosition().zoom;

    if (currentZoomLevel == 1) {
      console.log("image double-tapped while zoomed out: zooming in");
      scrollDelegate.zoomBy(2.5, true);
    } else {
      console.log("image double-tapped while zoomed in: zooming out");
      scrollDelegate.zoomTo(1, true);
    }
  };

  var httpCache = $cacheFactory.get('voatPosts');
  $scope.voatPosts = httpCache.get('voatPosts');
  $scope.activeSlideId = parseInt($stateParams.id);
  $scope.activeSlideIndex = findWithAttr($scope.voatPosts, 'id', $scope.activeSlideId);
});
