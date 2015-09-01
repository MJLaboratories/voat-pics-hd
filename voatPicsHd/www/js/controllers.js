angular.module('starter.controllers', [])

  .controller('FrontPageCtrl', function ($scope, VoatPostalService, $timeout) {
    $scope.doRefresh = function () {
      $timeout(function () {
        VoatPostalService.all().then(function (voatPosts) {
          $scope.voatPosts = voatPosts;
          $scope.$broadcast('scroll.refreshComplete');
        });
      }, 100);
    };

    $scope.doRefresh();

    $scope.voatPosts = [];

    $scope.remove = function (post) {
      VoatPostalService.remove(post);
    };
  })

  .controller('GalleryCtrl', function ($rootScope, $scope, $stateParams, VoatPostalService) {

    //We can use the swiper object to navigate to certain slides. Just need to get routing setup to get the id from the list view.
    $scope.swiper = {};

    $scope.onReadySwiper = function (swiper) {

      $scope.swiper = swiper;
    };

    VoatPostalService.all().then(function (voatPosts) {
      $scope.voatPosts = voatPosts;
    });

    if (!$scope.voatPosts) {
      return;
    }

    // please replace with nice way to select from an array - I can't remember how'
    for (var i = 0; i < $scope.images.length; i++) {
      if ($scope.images[i].id === parseInt($stateParams.id)) {
        $scope.activeSlide = $scope.images[i];
      }
    }
  });


