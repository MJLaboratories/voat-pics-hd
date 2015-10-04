describe('ListViewCtrl', function () {
  var $controller,
    $scope,
    $timeout,
    $q,
    $ionicLoading,
    mockVoatRepository,
    mockScopeBroadcast,
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

  beforeEach(function () {
    //create a promise for the spy to return to mock the async calls to the service
    mockDeferred = $q.defer();
    mockPromise = mockDeferred.promise;

    mockPromise.success = function (fn) {
      mockPromise.then(function (data) {
        fn(data);
      });
      return mockPromise;
    };

    //create spy for the service being called so it is mocked out
    mockVoatRepository = jasmine.createSpyObj('VoatRepository', ['loadInitialData', 'loadMoreData']);
    //setup the spy to always return the spyPromise for the entire test spec
    mockVoatRepository.loadInitialData.and.returnValue(mockPromise);
    mockVoatRepository.loadMoreData.and.returnValue(mockPromise);

    // spy on events that are raised
    mockScopeBroadcast = jasmine.createSpyObj('$scope', ['$broadcast']);

    //create spy for the service being called so it is mocked out
    mockIonicLoading = jasmine.createSpyObj('$ionicLoading', ['show', 'hide']);

    controller = $controller('ListViewCtrl', {
      $scope: $scope,
      $timeout: $timeout,
      $ionicLoading: mockIonicLoading,
      VoatRepository: mockVoatRepository
    });
  });


  describe('when the app first loads', function () {

    it('should have initialised with an empty data array', function () {
      expect($scope.voatPosts).toEqual([]);
    });

    it('data service should not have been called yet', function () {
      expect(mockVoatRepository.loadInitialData).not.toHaveBeenCalled();
    });

    describe('when the stateChangeEvent is fired', function () {
      beforeEach(function () {
        $scope.$broadcast('$stateChangeSuccess');
      });

      it('data call is made', function () {
        expect(mockVoatRepository.loadInitialData).toHaveBeenCalled();
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

        it('scroll.refreshComplete is broadcast', function () {
          expect(mockScopeBroadcast.$broadcast).toHaveBeenCalledWith('scroll.refreshComplete');
        });
      });
    });
  });

  describe('when a manual refresh is triggered and data already exists', function () {
    beforeEach(function () {
      $scope.voatPosts = [{hello: 'hello'}];
      $scope.doRefresh();
      $timeout.flush();
    });

    it('initial data call is made', function () {
      expect(mockVoatRepository.loadInitialData).toHaveBeenCalled();
    });

    it('loading spinner is NOT shown', function () {
      expect(mockIonicLoading.show).not.toHaveBeenCalled();
    });

    describe('when the data call completes', function () {
      var stubData = [{id: 'id', title: 'title', link: 'link', image: 'image'}];

      beforeEach(function () {
        mockDeferred.resolve(stubData);
        $scope.$apply();
      });

      it('new data replaces existing data', function () {
        expect($scope.voatPosts).toEqual(stubData);
      });
    });
  });

  describe('when load more is triggered and data already exists', function () {
    var existingData = [{hello: 'hello'}];

    beforeEach(function () {
      $scope.voatPosts = existingData;
      $scope.loadMoreData();
    });

    it('more data call is made', function () {
      expect(mockVoatRepository.loadMoreData).toHaveBeenCalled();
    });

    it('loading spinner is NOT shown', function () {
      expect(mockIonicLoading.show).not.toHaveBeenCalled();
    });

    describe('when the data call completes', function () {
      var stubData = [{id: 'id', title: 'title', link: 'link', image: 'image'}];

      beforeEach(function () {
        mockDeferred.resolve(stubData);
        $scope.$apply();
      });

      it('new data is concatenated to existing data', function () {
        var concatenatedData = existingData.concat(stubData);
        expect($scope.voatPosts).toEqual(concatenatedData);
      });
    });


  });

  describe('when scroll.refreshComplete is broadcast', function () {
    beforeEach(function () {
      $scope.$broadcast('scroll.refreshComplete');
    });

    it('the loading spinner is hidden', function () {
      expect(mockIonicLoading.hide).toHaveBeenCalled();
    });
  });
});
