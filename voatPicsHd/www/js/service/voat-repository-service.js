var module = angular.module('app.services');
module.factory('VoatRepository', function ($q, VoatPost, $cacheFactory, CloudFlareProtectedUrlLoader, VoatPostBuilder) {
  var VOAT_PICS_URL = 'https://voat.co/v/pics/';
  var VOAT_GIFS_URL = 'https://voat.co/v/gifs/';
  var VOAT_AWW_URL = 'https://voat.co/v/aww/';
  var VOAT_FUNNY_URL = 'https://voat.co/v/funny/';

  var voatPosts = [];
  var refreshDeferred = null;
  var loadMoreDeferred = null;

  var voatPageIndexes = [];
  var resetVoatPageIndexes = function () {
    voatPageIndexes[VOAT_PICS_URL] = 0;
    voatPageIndexes[VOAT_GIFS_URL] = 0;
    voatPageIndexes[VOAT_AWW_URL] = 0;
    voatPageIndexes[VOAT_FUNNY_URL] = 0;
  };
  resetVoatPageIndexes();

  var getNextVoatSubverseUrl = function (voatUrl) {
    var pageIndex = voatPageIndexes[voatUrl];
    var url = voatUrl;

    if (pageIndex > 0) {
      url = url +'?page=' +pageIndex;
    }

    voatPageIndexes[voatUrl]++;

    return url;
  };

  var loadNextPicsPage = function () {
    var voatPicsPageUrl = getNextVoatSubverseUrl(VOAT_PICS_URL);
    return CloudFlareProtectedUrlLoader.loadUrl(voatPicsPageUrl)
  };

  var loadNextGifsPage = function () {
    var voatGifsPageUrl = getNextVoatSubverseUrl(VOAT_GIFS_URL);
    return CloudFlareProtectedUrlLoader.loadUrl(voatGifsPageUrl)
  };

  var loadNextAwwPage = function () {
    var voatAwwPageUrl = getNextVoatSubverseUrl(VOAT_AWW_URL);
    return CloudFlareProtectedUrlLoader.loadUrl(voatAwwPageUrl)
  };

  var loadNextFunnyPage = function () {
    var voatFunnyPageUrl = getNextVoatSubverseUrl(VOAT_FUNNY_URL);
    return CloudFlareProtectedUrlLoader.loadUrl(voatFunnyPageUrl)
  };

  var refreshData = function () {
    // duplicate requests are resolved via a single promise
    if (!trueUtility.isUndefinedOrNull(refreshDeferred)) {
      return refreshDeferred.promise;
    }

    refreshDeferred = $q.defer();
    resetVoatPageIndexes();

    loadNextPicsPage().then(function (data) {
      voatPosts = VoatPostBuilder.build(data);
      refreshDeferred.resolve(getVoatPosts());
      refreshDeferred = null;
    });

    return refreshDeferred.promise;
  };

  // should only expose voatPosts via this method
  var getVoatPosts = function () {
    return angular.copy(voatPosts); // deep copy
  };

  var loadMoreData = function () {
    // duplicate requests are resolved via a single promise
    if (!trueUtility.isUndefinedOrNull(loadMoreDeferred)) {
      return loadMoreDeferred.promise;
    }

    loadMoreDeferred = $q.defer();

    $q.all([
      loadNextPicsPage(),
      loadNextGifsPage(),
      loadNextAwwPage(),
      loadNextFunnyPage()])
      .then(function (res) {
        var newPicsPosts = VoatPostBuilder.build(res[0]);
        var newGifsPosts = VoatPostBuilder.build(res[1]);
        var newAwwPosts = VoatPostBuilder.build(res[2]);
        var newFunnyPosts = VoatPostBuilder.build(res[3]);

        var newPostsCombined = newPicsPosts.concat(newGifsPosts).concat(newAwwPosts).concat(newFunnyPosts);
        var newPostsCombinedAndShuffled = trueUtility.shuffle(newPostsCombined);

        voatPosts = voatPosts.concat(newPostsCombinedAndShuffled);

        loadMoreDeferred.resolve(newPostsCombinedAndShuffled);
        loadMoreDeferred = null;
      });//the error case is handled automatically
    // don't know what the above comment means

    return loadMoreDeferred.promise;
  };

  return {
    getVoatPosts: getVoatPosts,
    refreshData: refreshData,
    loadMoreData: loadMoreData,

    VOAT_PICS_URL: VOAT_PICS_URL,
    VOAT_GIFS_URL: VOAT_GIFS_URL,
    VOAT_AWW_URL: VOAT_AWW_URL,
    VOAT_FUNNY_URL: VOAT_FUNNY_URL
  };
});
