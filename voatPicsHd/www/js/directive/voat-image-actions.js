angular.module('app.directives').directive('voatImageActions', ['$timeout', '$ionicGesture', function ($timeout, $ionicGesture) {
  return {
    restrict: 'A',
    link: function (scope, element) {
      var tapCount = 0;


      var imageTapGesture = function imageTapGesture(event) {
        tapCount++;

        if (tapCount == 1) {
          $timeout(function () {
            try {
              if (tapCount === 1) {
                scope.onSingleTap();
              } else {
                scope.onDoubleTap();
              }
            } finally {
              tapCount = 0;
            }
          }, 450);
        }
      };

      var tapEvent = $ionicGesture.on('tap', imageTapGesture, element);

      scope.$on('$destroy', function () {
        $ionicGesture.off(tapEvent, 'tap', imageTapGesture);
      });
    }
  }
}]);

