var module = angular.module('app.controllers');
module.controller('FrontPageCtrl', function ($scope, VoatPostalService, $timeout, $ionicLoading) {

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
    }, 1);

  };

  $scope.doRefresh();
});
