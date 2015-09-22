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
  //data.push({"nr": -1, "id": "-1", "title": "Title for -1", "link": "https://slimgur.com/images/2015/09/02/6d5e722d6a81b796de7761846d5754a6.jpg"});
  //data.push({"nr": 0, "id": "0", "title": "Title for 0", "link": "https://slimgur.com/images/2015/09/02/9e6e413da2eeac26c5c0bc29bf280541.jpg"});
  //data.push({"nr": 1, "id": "1", "title": "Title for 1", "link": "https://slimgur.com/images/2015/09/07/453336845750fa5a5572da3352d37e4f.jpg"});
  //data.push({"nr": 2, "id": "2", "title": "Title for 2", "link": "https://slimgur.com/images/2015/07/11/9f0d0d5f63b73a2fd8816abe6020eee4.jpg"});
  //data.push({"nr": 3, "id": "3", "title": "Title for 3", "link": "https://slimgur.com/images/2015/09/16/eeff2bbf7d680109a1b754daa4720ae7.png"});
  //data.push({"nr": 4, "id": "4", "title": "Title for 4", "link": "https://slimgur.com/images/2015/08/31/2b45a2c0304fdc2e9f25f409ec2aeeb5.png"});
  //data.push({"nr": 5, "id": "5", "title": "Title for 5", "link": "https://slimgur.com/images/2015/08/21/3d6339e9acb4c91c79d1899c7777ae29.jpg"});
  //data.push({"nr": 6, "id": "6", "title": "Title for 6", "link": "https://slimgur.com/images/2015/07/30/033021bcca2122263c6c49c239b54406.png"});
  //data.push({"nr": 7, "id": "7", "title": "Title for 7", "link": "https://slimgur.com/images/2015/07/11/942168edc5e20cf3bc3a169edf3d8129.gif"});
  //data.push({"nr": 8, "id": "8", "title": "Title for 8", "link": "https://slimgur.com/images/2015/09/22/98849550fd8436f7e44519a8c5b9c353.jpg"});
  //data.push({"nr": 9, "id": "9", "title": "Title for 9", "link": "https://slimgur.com/images/2015/08/10/8a3b3aec3217edfb97227897dd747b27.jpg"});
  //data.push({"nr": 10, "id": "10", "title": "Title for 10", "link": "https://slimgur.com/images/2015/08/04/d454b7af0db4942618d96696683f8ef8.jpg"});
  //data.push({"nr": 11, "id": "11", "title": "Title for 11", "link": "https://slimgur.com/images/2015/07/18/c4b8d20430d95d6a01e27372a77969fd.jpg"});

  //data.push({"nr": -1, "id": "-1", "title": "Title for -1", "link": "https://slimgur.com/images/2015/09/02/6d5e722d6a81b796de7761846d5754a6.jpg"});
  //data.push({"nr": 0, "id": "0", "title": "Title for 0", "link": "https://slimgur.com/images/2015/09/02/9e6e413da2eeac26c5c0bc29bf280541.jpg"});
  //data.push({"nr": 1, "id": "1", "title": "Title for 1", "link": "https://slimgur.com/images/2015/09/07/453336845750fa5a5572da3352d37e4f.jpg"});
  //data.push({"nr": 2, "id": "2", "title": "Title for 2", "link": "https://slimgur.com/images/2015/07/11/9f0d0d5f63b73a2fd8816abe6020eee4.jpg"});
  //data.push({"nr": 3, "id": "3", "title": "Title for 3", "link": "https://slimgur.com/images/2015/09/16/eeff2bbf7d680109a1b754daa4720ae7.png"});
  //data.push({"nr": 4, "id": "4", "title": "Title for 4", "link": "https://slimgur.com/images/2015/08/31/2b45a2c0304fdc2e9f25f409ec2aeeb5.png"});
  //data.push({"nr": 5, "id": "5", "title": "Title for 5", "link": "https://slimgur.com/images/2015/08/21/3d6339e9acb4c91c79d1899c7777ae29.jpg"});
  //data.push({"nr": 6, "id": "6", "title": "Title for 6", "link": "https://slimgur.com/images/2015/07/30/033021bcca2122263c6c49c239b54406.png"});
  //data.push({"nr": 7, "id": "7", "title": "Title for 7", "link": "https://slimgur.com/images/2015/07/11/942168edc5e20cf3bc3a169edf3d8129.gif"});
  //data.push({"nr": 8, "id": "8", "title": "Title for 8", "link": "https://slimgur.com/images/2015/09/22/98849550fd8436f7e44519a8c5b9c353.jpg"});
  //data.push({"nr": 9, "id": "9", "title": "Title for 9", "link": "https://slimgur.com/images/2015/08/10/8a3b3aec3217edfb97227897dd747b27.jpg"});
  //data.push({"nr": 10, "id": "10", "title": "Title for 10", "link": "https://slimgur.com/images/2015/08/04/d454b7af0db4942618d96696683f8ef8.jpg"});
  //data.push({"nr": 11, "id": "11", "title": "Title for 11", "link": "https://slimgur.com/images/2015/07/18/c4b8d20430d95d6a01e27372a77969fd.jpg"});
  //
  //data.push({"id": "-1", "title": "Title for -1", "link": "https://slimgur.com/images/2015/09/02/6d5e722d6a81b796de7761846d5754a6.jpg"});
  data.push({"id": 0, "title": "Title for 0", "link": "https://slimgur.com/images/2015/09/02/9e6e413da2eeac26c5c0bc29bf280541.jpg"});
  data.push({"id": 1, "title": "Title for 1", "link": "https://slimgur.com/images/2015/09/07/453336845750fa5a5572da3352d37e4f.jpg"});
  data.push({"id": 2, "title": "Title for 2", "link": "https://slimgur.com/images/2015/07/11/9f0d0d5f63b73a2fd8816abe6020eee4.jpg"});
  data.push({"id": 3, "title": "Title for 3", "link": "https://slimgur.com/images/2015/09/16/eeff2bbf7d680109a1b754daa4720ae7.png"});
  data.push({"id": 4, "title": "Title for 4", "link": "https://slimgur.com/images/2015/08/31/2b45a2c0304fdc2e9f25f409ec2aeeb5.png"});
  data.push({"id": 5, "title": "Title for 5", "link": "https://slimgur.com/images/2015/08/21/3d6339e9acb4c91c79d1899c7777ae29.jpg"});
  data.push({"id": 6, "title": "Title for 6", "link": "https://slimgur.com/images/2015/07/30/033021bcca2122263c6c49c239b54406.png"});
  data.push({"id": 7, "title": "Title for 7", "link": "https://slimgur.com/images/2015/07/11/942168edc5e20cf3bc3a169edf3d8129.gif"});
  data.push({"id": 8, "title": "Title for 8", "link": "https://slimgur.com/images/2015/09/22/98849550fd8436f7e44519a8c5b9c353.jpg"});
  data.push({"id": 9, "title": "Title for 9", "link": "https://slimgur.com/images/2015/08/10/8a3b3aec3217edfb97227897dd747b27.jpg"});
  data.push({"id": 10, "title": "Title for 10", "link": "https://slimgur.com/images/2015/08/04/d454b7af0db4942618d96696683f8ef8.jpg"});
  data.push({"id": 11, "title": "Title for 11", "link": "https://slimgur.com/images/2015/07/18/c4b8d20430d95d6a01e27372a77969fd.jpg"});

  $scope.showNavigation = true;
  $scope.showImageTitle = true;


  var initialSlides = [angular.copy(data[0]), angular.copy(data[1]), angular.copy(data[2])];
  var startingSlide = 0;

  $scope.selectedSlide = startingSlide;
  $scope.slides = initialSlides;

  function getScrollDelegate () {
    return $ionicScrollDelegate.$getByHandle('scrollHandle-' + $scope.selectedSlide);
  };

  $scope.slideHasChanged = function ( centreSlideIndex ) {
    var leftSlideIndex = centreSlideIndex === 0 ? 2 : centreSlideIndex - 1,
        rightSlideIndex = centreSlideIndex === 2 ? 0 : centreSlideIndex + 1;

    console.log('Slide indexes and (ids) from left to right. ' +leftSlideIndex+ ' (' +$scope.slides[leftSlideIndex].id+ ') ' +centreSlideIndex+ ' (' +$scope.slides[centreSlideIndex].id+ ') ' +rightSlideIndex+ ' (' +$scope.slides[rightSlideIndex].id+ ') ' );

    // sliding from right to left (swiping 'forward')
    if ($scope.slides[leftSlideIndex].id  < $scope.slides[centreSlideIndex].id ) {
      // slide to the right contains data with lowest id, replace it with one higher than the current slide
       angular.copy(data[$scope.slides[centreSlideIndex].id + 1], $scope.slides[rightSlideIndex])
    } else {
      // opposite of above
      angular.copy(data[$scope.slides[centreSlideIndex].id - 1], $scope.slides[leftSlideIndex])
    }

    // lock looping when end reached
    if ($scope.slides[centreSlideIndex].id === 0 || $scope.slides[centreSlideIndex].id === data.length - 1) {
      $ionicSlideBoxDelegate.$getByHandle('slideshow-slidebox')._instances[0].loop(false);
    } else {
      $ionicSlideBoxDelegate.$getByHandle('slideshow-slidebox')._instances[0].loop(true);
    }

    getScrollDelegate().resize();
  };



  $scope.updateSlideStatus = function(activeSlideIndex) {
    var scrollDelegate = getScrollDelegate();
    var scrollPosition = scrollDelegate.getScrollPosition();
    var currentZoomLevel = scrollPosition.zoom;
    //console.log(scrollDelegate.handle + ": Top: " + scrollPosition.top + ". Left: " + scrollPosition.left+ ". Zoom: " + currentZoomLevel);

    if (currentZoomLevel == $scope.minZoom) {
      $ionicSlideBoxDelegate.enableSlide(true);
    } else {
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

  //var httpCache = $cacheFactory.get('voatPosts');
});
