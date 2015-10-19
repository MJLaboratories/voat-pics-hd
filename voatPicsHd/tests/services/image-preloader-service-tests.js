describe('ImagePreloader', function () {
  var $scope,
    ImagePreloader,
    $q,
    $http;

  beforeEach(module('ionic'));
  beforeEach(module('app.services'));
  beforeEach(module('app.controllers'));
  beforeEach(module('app.model'));

  // create mocks and inject dependencies
  beforeEach(function () {
    //module('app.services', function ($provide) {
    //  mockUrlLoader = jasmine.createSpyObj('CloudFlareProtectedUrlLoader', ['loadUrl']);
    //  mockVoatPostBuilder = jasmine.createSpyObj('VoatPostBuilder', ['build']);
    //
    //  // provide the mock!
    //  $provide.value('CloudFlareProtectedUrlLoader', mockUrlLoader);
    //  $provide.value('VoatPostBuilder', mockVoatPostBuilder);
    //});

    // now we inject the service we're testing.
    inject(function (_$rootScope_, _$q_, _$http_, _ImagePreloader_) {
      $scope = _$rootScope_.$new();
      $q = _$q_;
      $http = _$http_;
      ImagePreloader = _ImagePreloader_;
    });
  });

  //// set up mocked promises
  //beforeEach(function () {
  //  mockInitialDataReferred = $q.defer();
  //  mockInitialDataPromise = mockInitialDataReferred.promise;
  //
  //  mockInitialDataPromise.success = function (fn) {
  //    mockInitialDataPromise.then(function (data) {
  //      fn(data);
  //    });
  //    return mockInitialDataPromise;
  //  };
  //
  //  mockUrlLoader.loadUrl.and.returnValue(mockInitialDataPromise);
  //});

  describe('at initialisation', function () {
    it('should not have made any calls to load data', function () {
      expect(mockUrlLoader.loadUrl).not.toHaveBeenCalled();
    });
  });

});
