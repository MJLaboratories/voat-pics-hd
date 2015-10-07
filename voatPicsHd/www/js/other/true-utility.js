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

  function isPromise (val) {
    return !isUndefinedOrNull(val) && (typeof val.then === "function");
  }

  function shuffle(array) {
    var counter = array.length, temp, index;

    // While there are elements in the array
    while (counter > 0) {
      // Pick a random index
      index = Math.floor(Math.random() * counter);

      // Decrease counter by 1
      counter--;

      // And swap the last element with it
      temp = array[counter];
      array[counter] = array[index];
      array[index] = temp;
    }

    return array;
  }

  function findWithAttr(array, attr, value) {
    for (var i = 0; i < array.length; i += 1) {
      if (array[i][attr] == value) {
        return i;
      }
    }
  }

  // END API

  // publish external API by extending myLibrary
  function publishExternalAPI(trueUtility) {
    angular.extend(trueUtility, {
      'isUndefinedOrNull': isUndefinedOrNull,
      'isNumberOrNumericString': isNumberOrNumericString,
      'isPromise': isPromise,
      'shuffle': shuffle,
      'findWithAttr': findWithAttr
    });
  }


  publishExternalAPI(trueUtility);

})(window, document);
