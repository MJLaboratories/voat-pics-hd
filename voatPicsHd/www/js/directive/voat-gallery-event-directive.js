//var module = angular.module('app.controllers');
//
//module.directive('', function ($timeout,$ionicGesture) {
//  return {
//
//    restrict: 'A',
//    link: function (scope,element) {
//      var isDoubleTapAction = false;
//
//      var imageDoubleTapGesture = function imageDoubleTapGesture(event) {
//
//        isDoubleTapAction = true;
//
//        $timeout(function(){
//          isDoubleTapAction = false;
//        },200);
//      };
//
//      var imageTapGesture = function imageTapGesture(event) {
//
//        if(isDoubleTapAction === true){
//          return;
//        }
//        else{
//          $timeout(function(){
//            if(isDoubleTapAction === true){
//
//              scope.toggleZoomFocusMode();
//              return;
//            }
//            else{
//              scope.toggleNav();
//            }
//          },200);
//        }
//      };
//
//      var doubleTapEvent = $ionicGesture.on('doubletap', imageDoubleTapGesture, element);
//      var tapEvent = $ionicGesture.on('tap', imageTapGesture, element);
//
//      scope.$on('$destroy', function() {
//        $ionicGesture.off(doubleTapEvent, 'doubletap', imageDoubleTapGesture);
//        $ionicGesture.off(tapEvent, 'tap', imageTapGesture);
//      });
//    }
//  }
//});
