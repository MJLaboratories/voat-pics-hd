var module = angular.module('app.controllers');
module.controller('ListViewCtrl', function ($scope, $timeout, $ionicLoading, VoatRepository) {
  $scope.voatPosts = [];

  var showLoadingSpinner = function () {
    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });
  };

  $scope.doRefresh = function () {
    $timeout(function () {
      refreshData();
    }, 1);
  };

  var refreshData = function () {
    VoatRepository.loadInitialData().then(function (voatPosts) {
      replaceVoatPosts(voatPosts);
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.loadMoreData = function () {
    VoatRepository.loadMoreData().then(function (voatPosts) {
      appendToVoatPosts(voatPosts);
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  var replaceVoatPosts= function (voatPosts) {
    $scope.voatPosts = voatPosts;
  };

  var appendToVoatPosts= function (voatPosts) {
    $scope.voatPosts = $scope.voatPosts.concat(voatPosts);
  };

  $scope.$on('scroll.refreshComplete', function () {
    $ionicLoading.hide();
  });

  $scope.$on('$stateChangeSuccess', function () {
    showLoadingSpinner();
    refreshData();
  });
});
