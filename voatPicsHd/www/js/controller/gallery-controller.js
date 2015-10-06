var module = angular.module('app.controllers');
module.controller('GalleryCtrl', function ($scope, $stateParams, $ionicSlideBoxDelegate, $cacheFactory, $ionicScrollDelegate, $ionicNavBarDelegate, VoatRepository, $cordovaSocialSharing, $ionicPlatform) {

  $scope.minZoom = 1;
  $scope.showNavigation = true;
  $scope.showImageTitle = true;
  var voatPosts = [];
  $scope.selectedSlide = 0;

  function getScrollDelegate() {
    return $ionicScrollDelegate.$getByHandle('scrollHandle-' + $scope.selectedSlide);
  }

  $scope.slideHasChanged = function (centreSlideIndex) {
    var leftSlideIndex = centreSlideIndex === 0 ? 2 : centreSlideIndex - 1,
      rightSlideIndex = centreSlideIndex === 2 ? 0 : centreSlideIndex + 1;

    console.log('Slide indexes and (ids) from left to right. ' + leftSlideIndex + ' (' + $scope.slides[leftSlideIndex].index + ') ' + centreSlideIndex + ' (' + $scope.slides[centreSlideIndex].index + ') ' + rightSlideIndex + ' (' + $scope.slides[rightSlideIndex].index + ') ');

    // sliding from right to left (swiping 'forward')
    if ($scope.slides[leftSlideIndex].index < $scope.slides[centreSlideIndex].index) {
      // slide to the right contains voatPosts with lowest id, replace it with one higher than the current slide
      angular.copy(voatPosts[$scope.slides[centreSlideIndex].index + 1], $scope.slides[rightSlideIndex])
    } else {
      // opposite of above
      angular.copy(voatPosts[$scope.slides[centreSlideIndex].index - 1], $scope.slides[leftSlideIndex])
    }

    // prevent looping when end reached
    if ($scope.slides[centreSlideIndex].index === 0 || $scope.slides[centreSlideIndex].index === voatPosts.length - 1) {
      $ionicSlideBoxDelegate.$getByHandle('slideshow-slidebox')._instances[0].loop(false);
    } else {
      $ionicSlideBoxDelegate.$getByHandle('slideshow-slidebox')._instances[0].loop(true);
    }

    getScrollDelegate().resize();
  };

  var toggleImageOnly = function () {
    $scope.showNavigation = !$scope.showNavigation;
    $scope.showImageTitle = !$scope.showImageTitle;
    $ionicNavBarDelegate.showBar($scope.showNavigation);
  };

  var toggleZoom = function () {
    var scrollDelegate = getScrollDelegate();
    var currentZoomLevel = scrollDelegate.getScrollPosition().zoom;

    if (currentZoomLevel == 1) {
      console.log("image double-tapped while zoomed out: zooming in");
      scrollDelegate.zoomBy(8, true);
    } else {
      console.log("image double-tapped while zoomed in: zooming out");
      scrollDelegate.zoomTo(1, true);
    }

    scrollDelegate.resize();
  };

  $scope.toggleZoomFocusMode = function () {
    toggleZoom();
    toggleImageOnly();
  };

  $scope.updateSlideStatus = function (activeSlideIndex) {
    var scrollDelegate = getScrollDelegate();
    var scrollPosition = scrollDelegate.getScrollPosition();
    var currentZoomLevel = scrollPosition.zoom;

    if (currentZoomLevel == $scope.minZoom) {
      $ionicSlideBoxDelegate.enableSlide(true);
      scrollDelegate.freezeScroll(true);
    } else {
      $ionicSlideBoxDelegate.enableSlide(false);
      scrollDelegate.freezeScroll(false);
    }
  };

  function applyIndexesTo(data) {
    for (var i = 0; i < data.length; i++) {
      angular.extend(data[i], {index: i});
    }
  }

  function init() {
    voatPosts = VoatRepository.getVoatPosts();

    applyIndexesTo(voatPosts); // slider requires images have sequenced indexes

    var selectedSlideId = $stateParams.id;
    var selectedSlideIndex = trueUtility.findWithAttr(voatPosts, 'id', selectedSlideId);
    var initialSlides;

    if (trueUtility.isUndefinedOrNull(selectedSlideIndex)) {
      console.log('ERROR: couldn\'t find post with id: ' + selectedSlideId);
      selectedSlideIndex = 0;
    }

    // three cases to consider
    // initial slide is first
    if (selectedSlideIndex === 0) {
      initialSlides = [angular.copy(voatPosts[0]), angular.copy(voatPosts[1]), angular.copy(voatPosts[2])];
      $scope.selectedSlide = 0;
    }
    // initial slide is last
    else if (selectedSlideIndex === voatPosts.length - 1) {
      initialSlides = [angular.copy(voatPosts[voatPosts.length - 3]), angular.copy(voatPosts[voatPosts.length - 2]), angular.copy(voatPosts[voatPosts.length - 1])];
      $scope.selectedSlide = 2;
    }
    // default
    else {
      initialSlides = [angular.copy(voatPosts[selectedSlideIndex - 1]), angular.copy(voatPosts[selectedSlideIndex]), angular.copy(voatPosts[selectedSlideIndex + 1])];
      $scope.selectedSlide = 1;
    }

    $scope.slides = initialSlides;

  }

  init();
});



