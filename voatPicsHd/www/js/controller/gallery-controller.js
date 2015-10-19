var module = angular.module('app.controllers');
module.controller('GalleryCtrl', function ($scope, $stateParams, $ionicSlideBoxDelegate, $ionicScrollDelegate, $ionicNavBarDelegate, VoatRepository, $timeout) {
  var voatPosts = [];
  $scope.MIN_ZOOM = 1;
  $scope.selectedSlide = 0;

  function getCurrentSlideScrollDelegate() {
    return $ionicScrollDelegate.$getByHandle('scrollHandle-' + $scope.selectedSlide);
  }

  var getSlideBoxDelegate = function () {
    return $ionicSlideBoxDelegate.$getByHandle('slideshow-slidebox')._instances[0];
  };

  function applyIndexesTo(data) {
    for (var i = 0; i < data.length; i++) {
      angular.extend(data[i], {infiniteScrollDataIndex: i});
    }
  }

  var appendNewVoatPosts = function (newVoatPosts) {
    var tempVoatPosts = voatPosts.concat(newVoatPosts);
    applyIndexesTo(tempVoatPosts); // infinite slider requires an ordinal index on the data
    voatPosts = tempVoatPosts;
  };

  var REMAINING_SLIDES_TRIGGER_PRELOAD_COUNT = 10;
  var withinTenSlidesOfTheEnd = function (index) {
    return index > ((voatPosts.length - 1) - REMAINING_SLIDES_TRIGGER_PRELOAD_COUNT);
  };

  var shouldLoadMoreData = function (index) {
    return withinTenSlidesOfTheEnd(index) && !isCurrentlyLoadingMoreData;
  };

  var isCurrentlyLoadingMoreData = false;
  var loadMoreData = function () {
    isCurrentlyLoadingMoreData = true;

    VoatRepository.loadMoreData().then(function (newVoatPosts) {
      isCurrentlyLoadingMoreData = false;
      appendNewVoatPosts(newVoatPosts);
    });
  };

  var updateSlidePositions = function (centreSlideIndex) {
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
  };

  var preventSwipingPastEndSlide = function (currentSlideDataIndex) {
    var isEndSlide = currentSlideDataIndex === 0 || currentSlideDataIndex === voatPosts.length - 1;
    var enableSlideLooping = !isEndSlide;
    getSlideBoxDelegate().loop(enableSlideLooping);
  };

  $scope.slideHasChanged = function (centreSlideIndex) {
    var centreSlideDataIndex = $scope.slides[centreSlideIndex].infiniteScrollDataIndex;

    if (shouldLoadMoreData(centreSlideDataIndex)) {
      loadMoreData();
    }

    updateSlidePositions(centreSlideIndex);
    preventSwipingPastEndSlide(centreSlideDataIndex);
    getCurrentSlideScrollDelegate().resize();
  };


  // __  /   _ \    _ \    \  |       \  |   _ \   __ \   ____|
  //    /   |   |  |   |  |\/ |      |\/ |  |   |  |   |  __|
  //   /    |   |  |   |  |   |      |   |  |   |  |   |  |
  //  ____| \___/  \___/  _|  _|     _|  _| \___/  ____/  _____|

  $scope.showNavigation = true;
  $scope.showFullSizeImage = false;

  var toggleFullSizeImage = function (value) {
    var scrollDelegate = getCurrentSlideScrollDelegate();
    $scope.showFullSizeImage = value;

    // required?
    $timeout(function () {
      scrollDelegate.resize();
    }, 30);
  };

  var toggleMinimalUI = function (value) {
    $scope.showNavigation = !value;
    $ionicNavBarDelegate.showBar(!value);
  };

  var toggleImageScrolling = function (value) {
    getCurrentSlideScrollDelegate().freezeScroll(!value);
  };

  var toggleSlideSwiping = function (value) {
    $ionicSlideBoxDelegate.enableSlide(value);
  };

  var isZoomMode = false;
  var toggleZoomMode = function (doZoomMode) {
    var isZoomMode = trueUtility.isUndefinedOrNull(doZoomMode) ? !isZoomMode : doZoomMode;

    toggleFullSizeImage(isZoomMode);
    toggleMinimalUI(isZoomMode);
    toggleImageScrolling(isZoomMode);
    toggleSlideSwiping(!isZoomMode);
  };

  var toggleZoomed = function () {
    var scrollDelegate = getCurrentSlideScrollDelegate();
    var currentZoomLevel = scrollDelegate.getScrollPosition().zoom;

    if (currentZoomLevel == 1) {
      $timeout(function () {
        scrollDelegate.zoomBy(2, true);
      }, 10);
    } else {
      $timeout(function () {
        scrollDelegate.zoomTo(1, true);
      }, 10);
    }

    // required?
    $timeout(function () {
      scrollDelegate.resize();
    }, 30);
  };

  $scope.onDoubleTap = function () {
    toggleZoomMode();
    toggleZoomed();
  };

  $scope.updateSlideStatus = function (activeSlideIndex) {
    var scrollDelegate = getCurrentSlideScrollDelegate();
    var scrollPosition = scrollDelegate.getScrollPosition();
    var currentZoomLevel = scrollPosition.zoom;

    var shouldRemoveZoomMode = (isZoomMode && currentZoomLevel == $scope.MIN_ZOOM);
    if (shouldRemoveZoomMode) {
      toggleZoomMode(false);
    }
  };

  var initSlides = function () {
    var selectedSlideId = $stateParams.id;
    var selectedSlideIndex = trueUtility.findWithAttr(voatPosts, 'id', selectedSlideId);
    var initialSlides;

    // default to first slide
    if (trueUtility.isUndefinedOrNull(selectedSlideIndex)) {
      selectedSlideIndex = 0;
    }

    // three cases to consider
    // initial slide is the first slide
    if (selectedSlideIndex === 0) {
      initialSlides = [angular.copy(voatPosts[0]), angular.copy(voatPosts[1]), angular.copy(voatPosts[2])];
      $scope.selectedSlide = 0;
    }
    // initial slide is the last slide
    else if (selectedSlideIndex === voatPosts.length - 1) {
      initialSlides = [angular.copy(voatPosts[voatPosts.length - 3]), angular.copy(voatPosts[voatPosts.length - 2]), angular.copy(voatPosts[voatPosts.length - 1])];
      $scope.selectedSlide = 2;
    }
    // initial slide is somewhere in the middle
    else {
      initialSlides = [angular.copy(voatPosts[selectedSlideIndex - 1]), angular.copy(voatPosts[selectedSlideIndex]), angular.copy(voatPosts[selectedSlideIndex + 1])];
      $scope.selectedSlide = 1;
    }

    $scope.slides = initialSlides;
  };

  function init() {
    var initialVoatPosts = VoatRepository.getVoatPosts();
    appendNewVoatPosts(initialVoatPosts);

    initSlides();
  }

  init();
});



