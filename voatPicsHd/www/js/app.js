angular.module('app', ['ionic', 'app.controllers', 'app.services', 'ngCordova'])

  .run(function ($ionicPlatform) {

    angular.isUndefinedOrNull = function(val) {
      return angular.isUndefined(val) || val === null
    };

    angular.isNumberOrNumericString = function (o) {
      return ! isNaN (o-0) && o !== null && o !== "" && o !== false;
    };

    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }

      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDarkContent();
      }
    });
  })

  .config(function ($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider
      .state('list-view', {
        url: '/',
        templateUrl: 'templates/list-view.html',
        controller: 'ListViewCtrl'
      })
      .state('gallery', {
        url: '/gallery/:id',
        templateUrl: 'templates/gallery.html',
        controller: 'GalleryCtrl'
      }
    );

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/');

  });
