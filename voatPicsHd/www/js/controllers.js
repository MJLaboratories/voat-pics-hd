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

    function findWithAttr(array, attr, value) {
      for(var i = 0; i < array.length; i += 1) {
        if(array[i][attr] === value) {
          return i;
        }
      }
    }

    $scope.activeSlideId = parseInt($stateParams.id);

    VoatPostalService.all().then(function (voatPosts) {
      $scope.voatPosts = voatPosts;
      $scope.initialSlideIndex = findWithAttr($scope.voatPosts,'id',$scope.activeSlideId);
    });

  });


