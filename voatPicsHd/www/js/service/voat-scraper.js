var module = angular.module('app.services');

module.factory('VoatScraper', ['$http', '$q', 'VoatPost', '$timeout', function ($http, $q, VoatPost, $timeout) {

  var loadVoatPage = function (url) {
    var deferred = $q.defer();

    $http.get(url)
      .success(function (data) {
        deferred.resolve(data);
      })
      .error(function (data, status, headers) {
        // error could be 503 caused by cloudflare protection so try to solve then retry
        solveCloudFlare(data, headers).then(function (data) {
          $http.get(url)
            .success(function (data) {
              deferred.resolve(data);
            })
            .error(function (data, status, headers, config) {
              deferred.reject('error loading data: ' + config)
            });
        });
      });

    deferred.promise.then(function (data) {
      var i = 1;

      var doc = document.implementation.createHTMLDocument('');
      doc.open();
      doc.write(data);
      doc.close();

      var links = doc.getElementsByClassName('title may-blank');
      var i = 1;
    });

    return deferred.promise;
  };

  var isCloudFlareProtected = function (headers) {
    return headers().server === 'cloudflare-nginx'
      && headers().refresh
      && headers().refresh.indexOf('/cdn-cgi/l/chk_jschl') > -1;
  };

  var solveCloudFlare = function (data, headers) {
    var deferred = $q.defer();

    if (!isCloudFlareProtected(headers)) {
      deferred.resolve();
      return deferred.promise;
    }

    // extract value from hidden form field 'jschl_vc'
    var vc_match = data.match('name="jschl_vc" value="(\\w+)"');
    var vc_value = vc_match[1];

    // extract value from hidden form field 'pass'
    var pass_match = data.match(/name="pass" value="(.+)"/);
    var pass_value = pass_match[1];

    // extract javascript containing logic problem
    var function_match = data.match(/setTimeout\(function\(\){\s+(var t,r,a,f.+?\r?\n[\s\S]+?a\.value =.+?)\r?\n/);
    var function_value = function_match[1];
    function_value = function_value.replace(/a\.value =(.+?) \+ .+?;/, '$1');
    function_value = function_value.replace(/href='\/'/, "href='https://www.voat.co'"); // replace default link href '/' with voat

    // evaluate the extracted javascript logic problem code
    var result = eval(function_value);

    // add length of 'voat.co' to answer
    var answer = result + 7;

    // cloudflare requires we wait 5 seconds before sending the answer
    $timeout(function () {
      $http({
        method: 'GET',
        url: 'https://voat.co/cdn-cgi/l/chk_jschl',
        params: {"jschl_vc": vc_value, "jschl_answer": answer, "pass": pass_value},
      }).success(function (data, status, headers, config) {
        console.log('solved cloudflare check')
        deferred.resolve();
      }).error(function (data, status, headers, config) {
        console.log('failed cloudflare check')
        deferred.reject('failed cloudflare check.')
      });
    }, 4000);

    return deferred.promise;
  };

  return {
    scrapePage: function (url) {
      return loadVoatPage(url);
    }
  };
}]);
