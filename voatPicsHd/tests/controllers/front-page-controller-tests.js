describe('FrontPageCtrl', function () {
  var controller, $scope, $timeout, mockVoatPostalService, mockDeferred, mockPromise;

  beforeEach(module('app.services'));
  beforeEach(module('ionic'));
  beforeEach(module('app.controllers'));


  beforeEach(inject(function ($rootScope, $controller, $q, $timeout, $ionicLoading) {
    this.$scope = $rootScope.$new();
    this.$timeout = $timeout;

    //create a promise for the spy to return to mock the async calls to the service
    mockDeferred = $q.defer();
    mockPromise = mockDeferred.promise;

    //create spy for the service being called so it is mocked out
    mockVoatPostalService = jasmine.createSpyObj('VoatPostalService', ['all']);
    //setup the spy to always return the spyPromise for the entire test spec
    mockVoatPostalService.all.and.returnValue(mockPromise);

    mockPromise.success = function (fn) {
      mockPromise.then( function (data) {
        fn(data);
      });
      return mockPromise;
    };

    controller = $controller('FrontPageCtrl', {$scope: this.$scope, VoatPostalService: mockVoatPostalService,  $timeout: this.$timeout, $ionicLoading: $ionicLoading});

  }));

  describe('when the app first loads', function () {
    beforeEach(function() {
      this.$timeout.flush();
    });

    it('should have initialised with an empty data array', function () {
      expect(this.$scope.voatPosts).toEqual([]);
    });

    it('should call voatPostalService.all', function () {
      expect(mockVoatPostalService.all).toHaveBeenCalled();
    });

    describe('when the service call for data completes', function () {
      var data = [{id: 'id', title: 'title', link: 'link', image: 'image'}];

      beforeEach(function () {
        mockDeferred.resolve(data);
        this.$scope.$apply();
      });

      it('the result of voatPostalService should be stored', function () {
        expect(this.$scope.voatPosts).toEqual(data);
      });
    });
  });
});
