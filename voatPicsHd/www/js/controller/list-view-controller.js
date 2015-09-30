var module = angular.module('app.controllers');
module.controller('ListViewCtrl', function ($scope, $timeout, $ionicLoading, $cacheFactory, VoatPostListBuilder) {

  var voatPostCache = $cacheFactory('voatPosts'),
    index = 0;

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
      index = 0;
      loadInitialData();
      $ionicLoading.hide();
      $scope.$broadcast('scroll.refreshComplete');
    }, 1);
  };

  var loadInitialData = function () {
    var url = 'https://voat.co/v/pics';
    VoatPostListBuilder.build(url).then(function (voatPosts) {
      updateVoatPosts(voatPosts);
    });
  };

  var updateVoatPosts = function (voatPosts) {
    $scope.voatPosts = $scope.voatPosts.concat(voatPosts);
    voatPostCache.remove('voatPosts');
    voatPostCache.put('voatPosts', $scope.voatPosts);
  };

  $scope.loadMoreData = function () {
    index = index + 1;
    var url = 'https://voat.co/v/pics';
    VoatPostListBuilder.build(url + '?page=' + index).then(function (voatPosts) {
      updateVoatPosts(voatPosts);
      $ionicLoading.hide();
      $scope.$broadcast('scroll.refreshComplete');
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };

  $scope.$on('$stateChangeSuccess', function () {
    $scope.loadMoreData();
  });
});
