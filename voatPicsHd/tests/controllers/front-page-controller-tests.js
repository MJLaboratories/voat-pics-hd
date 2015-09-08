describe('FrontPageCtrl', function () {
  var controller, $scope, $timeout, mockVoatPostalService, mockDeferred, mockPromise;

  beforeEach(module('app.services'));
  beforeEach(module('ionic'));
  beforeEach(module('app.controllers'));


  beforeEach(inject(function ($rootScope, $controller, $q, $timeout, $ionicLoading) {
    this.$scope = $rootScope.$new();
    this.$timeout = $timeout;

    ////create a promise for the spy to return to mock the async calls to the service
    mockDeferred = $q.defer();
    mockPromise = mockDeferred.promise;

    //create spy for the service being called so it is mocked out
    mockVoatPostalService = jasmine.createSpyObj('VoatPostalService', ['all']);
    //setup the spy to always return the spyPromise for the entire test spec
    mockVoatPostalService.all.and.returnValue(mockPromise);

    mockPromise.success = function (fn) {
      //success of the promise consumes the success callback
      mockPromise.then( function (data) {
        //call the promise.success method in controller
        fn(data);
      });
      return mockPromise;
    };

    controller = $controller('FrontPageCtrl', {$scope: this.$scope, VoatPostalService: mockVoatPostalService,  $timeout: this.$timeout, $ionicLoading: $ionicLoading});

    ////Setup 2 functions for the spy to call if the async call was successfull or failed
    //spyPromise.success = function (fn) {
    //  //success of the promise consumes the success callback
    //  spyPromise.then( function (data) {
    //    //call the promise.success method in controller
    //    fn(data);
    //  });
    //  return spyPromise;
    //};

  }));

  describe('when the app first loads', function () {
    beforeEach(function() {
      this.$scope.doRefresh();
    });

    it('should have initialised with an empty data array', function () {
      expect(this.$scope.voatPosts).toEqual([]);
    });

    it('should call voatPostalService.all', function () {
      this.$scope.$apply();
      expect(mockVoatPostalService.all).toHaveBeenCalled();
    });

    //describe('when the service call for data completes', function () {
    //  var data = [{id: 'id', title: 'title', link: 'link', image: 'image'}];
    //
    //  beforeEach(function () {
    //    mockDeferred.resolve(data);
    //  });
    //
    //  it('the result of voatPostalService should be stored', function () {
    //    this.$scope.$apply();
    //    expect(this.$scope.voatPosts).toEqual(data);
    //  });
    //});
  });
});
