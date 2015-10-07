describe('VoatRepository', function () {
  var $scope,
    VoatRepository,
    mockUrlLoader,
    mockVoatPostBuilder,
    $q,
    mockInitialDataReferred,
    mockInitialDataPromise;

  beforeEach(module('ionic'));
  beforeEach(module('app.services'));
  beforeEach(module('app.controllers'));
  beforeEach(module('app.model'));

  // create mocks and inject dependencies
  beforeEach(function () {
    module('app.services', function ($provide) {
      mockUrlLoader = jasmine.createSpyObj('CloudFlareProtectedUrlLoader', ['loadUrl']);
      mockVoatPostBuilder = jasmine.createSpyObj('VoatPostBuilder', ['build']);

      // provide the mock!
      $provide.value('CloudFlareProtectedUrlLoader', mockUrlLoader);
      $provide.value('VoatPostBuilder', mockVoatPostBuilder);
    });

    // now we inject the service we're testing.
    inject(function (_$rootScope_, _$q_, _VoatRepository_) {
      $scope = _$rootScope_.$new();
      $q = _$q_;
      VoatRepository = _VoatRepository_;
    });
  });

  // set up mocked promises
  beforeEach(function () {
    mockInitialDataReferred = $q.defer();
    mockInitialDataPromise = mockInitialDataReferred.promise;

    mockInitialDataPromise.success = function (fn) {
      mockInitialDataPromise.then(function (data) {
        fn(data);
      });
      return mockInitialDataPromise;
    };

    mockUrlLoader.loadUrl.and.returnValue(mockInitialDataPromise);
  });

  describe('at initialisation', function () {
    it('should not have made any calls to load data', function () {
      expect(mockUrlLoader.loadUrl).not.toHaveBeenCalled();
    });
  });

  describe('getVoatPosts', function () {
    describe('when no data has yet been fetched it', function () {
      var result;

      it('returns an empty array', function () {
        result = VoatRepository.getVoatPosts();
        expect(result).toEqual([]);
      });

      it('does NOT make a call for data', function () {
        expect(mockUrlLoader.loadUrl).not.toHaveBeenCalled();
      });
    });

    describe('when data call is in progress but not yet complete it', function () {
      beforeEach(function () {
        VoatRepository.refreshData();
      });

      it('immediately returns an empty array', function () {
        result = VoatRepository.getVoatPosts();
        expect(result).toEqual([]);
      });
    });

    describe('when initial data has been loaded', function () {
      var stubInitialData = [{title: 'initial'}];

      beforeEach(function () {
        VoatRepository.refreshData();
        mockVoatPostBuilder.build.and.returnValue(stubInitialData);
        mockInitialDataReferred.resolve(stubInitialData);
        $scope.$apply();
      });

      it('returns a copy of the loaded data', function () {
        result = VoatRepository.getVoatPosts();
        expect(result).not.toBe(stubInitialData);
        expect(result).toEqual(stubInitialData);
      });

      describe('when more data has been loaded', function () {
        var stubMoreData = [{title: 'more'}];

        beforeEach(function () {
          VoatRepository.loadMoreData();
          mockVoatPostBuilder.build.and.returnValue(stubMoreData);
          mockInitialDataReferred.resolve(stubMoreData);
          $scope.$apply();
        });

        it('returns a copy of the loaded data', function () {
          result = VoatRepository.getVoatPosts();

          // concat 4 times, to simulate the 4 calls internally to loadMoreData
          var expected = stubInitialData.concat(stubMoreData).concat(stubMoreData).concat(stubMoreData).concat(stubMoreData);

          var ignoreSort = true;
          expect(result).toHaveSameItems(expected, ignoreSort);
        });
      });
    });
  });

  describe('refreshData', function () {
    var initialCallReturnValue;

    beforeEach(function () {
      initialCallReturnValue = VoatRepository.refreshData();
    });

    it('should make a call for data', function () {
      expect(mockUrlLoader.loadUrl).toHaveBeenCalledWith(VoatRepository.VOAT_PICS_URL);
    });

    it('should return a promise', function () {
      expect(trueUtility.isPromise(initialCallReturnValue)).toBeTruthy();
    });

    describe('if called whilst waiting for a previous call to complete it', function () {
      var subsequentCallReturnValue;

      beforeEach(function () {
        mockUrlLoader.loadUrl.calls.reset();
        subsequentCallReturnValue = VoatRepository.refreshData();
      });

      it('returns the exact promise returned on the first call', function () {
        expect(subsequentCallReturnValue).toBe(initialCallReturnValue);
      });

      it('should NOT call for data', function () {
        expect(mockUrlLoader.loadUrl).not.toHaveBeenCalled();
      });
    });

    describe('when the data call completes', function () {
      var stubData = [{foo: 'bar'}];
      var stubVoatPosts = [{title: 'title'}];
      var resolvedPromiseValue = 'all-ready-for-the-controller';

      beforeEach(function () {
        mockVoatPostBuilder.build.and.returnValue(stubVoatPosts);

        initialCallReturnValue.then(function (value) {
          resolvedPromiseValue = value;
        });

        mockInitialDataReferred.resolve(stubData);
        $scope.$apply();
      });

      it('the data is sent to the VoatPostBuilder', function () {
        expect(mockVoatPostBuilder.build).toHaveBeenCalledWith(stubData);
      });

      it('resolves the promise with a COPY of the result of the VoatPostBuilder', function () {
        expect(resolvedPromiseValue).toEqual(stubVoatPosts);
        expect(resolvedPromiseValue).not.toBe(stubVoatPosts);
      });

      describe('subsequent calls', function () {
        beforeEach(function () {
          mockUrlLoader.loadUrl.calls.reset();
          VoatRepository.refreshData();
          mockInitialDataReferred.resolve(stubData);
          $scope.$apply();
        });

        it('always fetch the first page', function () {
          expect(mockUrlLoader.loadUrl).toHaveBeenCalledWith(VoatRepository.VOAT_PICS_URL);
        });
      });
    });
  });

  describe('loadMoreData', function () {
    var initialCallReturnValue;
    var mockPicsDeferred;
    var mockPicsPromise;
    var mockGifsDeferred;
    var mockGifsPromise;
    var mockAwwDeferred;
    var mockAwwPromise;
    var mockFunnyDeferred;
    var mockFunnyPromise;

    var stubPicsData = [{title: 'pics'}];
    var stubAwwData = [{title: 'aww'}];
    var stubGifsData = [{title: 'gifs'}];
    var stubFunnyData = [{title: 'funny'}];

    // mock out voat post builder
    beforeEach(function () {
      mockVoatPostBuilder.build.and.callFake(function (data) {
        return data;
      });
    });

    // mock out data call promises
    beforeEach(function () {
      // TODO: refactor repeated setup code... but how?!

      mockGifsDeferred = $q.defer();
      mockPicsDeferred = $q.defer();
      mockAwwDeferred = $q.defer();
      mockFunnyDeferred = $q.defer();

      mockPicsPromise = mockPicsDeferred.promise;
      mockGifsPromise = mockGifsDeferred.promise;
      mockAwwPromise = mockAwwDeferred.promise;
      mockFunnyPromise = mockFunnyDeferred.promise;

      mockPicsPromise.success = function (fn) {
        mockPicsPromise.then(function (data) {
          fn(data);
        });
        return mockPicsPromise;
      };

      mockGifsPromise.success = function (fn) {
        mockGifsPromise.then(function (data) {
          fn(data);
        });
        return mockGifsPromise;
      };

      mockAwwPromise.success = function (fn) {
        mockAwwPromise.then(function (data) {
          fn(data);
        });
        return mockAwwPromise;
      };

      mockFunnyPromise.success = function (fn) {
        mockFunnyPromise.then(function (data) {
          fn(data);
        });
        return mockFunnyPromise;
      };

      mockUrlLoader.loadUrl.and.callFake(function (url) {
        switch (url) {
          case VoatRepository.VOAT_PICS_URL:
            return mockPicsPromise;
          case VoatRepository.VOAT_AWW_URL:
            return mockAwwPromise;
          case VoatRepository.VOAT_GIFS_URL:
            return mockGifsPromise;
          case VoatRepository.VOAT_FUNNY_URL:
            return mockFunnyPromise;
        }
      });
    });

    beforeEach(function () {
      initialCallReturnValue = VoatRepository.loadMoreData();
    });

    it('should make a call to the gifs subverse', function () {
      expect(mockUrlLoader.loadUrl).toHaveBeenCalledWith(VoatRepository.VOAT_GIFS_URL)
    });

    it('should make a call to the aww subverse', function () {
      expect(mockUrlLoader.loadUrl).toHaveBeenCalledWith(VoatRepository.VOAT_AWW_URL);
    });

    it('should make a call to the pics subverse', function () {
      expect(mockUrlLoader.loadUrl).toHaveBeenCalledWith(VoatRepository.VOAT_PICS_URL);
    });

    it('should make a call to the funny subverse', function () {
      expect(mockUrlLoader.loadUrl).toHaveBeenCalledWith(VoatRepository.VOAT_FUNNY_URL);
    });

    it('should return a promise', function () {
      expect(trueUtility.isPromise(initialCallReturnValue)).toBeTruthy();
    });

    describe('if called whilst waiting for a previous call to complete it', function () {
      var subsequentCallReturnValue;

      beforeEach(function () {
        mockUrlLoader.loadUrl.calls.reset();
        subsequentCallReturnValue = VoatRepository.loadMoreData();
      });

      it('returns the exact promise returned on the first call', function () {
        expect(subsequentCallReturnValue).toBe(initialCallReturnValue);
      });

      it('does NOT make additional call for data', function () {
        expect(mockUrlLoader.loadUrl).not.toHaveBeenCalled();
      });
    });

    describe('when only some of the data calls have completed it', function () {
      beforeEach(function () {
        mockPicsDeferred.resolve(stubPicsData);
        $scope.$apply();
      });

      it('waits for all data calls to complete', function () {
        expect(mockVoatPostBuilder.build).not.toHaveBeenCalled();
      });
    });

    describe('when all data calls have completed', function () {
      var resolvedPromiseValue = 'all-ready-for-the-controller';
      var concatenatedStubData = stubPicsData.concat(stubGifsData).concat(stubAwwData).concat(stubFunnyData);

      beforeEach(function () {
        initialCallReturnValue.then(function (value) {
          resolvedPromiseValue = value;
        });

        mockPicsDeferred.resolve(stubPicsData);
        mockGifsDeferred.resolve(stubGifsData);
        mockAwwDeferred.resolve(stubAwwData);
        mockFunnyDeferred.resolve(stubFunnyData);
        $scope.$apply();
      });

      it('each datum gets sent to the VoatPostBuilder', function () {
        expect(mockVoatPostBuilder.build).toHaveBeenCalledWith(stubPicsData);
        expect(mockVoatPostBuilder.build).toHaveBeenCalledWith(stubGifsData);
        expect(mockVoatPostBuilder.build).toHaveBeenCalledWith(stubAwwData);
        expect(mockVoatPostBuilder.build).toHaveBeenCalledWith(stubFunnyData);
      });

      it('the data are concatenated', function () {
        var ignoreSort = true;
        expect(resolvedPromiseValue).toHaveSameItems(concatenatedStubData, ignoreSort);
      });

      it('and shuffled', function () {
        var ignoreSort = false;
        expect(resolvedPromiseValue).not.toHaveSameItems(concatenatedStubData, ignoreSort);
      });
    });

    describe('on subsequent calls', function () {
      // resolve the first call so subsequent calls are not aggregated into original promise
      beforeEach(function () {
        mockPicsDeferred.resolve(stubPicsData);
        mockGifsDeferred.resolve(stubGifsData);
        mockAwwDeferred.resolve(stubAwwData);
        mockFunnyDeferred.resolve(stubFunnyData);
        $scope.$apply();
      });

      beforeEach(function () {
        VoatRepository.loadMoreData();
      });

      // NOTE: voat treats direct subverse calls as 'the first page', and "page=1" as 'page 2'
      it('should make a call to next page of the gifs subverse', function () {
        var voatGifsPage1Url = VoatRepository.VOAT_GIFS_URL + '?page=1';
        expect(mockUrlLoader.loadUrl).toHaveBeenCalledWith(voatGifsPage1Url)
      });

      it('should make a call to next page of the aww subverse', function () {
        var voatAwwPage1Url = VoatRepository.VOAT_AWW_URL + '?page=1';
        expect(mockUrlLoader.loadUrl).toHaveBeenCalledWith(voatAwwPage1Url);
      });

      it('should make a call to next page of the pics subverse', function () {
        var voatPicsPage1Url = VoatRepository.VOAT_PICS_URL + '?page=1';
        expect(mockUrlLoader.loadUrl).toHaveBeenCalledWith(voatPicsPage1Url);
      });

      it('should make a call to next page of the funny subverse', function () {
        var voatFunnyPage1Url = VoatRepository.VOAT_FUNNY_URL + '?page=1';
        expect(mockUrlLoader.loadUrl).toHaveBeenCalledWith(voatFunnyPage1Url);
      });
    });
  });
});
