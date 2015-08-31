angular.module('starter.controllers', [])

  .controller('FrontPageCtrl', function ($scope, Chats, $timeout) {

    $scope.doRefresh = function(){

      $timeout(function(){


        //todo call service to get data.
        $scope.$broadcast('scroll.refreshComplete');
      },100);

    };

    $scope.posts = Chats.all();
    $scope.remove = function (chat) {
      Chats.remove(chat);
    };
  })
  .controller('GalleryCtrl', function ($scope, $stateParams, Chats) {
    $scope.images = Chats.all();

    $scope.activeSlide = Chats.get($stateParams.id)
  });


