describe('ListViewCtrl', function () {
  var $controller,
      $scope,
      $timeout,
      $q,
      $ionicLoading,
      mockVoatScraper,
      mockIonicLoading,
      mockDeferred,
      mockPromise;

  beforeEach(module('ionic'));
  beforeEach(module('app.services'));
  beforeEach(module('app.controllers'));
  beforeEach(module('app.model'));

  beforeEach(inject(function (_$rootScope_, _$controller_, _$q_, _$timeout_, _$ionicLoading_) {
    $controller = _$controller_;
    $scope = _$rootScope_.$new();
    $timeout = _$timeout_;
    $q = _$q_;
    $ionicLoading = _$ionicLoading_;
  }));

  beforeEach(inject(function () {
    //create a promise for the spy to return to mock the async calls to the service
    mockDeferred = $q.defer();
    mockPromise = mockDeferred.promise;

    mockPromise.success = function (fn) {
      mockPromise.then( function (data) {
        fn(data);
      });
      return mockPromise;
    };

    //create spy for the service being called so it is mocked out
    mockVoatScraper = jasmine.createSpyObj('VoatRepository', ['loadInitialData']);
    //setup the spy to always return the spyPromise for the entire test spec
    mockVoatScraper.loadInitialData.and.returnValue(mockPromise);

    //create spy for the service being called so it is mocked out
    mockIonicLoading = jasmine.createSpyObj('$ionicLoading', ['show', 'hide']);

    controller = $controller('ListViewCtrl', {$scope: $scope, VoatRepository: mockVoatScraper,  $timeout: $timeout, $ionicLoading: mockIonicLoading});
  }));

  describe('when the app first loads', function () {
    beforeEach(function() {
      $timeout.flush();
    });

    it('should have initialised with an empty data array', function () {
      expect($scope.voatPosts).toEqual([]);
    });

    it('data service should not have been called yet', function () {
      expect(mockVoatScraper.loadInitialData).not.toHaveBeenCalled();
    });

    describe('when the stateChangeEvent is fired', function () {
      beforeEach(function () {
        $scope.$broadcast('$stateChangeSuccess');
      });

      it('data call is made', function () {
        expect(mockVoatScraper.loadInitialData).toHaveBeenCalled();
      });

      it('loading spinner is shown', function () {
        expect(mockIonicLoading.show).toHaveBeenCalled();
      });

      describe('when the data call completes', function () {
        var stubData = [{id: 'id', title: 'title', link: 'link', image: 'image'}];

        beforeEach(function () {
          mockDeferred.resolve(stubData);
          $scope.$apply();
        });

        it('the result is stored', function () {
          expect($scope.voatPosts).toEqual(stubData);
        });
      });
    });
  });
});
