angular
    .module('mainModule', [])
    .controller('mainController', function ($scope) {

        $scope.appName = 'Jeremy';

        return ['$scope'];
    });