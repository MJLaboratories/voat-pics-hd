angular.module('starter.controllers', [])

  .controller('FrontPageCtrl', function ($scope, VoatPostalService, $timeout, $ionicLoading) {

    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });

    $scope.voatPosts = [];

    $scope.doRefresh = function () {
      $timeout(function () {
        VoatPostalService.all().then(function (voatPosts) {
          $scope.voatPosts = voatPosts;
          $ionicLoading.hide();
          $scope.$broadcast('scroll.refreshComplete');
        });
      }, 100);
    };
    $scope.doRefresh();
  })

  .controller('GalleryCtrl', function ($scope, $stateParams, $cacheFactory) {

    function findWithAttr(array, attr, value) {
      for(var i = 0; i < array.length; i += 1) {
        if(array[i][attr] === value) {
          return i;
        }
      }
    }
    var httpCache = $cacheFactory.get('voatPosts');
    $scope.voatPosts = httpCache.get('voatPosts');
    $scope.activeSlideId = parseInt($stateParams.id);

    $scope.initialSlideIndex = findWithAttr($scope.voatPosts,'id',$scope.activeSlideId);

  });


