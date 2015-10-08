var module = angular.module('app.controllers');

module.controller('GalleryCtrl', function ($scope, $stateParams, $ionicSlideBoxDelegate, $ionicScrollDelegate, $ionicNavBarDelegate, VoatRepository) {
  var REMAINING_SLIDES_TRIGGER_PRELOAD_COUNT = 10;
  $scope.minZoom = 1;
  $scope.showNavigation = true;
  $scope.showImageTitle = true;
  var voatPosts = [];
  $scope.selectedSlide = 0;
  var isLoadingMoreData = false;

  function getCurrentSlideScrollDelegate() {
    return $ionicScrollDelegate.$getByHandle('scrollHandle-' + $scope.selectedSlide);
  }

  function applyIndexesTo(data) {
    for (var i = 0; i < data.length; i++) {
      angular.extend(data[i], {infiniteScrollDataIndex: i});
    }
  }

  var addToVoatPosts = function (newVoatPosts) {
    var tempVoatPosts = voatPosts.concat(newVoatPosts);
    applyIndexesTo(tempVoatPosts); // infinite slider requires an index on the data
    voatPosts = tempVoatPosts;
  };

  var withinTenSlidesOfTheEnd = function (index) {
    return index > ((voatPosts.length - 1) - REMAINING_SLIDES_TRIGGER_PRELOAD_COUNT);
  };

  $scope.slideHasChanged = function (centreSlideIndex) {
    var centreSlideDataIndex = $scope.slides[centreSlideIndex].infiniteScrollDataIndex;
    if (withinTenSlidesOfTheEnd(centreSlideDataIndex) && !isLoadingMoreData) {
      isLoadingMoreData = true;

      VoatRepository.loadMoreData().then(function (newVoatPosts) {
        isLoadingMoreData = false;
        addToVoatPosts(newVoatPosts);
      });
    }

    var leftSlideIndex = centreSlideIndex === 0 ? 2 : centreSlideIndex - 1,
      rightSlideIndex = centreSlideIndex === 2 ? 0 : centreSlideIndex + 1;

    // sliding from right to left (swiping 'forward')
    if ($scope.slides[leftSlideIndex].infiniteScrollDataIndex < $scope.slides[centreSlideIndex].infiniteScrollDataIndex) {
      // right slide contains voatPost with lowest id, replace it with one higher than the centre slide
      angular.copy(voatPosts[$scope.slides[centreSlideIndex].infiniteScrollDataIndex + 1], $scope.slides[rightSlideIndex])
    } else {
      // opposite of above
      angular.copy(voatPosts[$scope.slides[centreSlideIndex].infiniteScrollDataIndex - 1], $scope.slides[leftSlideIndex])
    }

    // prevent looping when end reached
    // TODO: fix the bug with not detecting the end if the number of slides % 2 != 0
    if ($scope.slides[centreSlideIndex].infiniteScrollDataIndex === 0 || $scope.slides[centreSlideIndex].infiniteScrollDataIndex === voatPosts.length - 1) {
      $ionicSlideBoxDelegate.$getByHandle('slideshow-slidebox')._instances[0].loop(false);
    } else {
      $ionicSlideBoxDelegate.$getByHandle('slideshow-slidebox')._instances[0].loop(true);
    }

    getCurrentSlideScrollDelegate().resize();
  };

  $scope.toggleImageOnly = function () {
    $scope.showImageTitle = !$scope.showImageTitle;
    $ionicNavBarDelegate.showBar($scope.showNavigation);
  };

  $scope.toggleZoom = function () {
    var scrollDelegate = getCurrentSlideScrollDelegate();
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

  $scope.updateSlideStatus = function (activeSlideIndex) {
    var scrollDelegate = getCurrentSlideScrollDelegate();
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

  function init() {
    var initialVoatPosts = VoatRepository.getVoatPosts();
    addToVoatPosts(initialVoatPosts);

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



