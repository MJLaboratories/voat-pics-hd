var module = angular.module('app.controllers');
module.controller('GalleryCtrl', function ($scope, $stateParams, $cacheFactory, $ionicSlideBoxDelegate, $ionicScrollDelegate, $ionicNavBarDelegate, $cordovaStatusbar) {

  function findWithAttr(array, attr, value) {
    for (var i = 0; i < array.length; i += 1) {
      if (array[i][attr] === value) {
        return i;
      }
    }
  }

  $scope.minZoom = 1;
  var data = [];
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

    if ($scope.showNavigation) {
      $cordovaStatusbar.show();
    } else {
      $cordovaStatusbar.hide();
    }

    
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


$scope.voatPosts.push({"id": "1", "title": "Title for 1", "link": "https://slimgur.com/images/2015/09/07/453336845750fa5a5572da3352d37e4f.jpg"});
$scope.voatPosts.push({"id": "2", "title": "Title for 2", "link": "https://slimgur.com/images/2015/07/11/9f0d0d5f63b73a2fd8816abe6020eee4.jpg"});
$scope.voatPosts.push({"id": "3", "title": "Title for 3", "link": "https://slimgur.com/images/2015/09/16/eeff2bbf7d680109a1b754daa4720ae7.png"});
$scope.voatPosts.push({"id": "4", "title": "Title for 4", "link": "https://slimgur.com/images/2015/08/31/2b45a2c0304fdc2e9f25f409ec2aeeb5.png"});
$scope.voatPosts.push({"id": "5", "title": "Title for 5", "link": "https://slimgur.com/images/2015/08/21/3d6339e9acb4c91c79d1899c7777ae29.jpg"});
$scope.voatPosts.push({"id": "6", "title": "Title for 6", "link": "https://slimgur.com/images/2015/07/30/033021bcca2122263c6c49c239b54406.png"});
$scope.voatPosts.push({"id": "7", "title": "Title for 7", "link": "https://slimgur.com/images/2015/07/11/942168edc5e20cf3bc3a169edf3d8129.gif"});
$scope.voatPosts.push({"id": "8", "title": "Title for 8", "link": "https://slimgur.com/images/2015/09/22/98849550fd8436f7e44519a8c5b9c353.jpg"});
$scope.voatPosts.push({"id": "9", "title": "Title for 9", "link": "https://slimgur.com/images/2015/08/10/8a3b3aec3217edfb97227897dd747b27.jpg"});
$scope.voatPosts.push({"id": "10", "title": "Title for 10", "link": "https://slimgur.com/images/2015/08/04/d454b7af0db4942618d96696683f8ef8.jpg"});
$scope.voatPosts.push({"id": "11", "title": "Title for 11", "link": "https://slimgur.com/images/2015/07/18/c4b8d20430d95d6a01e27372a77969fd.jpg"});
$scope.voatPosts.push({"id": "12", "title": "Title for 12", "link": "https://slimgur.com/images/2015/09/02/6d5e722d6a81b796de7761846d5754a6.jpg"});
$scope.voatPosts.push({"id": "13", "title": "Title for 13", "link": "https://slimgur.com/images/2015/09/02/9e6e413da2eeac26c5c0bc29bf280541.jpg"});

  


  $scope.activeSlideId = parseInt($stateParams.id);
  $scope.activeSlideIndex = findWithAttr($scope.voatPosts, 'id', $scope.activeSlideId);
});
