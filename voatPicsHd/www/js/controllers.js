angular.module('starter.controllers', [])

  .controller('FrontPageCtrl', function ($scope, VoatPostalService, $timeout) {
    $scope.doRefresh = function(){
      $timeout(function(){
        VoatPostalService.all().then(function(voatPosts) {
          $scope.posts = voatPosts;
          $scope.$broadcast('scroll.refreshComplete');
        });
      },100);
    };

    $scope.posts = [];

    $scope.remove = function (post) {
      VoatPostalService.remove(post);
    };
  })

  .controller('GalleryCtrl', function ($scope, $stateParams, VoatPostalService) {
    // do we want this to load data?
    VoatPostalService.all().then(function(voatPosts) {
      $scope.images = voatPosts;
    });

    if (!$scope.images) {
      return;
    }

    // please replace with nice way to select from an array - I can't remember how'
      for (var i = 0; i < $scope.images.length; i++) {
        if ($scope.images[i].id === parseInt($stateParams.id)) {
          $scope.activeSlide = $scope.images[i];
        }
      }
  });


