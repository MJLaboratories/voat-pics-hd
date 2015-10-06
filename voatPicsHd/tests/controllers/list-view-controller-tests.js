describe('ListViewCtrl', function () {
  var $controller,
    $scope,
    $timeout,
    $q,
    $ionicLoading,
    mockVoatRepository,
    scopeSpy,
    mockIonicLoading,
    mockDeferred,
    mockPromise,
    stubData = [{id: 'id', title: 'title', link: 'link', image: 'image'}];

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
    mockVoatRepository = jasmine.createSpyObj('CloudFlareProtectedUrlLoader', ['refreshData', 'loadMoreData']);
    //setup the spy to always return the spyPromise for the entire test spec
    mockVoatRepository.refreshData.and.returnValue(mockPromise);
    mockVoatRepository.loadMoreData.and.returnValue(mockPromise);

    // spy on events that are raised
    scopeSpy = spyOn($scope, '$broadcast');
    scopeSpy.and.callThrough();

    //create spy for the service being called so it is mocked out
    mockIonicLoading = jasmine.createSpyObj('$ionicLoading', ['show', 'hide']);

    controller = $controller('ListViewCtrl', {
      $scope: $scope,
      $timeout: $timeout,
      $ionicLoading: mockIonicLoading,
      VoatRepository: mockVoatRepository
    });

    // because the constructor above starts work, we need to reset the state for most tests
    // tests which test the constructor are in the 'when the app first loads' block below
    mockDeferred.resolve(stubData);
    $scope.$apply();
    mockIonicLoading.show.calls.reset();
    mockIonicLoading.hide.calls.reset();
    mockVoatRepository.refreshData.calls.reset();
    mockVoatRepository.loadMoreData.calls.reset();
  });

  describe('when the app first loads', function () {
    beforeEach(function () {
      controller = $controller('ListViewCtrl', {
        $scope: $scope,
        $timeout: $timeout,
        $ionicLoading: mockIonicLoading,
        VoatRepository: mockVoatRepository
      });
    });

    it('voatPosts initialised with an empty array', function () {
      expect($scope.voatPosts).toEqual([]);
    });

    it('data call is made', function () {
      expect(mockVoatRepository.refreshData).toHaveBeenCalled();
    });

    it('loading spinner is shown', function () {
      expect(mockIonicLoading.show).toHaveBeenCalled();
    });

    describe('when the data call completes', function () {
      beforeEach(function () {
        mockDeferred.resolve(stubData);
        $scope.$apply();
      });

      it('the result is stored', function () {
        expect($scope.voatPosts).toEqual(stubData);
      });

      it('scroll.refreshComplete is broadcast', function () {
        expect(scopeSpy).toHaveBeenCalledWith('scroll.refreshComplete');
      });
    });
  });

    describe('doRefresh', function () {
      beforeEach(function () {
        $scope.voatPosts = [{hello: 'hello'}];
        $scope.doRefresh();
        $timeout.flush();
      });

      it('initial data call is made', function () {
        expect(mockVoatRepository.refreshData).toHaveBeenCalled();
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

    describe('loadMoreData', function () {
      var initialData;

      beforeEach(function () {
        initialData = $scope.voatPosts;
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
          var concatenatedData = initialData.concat(stubData);
          expect($scope.voatPosts).toEqual(concatenatedData);
        });

        it('scroll.infiniteScrollComplete is broadcast', function () {
          expect(scopeSpy).toHaveBeenCalledWith('scroll.infiniteScrollComplete');
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
