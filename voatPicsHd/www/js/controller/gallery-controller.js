var module = angular.module('app.controllers');
module.controller('GalleryCtrl', function ($scope, $stateParams, $cacheFactory, $ionicSlideBoxDelegate, $ionicScrollDelegate) {

  function findWithAttr(array, attr, value) {
    for (var i = 0; i < array.length; i += 1) {
      if (array[i][attr] === value) {
        return i;
      }
    }
  }


  $scope.fitImageToScreen = true;
  var slideEnabled = true;


  function toggleFitImageToScreen() {
    $scope.fitImageToScreen = !$scope.fitImageToScreen;
    $scope.$broadcast('scroll.resize');
  };

  function toggleSwiperEnabled () {
    slideEnabled = !slideEnabled;
    $ionicSlideBoxDelegate.enableSlide(slideEnabled);
  };

  function resetImagePosition () {
    var dontAnimate = false;
    $ionicScrollDelegate.scrollTo(0, 0, dontAnimate);
  }

  $scope.slideHasChanged = function ($index) {
    console.log("active slide changed: " + $index);
  };
  
  $scope.imageTapped = function () {
    console.log("image tapped");
    toggleFitImageToScreen();
    toggleSwiperEnabled();
    resetImagePosition();

    // possible to use zoom animations and scroll to tapped location
    // see http://forum.ionicframework.com/t/how-to-get-pagex-and-pagey-for-on-tap-event/6817/2
    // http://ionicframework.com/docs/api/service/$ionicScrollDelegate/
  };

  var httpCache = $cacheFactory.get('voatPosts');
  $scope.voatPosts = httpCache.get('voatPosts');
  $scope.activeSlideId = parseInt($stateParams.id);
  $scope.activeSlideIndex = findWithAttr($scope.voatPosts, 'id', $scope.activeSlideId);
});
