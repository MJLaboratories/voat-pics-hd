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
      initialiseData();
    }, 0);
  };

  var initialiseData = function () {
    VoatRepository.refreshData().then(function (voatPosts) {
      replaceVoatPosts(voatPosts);
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.loadMoreData = function () {
    VoatRepository.loadMoreData().then(function (newVoatPosts) {
      appendToVoatPosts(newVoatPosts);
      $scope.$broadcast('scroll.infiniteScrollComplete');
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

  var init = function () {
    showLoadingSpinner();
    initialiseData();
  };

  init();
});
