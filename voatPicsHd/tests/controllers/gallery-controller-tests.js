describe('GalleryCtrl', function () {
  var LEFT_SLIDE_INDEX = 0,
    CENTRE_SLIDE_INDEX = 1,
    RIGHT_SLIDE_INDEX = 2;


  var $controller,
    $scope,
    $stateParams,
    $ionicSlideBoxDelegate,
    $ionicScrollDelegate,
    $ionicNavBarDelegate,
    $q,
    $compile,
    mockVoatRepository,
    mockLoadMoreDataDeferred,
    mockLoadMoreDataPromise,
    stubData = [{
      "id": "567918",
      "title": "Garbage men taking a break",
      "link": "http://i.imgur.com/WleFJTe.jpg",
      "upVoats": "15",
      "downVoats": "0",
      "submittedBy": "prvmzaya",
      "thumbnail": "https://cdn.voat.co/thumbs/87b13b7f-9e1e-4389-aa16-c2dfeff94db0.jpg",
      "commentCountDescription": "3 comments",
      "commentCount": "3"
    }, {
      "id": "566463",
      "title": "Those were the days",
      "link": "https://i.imgur.com/NsOvHOc.jpg",
      "upVoats": "101",
      "downVoats": "5",
      "submittedBy": "Lysergia",
      "thumbnail": "https://cdn.voat.co/thumbs/07b127d5-2ad3-42ea-b2ef-60f02c698c83.jpg",
      "commentCountDescription": "27 comments",
      "commentCount": "27"
    }, {
      "id": "565413",
      "title": "How political Bribery happens Today",
      "link": "https://i.imgur.com/JPqURTh.jpg",
      "upVoats": "59",
      "downVoats": "5",
      "submittedBy": "OhBlindOne",
      "thumbnail": "https://cdn.voat.co/thumbs/6032d814-8479-43e8-88da-55af3ec99f32.jpg",
      "commentCountDescription": "19 comments",
      "commentCount": "19"
    }, {
      "id": "565007",
      "title": "Laser cut wooden cube suspended from the ceiling",
      "link": "http://i.imgur.com/K1h24FI.jpg",
      "upVoats": "70",
      "downVoats": "1",
      "submittedBy": "vihian",
      "thumbnail": "https://cdn.voat.co/thumbs/d975f6c2-cee6-4f2f-a76a-348cedd360e9.jpg",
      "commentCountDescription": "9 comments",
      "commentCount": "9"
    }, {
      "id": "565333",
      "title": "A man and his dog",
      "link": "http://i.imgur.com/AnwPgsY.jpg",
      "upVoats": "31",
      "downVoats": "3",
      "submittedBy": "dom2dom2",
      "thumbnail": "https://cdn.voat.co/thumbs/457541b1-55d4-4ff5-ba6d-6f236711eb38.jpg",
      "commentCountDescription": "2 comments",
      "commentCount": "2"
    }, {
      "id": "564962",
      "title": "Light under ice looks like rainbow stream",
      "link": "http://i.imgur.com/mShJ5ck.jpg",
      "upVoats": "26",
      "downVoats": "2",
      "submittedBy": "dom2dom2",
      "thumbnail": "https://cdn.voat.co/thumbs/dab4fa5d-6e39-4685-a08f-9cddb1d0202f.jpg",
      "commentCountDescription": "1 comments",
      "commentCount": "1"
    }, {
      "id": "564198",
      "title": "Mozart's handwriting (musical notation sheet)",
      "link": "https://upload.wikimedia.org/wikipedia/commons/3/34/Phantasie_f%C3%BCr_eine_Orgelwalze,_Allegro_and_Andante_in_F_Minor,_K._608_4.jpg",
      "upVoats": "44",
      "downVoats": "0",
      "submittedBy": "NeedleStack",
      "thumbnail": "https://cdn.voat.co/thumbs/fac8942d-1694-4323-973b-52917bc18e5f.jpg",
      "commentCountDescription": "8 comments",
      "commentCount": "8"
    }, {
      "id": "559658",
      "title": "Thomas Jefferson on laws and constitutions",
      "link": "http://i.imgur.com/XCfqbiq.jpg",
      "upVoats": "193",
      "downVoats": "4",
      "submittedBy": "skymod",
      "thumbnail": "https://cdn.voat.co/thumbs/bfab4857-1601-4575-b93f-80d1d538c333.jpg",
      "commentCountDescription": "83 comments",
      "commentCount": "83"
    }, {
      "id": "562765",
      "title": "These fallen leaves look like Oz",
      "link": "http://i.imgur.com/Xyt0zJO.jpg",
      "upVoats": "57",
      "downVoats": "2",
      "submittedBy": "dom2dom2",
      "thumbnail": "https://cdn.voat.co/thumbs/0c0a107b-db27-4350-a9e2-0adaaa344143.jpg",
      "commentCountDescription": "7 comments",
      "commentCount": "7"
    }, {
      "id": "559276",
      "title": "Meet Chris Mintz - He stopped the Umpqua shooter.  He was shot 7 times.  This man is a hero.",
      "link": "http://i.imgur.com/dxew40u.jpg",
      "upVoats": "182",
      "downVoats": "16",
      "submittedBy": "qzxq",
      "thumbnail": "https://cdn.voat.co/thumbs/009fcb33-368f-4d14-bd44-971a19d45ac9.jpg",
      "commentCountDescription": "37 comments",
      "commentCount": "37"
    }, {
      "id": "562744",
      "title": "Nice woodpile",
      "link": "http://i.imgur.com/kFzbTg5.jpg",
      "upVoats": "38",
      "downVoats": "1",
      "submittedBy": "vihian",
      "thumbnail": "https://cdn.voat.co/thumbs/3390ee53-14ec-4da5-8867-e5528c3eb2cc.jpg",
      "commentCountDescription": "3 comments",
      "commentCount": "3"
    }, {
      "id": "562763",
      "title": "XTC pills are getting very impressive designs these days.",
      "link": "http://i.imgur.com/XmhioHA.jpg",
      "upVoats": "37",
      "downVoats": "2",
      "submittedBy": "dom2dom2",
      "thumbnail": "https://cdn.voat.co/thumbs/35c8b1ee-1f00-407e-9366-4cd2ac789306.jpg",
      "commentCountDescription": "20 comments",
      "commentCount": "20"
    }, {
      "id": "565330",
      "title": "How Nike shoes are made",
      "link": "http://i.imgur.com/K6c8Ehg.jpg",
      "upVoats": "7",
      "downVoats": "0",
      "submittedBy": "dom2dom2",
      "thumbnail": "https://cdn.voat.co/thumbs/af398e65-e4c2-4740-9bb9-3aa88b106bb3.jpg",
      "commentCountDescription": "1 comments",
      "commentCount": "1"
    }];

  beforeEach(module('ionic'));
  beforeEach(module('app.services'));
  beforeEach(module('app.controllers'));
  beforeEach(module('app.model'));

  beforeEach(inject(function (_$controller_,
                              _$rootScope_,
                              _$stateParams_,
                              _$ionicSlideBoxDelegate_,
                              _$ionicScrollDelegate_,
                              _$ionicNavBarDelegate_,
                              _$q_,
                              _$compile_) {
    $controller = _$controller_;
    $scope = _$rootScope_.$new();
    $stateParams = _$stateParams_;
    $ionicSlideBoxDelegate = _$ionicSlideBoxDelegate_;
    $ionicScrollDelegate = _$ionicScrollDelegate_;
    $ionicNavBarDelegate = _$ionicNavBarDelegate_;
    $q = _$q_;
    $compile = _$compile_;
  }));

  beforeEach(function () {
    //create a promise for the spy to return to mock the async calls to the service
    mockLoadMoreDataDeferred = $q.defer();
    mockLoadMoreDataPromise = mockLoadMoreDataDeferred.promise;

    mockLoadMoreDataPromise.success = function (fn) {
      mockLoadMoreDataPromise.then(function (data) {
        fn(data);
      });
      return mockLoadMoreDataPromise;
    };

    //setup the mockVoatRepository to return spyPromise for the entire test spec
    mockVoatRepository = jasmine.createSpyObj('VoatRepository', ['loadMoreData', 'getVoatPosts']);
    mockVoatRepository.loadMoreData.and.returnValue(mockLoadMoreDataPromise);
    mockVoatRepository.getVoatPosts.and.returnValue(stubData);
  });

  var createController = function () {
    controller = $controller('GalleryCtrl', {
      $scope: $scope,
      $stateParams: $stateParams,
      $ionicSlideBoxDelegate: $ionicSlideBoxDelegate,
      $ionicScrollDelegate: $ionicScrollDelegate,
      $ionicNavBarDelegate: $ionicNavBarDelegate,
      VoatRepository: mockVoatRepository
    });
  };

  function expectInitialSlidesToStartFrom(startIndex) {
    expect($scope.slides[LEFT_SLIDE_INDEX]).toEqual(stubData[startIndex]);
    expect($scope.slides[CENTRE_SLIDE_INDEX]).toEqual(stubData[startIndex + 1]);
    expect($scope.slides[RIGHT_SLIDE_INDEX]).toEqual(stubData[startIndex + 2]);
  }

  describe('when transitioning from the first image on the list view', function () {
    beforeEach(function () {
      $stateParams.id = stubData[0].id;
      createController();
    });

    it('the initial three slides are the first 3 voatPosts', function () {
      expectInitialSlidesToStartFrom(0);
    });

    it('the selectedSlide is the first slide', function () {
      expect($scope.selectedSlide).toEqual(LEFT_SLIDE_INDEX);
    });
  });

  describe('when transitioning from the last image on the list view', function () {
    beforeEach(function () {
      $stateParams.id = stubData[stubData.length - 1].id;
      createController();
    });

    it('the initial three slides are the last 3 voatPosts', function () {
      expectInitialSlidesToStartFrom(stubData.length - 3);
    });

    it('the selectedSlide is the last slide', function () {
      expect($scope.selectedSlide).toEqual(RIGHT_SLIDE_INDEX);
    });
  });

  describe('when transitioning from an image somewhere in the middle on the list view', function () {
    var somewhereInTheMiddle = Math.floor(stubData.length / 2);

    beforeEach(function () {
      $stateParams.id = stubData[somewhereInTheMiddle].id;
      createController();
    });

    it('the initial three slides are the last 3 voatPosts', function () {
      expectInitialSlidesToStartFrom(somewhereInTheMiddle - 1);
    });

    it('the selectedSlide is the centre slide', function () {
      expect($scope.selectedSlide).toEqual(CENTRE_SLIDE_INDEX);
    });
  });

  describe('when transitioning from an unknown image on the list view', function () {
    beforeEach(function () {
      $stateParams.id = "unknown";
      createController();
    });

    it('the initial three slides are the first 3 voatPosts', function () {
      expectInitialSlidesToStartFrom(0);
    });

    it('the selectedSlide is the first slide', function () {
      expect($scope.selectedSlide).toEqual(LEFT_SLIDE_INDEX);
    });
  });

  describe('after initialisation', function () {

    beforeEach(function () {
      var slideBoxElement = $compile('<ion-slide-box on-double-tap="toggleZoomFocusMode()" on-slide-changed="slideHasChanged(index)" active-slide="selectedSlide" show-pager="false" does-continue="true" class="full-size"><ion-slide ng-repeat="slide in slides"></ion-slide></ion-slide-box>')($scope);
      $stateParams.id = stubData[0].id ;
      createController();
    });

    it('image title is shown by default', function () {
      expect($scope.showImageTitle).toBeTruthy();
    });

    it('nav bar is shown by default', function () {
      expect($scope.showNavigation).toBeTruthy();
    });

    it('calls VoatRepository for voatPosts', function () {
      expect(mockVoatRepository.getVoatPosts).toHaveBeenCalled();
    });

    describe('when swiping through slides', function () {
      var REMAINING_SLIDES_TRIGGER_COUNT = 10;
      var SLIDES_DATA_LOAD_TRIGGER_INDEX = stubData.length - REMAINING_SLIDES_TRIGGER_COUNT;
      var ONE_BELOW_SLIDES_DATA_LOAD_TRIGGER_INDEX = SLIDES_DATA_LOAD_TRIGGER_INDEX - 1;

      var getNextIndex = function (index) {
        return (index + 1) % 3;
      };

      // do all required things which a real slide-box would do for us
      // not sure how to simulate user interactions...
      // TODO: improve slide box simulation
      var simulateSlideToIndex = function (index) {
        $scope.selectedSlide = index;
        $scope.slideHasChanged(index);
      };

      var slideTheSlides = function (times) {
        var nextIndex = getNextIndex($scope.selectedSlide);

        for (var newSlideIndex = 0; newSlideIndex < times; newSlideIndex++) {
          simulateSlideToIndex(nextIndex);
          nextIndex = getNextIndex(nextIndex);
        }
      };

      // TODO: tests for swiping slides

      describe('and there are more than 10 slides left before the end', function () {
        beforeEach(function () {
          slideTheSlides(ONE_BELOW_SLIDES_DATA_LOAD_TRIGGER_INDEX);
        });

        it('does not make a call for more data', function () {
          expect(mockVoatRepository.loadMoreData).not.toHaveBeenCalled();
        })
      });

      describe('and there are exactly 10 slides left before the end', function () {
        beforeEach(function () {
          slideTheSlides(SLIDES_DATA_LOAD_TRIGGER_INDEX);
        });

        it('triggers a call for more data', function () {
          expect(mockVoatRepository.loadMoreData).toHaveBeenCalled();
        });

        describe('and subsequent slides', function () {
          beforeEach(function () {
            mockVoatRepository.loadMoreData.calls.reset();
            slideTheSlides(1);
          });

          it('do not trigger a duplicate data call', function () {
            expect(mockVoatRepository.loadMoreData).not.toHaveBeenCalled();
          })
        });

        describe('when the data call is complete', function () {
          var newVoatPosts;

          beforeEach(function () {
            newVoatPosts = angular.copy(stubData);
            newVoatPosts = _.each(newVoatPosts, function(newVoatPost) {
              newVoatPost.id += "_NEW";
            });

            mockLoadMoreDataDeferred.resolve(newVoatPosts);
            $scope.$apply();
          });

          it('new slides are added to the end of the current ones', function () {
            var UNTIL_THE_FIRST_NEW_SLIDE = stubData.length - SLIDES_DATA_LOAD_TRIGGER_INDEX;
            slideTheSlides(UNTIL_THE_FIRST_NEW_SLIDE);
            expect($scope.slides[$scope.selectedSlide].id).toEqual(newVoatPosts[0].id);

            for(var i = 1; i < newVoatPosts.length; i++) {
              slideTheSlides(1);
              expect($scope.slides[$scope.selectedSlide].id).toEqual(newVoatPosts[i].id);
            }
          });

          describe('and subsequent sliding to within 10 slides of the end', function () {
            beforeEach(function () {
              slideTheSlides(newVoatPosts.length - 1);
            });

            it('triggers another call for more data', function () {
              expect(mockVoatRepository.loadMoreData).toHaveBeenCalled();
            })
          });
        });
      });
    });
  });
});
