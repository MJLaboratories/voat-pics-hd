var module = angular.module('app.services');
module.factory('CloudFlareSolver', function ($q, $http, $timeout) {
  var CLOUD_FLARE_SOLVING_URL_SUFFIX = 'cdn-cgi/l/chk_jschl';

  var isHttpErrorCausedByCloudFlareProtection = function (headers) {
    return headers().server === 'cloudflare-nginx'
      && headers().refresh
      && headers().refresh.indexOf('/cdn-cgi/l/chk_jschl') > -1;
  };

  var solveCloudFlareProtection = function (url, data, headers) {
    var deferred = $q.defer();

    if (!isHttpErrorCausedByCloudFlareProtection(headers)) {
      console.log(
        'Was asked to solve a non cloudflare protected response. There is a utlity function to detect cloud flare protection.'
      );
      deferred.resolve();
      return deferred.promise;
    }

    if (url[url.length - 1] !== ("/")) {
      url = url + "/";
    }

    // extract value from hidden form field 'jschl_vc'
    var vc_match = data.match('name="jschl_vc" value="(\\w+)"');
    var vc_value = vc_match[1];

    // extract value from hidden form field 'pass'
    var pass_match = data.match(/name="pass" value="(.+)"/);
    var pass_value = pass_match[1];

    // extract javascript containing logic problem
    var function_match = data.match(
      /setTimeout\(function\(\){\s+(var t,r,a,f.+?\r?\n[\s\S]+?a\.value =.+?)\r?\n/
    );
    var function_value = function_match[1];
    function_value = function_value.replace(/a\.value =(.+?) \+ .+?;/, '$1');

    //function_value = function_value.replace(/href='\/'/, "href=' " + url + "'"); // replace default link href '/' with voat
    function_value = function_value.replace(/href='\/'/, "href='https://www.voat.co'"); // replace default link href '/' with voat

    // evaluate the extracted javascript logic problem code
    var result = eval(function_value);

    // add length of 'voat.co' to answer
    var answer = result + 7;

    // cloudflare says wait 5 seconds before sending the answer, but 4 seems to work
    $timeout(function () {
      $http({
        method: 'GET',
        url: 'https://voat.co/cdn-cgi/l/chk_jschl',
        params: {
          "jschl_vc": vc_value,
          "jschl_answer": answer,
          "pass": pass_value
        },
      }).success(function (data, status, headers, config) {
        console.log('solved cloudflare check');
        deferred.resolve();
      }).error(function (data, status, headers, config) {
        var errorString = 'failed cloudflare check. error:' + status;
        console.log(errorString);
        deferred.reject(errorString);
      });
    }, 4000);

    return deferred.promise;
  };


  return {
    isHttpErrorCausedByCloudFlareProtection: isHttpErrorCausedByCloudFlareProtection,
    solveCloudFlareProtection: solveCloudFlareProtection
  };
});
