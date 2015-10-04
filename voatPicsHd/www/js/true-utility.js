(function (window, document) {
  'use strict';

  // attach myLibrary as a property of window
  var trueUtility = window.trueUtility || (window.trueUtility = {});

  // BEGIN API
  function helloWorld() {
    alert('hello world!');
  }


  function isUndefinedOrNull (val) {
    return angular.isUndefined(val) || val === null;
  }

  function isNumberOrNumericString (val) {
    return ! (isNaN(val-0) || val === null || val === '' || Array.isArray(val));
  }

  // END API

  // publish external API by extending myLibrary
  function publishExternalAPI(trueUtility) {
    angular.extend(trueUtility, {
      'isUndefinedOrNull': isUndefinedOrNull,
      'isNumberOrNumericString': isNumberOrNumericString
    });
  }


  publishExternalAPI(trueUtility);

})(window, document);
