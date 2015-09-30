var module = angular.module('app.controllers');
module.controller('GalleryCtrl', function ($scope, $stateParams, $cacheFactory, $ionicSlideBoxDelegate, $ionicScrollDelegate, $ionicNavBarDelegate) {

  function findWithAttr(array, attr, value) {
    for (var i = 0; i < array.length; i += 1) {
      if (array[i][attr] == value) {
        return i;
      }
    }
  }

  $scope.minZoom = 1;
  $scope.showNavigation = true;
  $scope.showImageTitle = true;
  var data = [];
  $scope.selectedSlide = 0;

  function getScrollDelegate() {
    return $ionicScrollDelegate.$getByHandle('scrollHandle-' + $scope.selectedSlide);
  };

  $scope.slideHasChanged = function (centreSlideIndex) {
    var leftSlideIndex = centreSlideIndex === 0 ? 2 : centreSlideIndex - 1,
      rightSlideIndex = centreSlideIndex === 2 ? 0 : centreSlideIndex + 1;

    console.log('Slide indexes and (ids) from left to right. ' + leftSlideIndex + ' (' + $scope.slides[leftSlideIndex].index + ') ' + centreSlideIndex + ' (' + $scope.slides[centreSlideIndex].index + ') ' + rightSlideIndex + ' (' + $scope.slides[rightSlideIndex].index + ') ');

    // sliding from right to left (swiping 'forward')
    if ($scope.slides[leftSlideIndex].index < $scope.slides[centreSlideIndex].index) {
      // slide to the right contains data with lowest id, replace it with one higher than the current slide
      angular.copy(data[$scope.slides[centreSlideIndex].index + 1], $scope.slides[rightSlideIndex])
    } else {
      // opposite of above
      angular.copy(data[$scope.slides[centreSlideIndex].index - 1], $scope.slides[leftSlideIndex])
    }

    // prevent looping when end reached
    if ($scope.slides[centreSlideIndex].index === 0 || $scope.slides[centreSlideIndex].index === data.length - 1) {
      $ionicSlideBoxDelegate.$getByHandle('slideshow-slidebox')._instances[0].loop(false);
    } else {
      $ionicSlideBoxDelegate.$getByHandle('slideshow-slidebox')._instances[0].loop(true);
    }

    getScrollDelegate().resize();
  };

  function toggleImageOnly() {
    $scope.showNavigation = !$scope.showNavigation;
    $scope.showImageTitle = !$scope.showImageTitle;
    $ionicNavBarDelegate.showBar($scope.showNavigation);
  };

  function toggleZoom() {
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
    data = httpCache.get('voatPosts');
    applyIndexesTo(data); // slider requires images have sequenced indexes

    var selectedSlideId = $stateParams.id;
    var selectedSlideIndex = findWithAttr(data, 'id', selectedSlideId);
    var initialSlides;

    if (angular.isUndefinedOrNull(selectedSlideIndex)) {
      console.log('ERROR: couldn\'t find post with id: ' +selectedSlideId);
      selectedSlideIndex = 0;
    }

    // three cases to consider
    // initial slide is first
    if (selectedSlideIndex === 0) {
      initialSlides = [angular.copy(data[0]), angular.copy(data[1]), angular.copy(data[2])];
      $scope.selectedSlide = 0;
    }
    // initial slide is last
    else if (selectedSlideIndex === data.length - 1) {
      initialSlides = [angular.copy(data[data.length - 3]), angular.copy(data[data.length - 2]), angular.copy(data[data.length - 1])];
      $scope.selectedSlide = 2;
    }
    // default
    else {
      initialSlides = [angular.copy(data[selectedSlideIndex - 1]), angular.copy(data[selectedSlideIndex]), angular.copy(data[selectedSlideIndex + 1])];
      $scope.selectedSlide = 1;
    }

    $scope.slides = initialSlides;
  }

  var httpCache = $cacheFactory.get('voatPosts');
  init();
})



.directive('navBarClass', function() {
  return {
    restrict: 'A',
    compile: function(element, attrs) {

      // We need to be able to add a class the cached nav-bar
      // Which provides the background color
      var cachedNavBar = document.querySelector('.nav-bar-block[nav-bar="cached"]');
      var cachedHeaderBar = cachedNavBar.querySelector('.bar-header');

      // And also the active nav-bar
      // which provides the right class for the title
      var activeNavBar = document.querySelector('.nav-bar-block[nav-bar="active"]');
      var activeHeaderBar = activeNavBar.querySelector('.bar-header');
      var barClass = attrs.navBarClass;
      var ogColors = [];
      var colors = ['positive', 'stable', 'light', 'royal', 'dark', 'assertive', 'calm', 'energized'];
      var cleanUp = function() {
        for (var i = 0; i < colors.length; i++) {
          var currentColor = activeHeaderBar.classList.contains('bar-' + colors[i]);
          if (currentColor) {
            ogColors.push('bar-' + colors[i]);
          }
          activeHeaderBar.classList.remove('bar-' + colors[i]);
          cachedHeaderBar.classList.remove('bar-' + colors[i]);
        }
      };
      return function($scope) {
        $scope.$on('$ionicView.beforeEnter', function() {
          cleanUp();
          cachedHeaderBar.classList.add(barClass);
          activeHeaderBar.classList.add(barClass);
        });

        $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
          for (var j = 0; j < ogColors.length; j++) {
            activeHeaderBar.classList.add(ogColors[j]);
            cachedHeaderBar.classList.add(ogColors[j]);
          }
          cachedHeaderBar.classList.remove(barClass);
          activeHeaderBar.classList.remove(barClass);
          ogColors = [];

        });
      };
    }
  };
});
