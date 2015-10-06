describe('trueUtility', function () {
  beforeEach(module('ionic'));
  beforeEach(module('app.services'));
  beforeEach(module('app.controllers'));
  beforeEach(module('app.model'));


  describe('isUndefinedOrNull should', function () {
    beforeEach(function () {

    });

    describe('return true if argument is', function () {
      it('undefined', function () {
        var undefinedVar;
        expect(trueUtility.isUndefinedOrNull(undefinedVar)).toEqual(true);
      });

      it('null', function () {
        var nullVar = null;
        expect(trueUtility.isUndefinedOrNull(nullVar)).toEqual(true);
      });
    });

    describe('return false if argument is', function () {
      it('the string \'undefined\'', function () {
        var undefinedStringLiteral = 'undefined';
        expect(trueUtility.isUndefinedOrNull(undefinedStringLiteral)).toEqual(false);
      });

      it('an empty array', function () {
        var emptyArray = [];
        expect(trueUtility.isUndefinedOrNull(emptyArray)).toEqual(false);
      });

      it('a function', function () {
        var functionVar = function () {
        };
        expect(trueUtility.isUndefinedOrNull(functionVar)).toEqual(false);
      });

      it('an empty object', function () {
        var emptyObject = {};
        expect(trueUtility.isUndefinedOrNull(emptyObject)).toEqual(false);
      });

      it('a string', function () {
        var stringVar = "hello";
        expect(trueUtility.isUndefinedOrNull(stringVar)).toEqual(false);
      });

      it('an empty string', function () {
        var emptyString = "";
        expect(trueUtility.isUndefinedOrNull(emptyString)).toEqual(false);
      });

      it('0', function () {
        var zeroVar = 0;
        expect(trueUtility.isUndefinedOrNull(zeroVar)).toEqual(false);
      });

      it('NaN', function () {
        var nanVar = 1 / 0;
        expect(trueUtility.isUndefinedOrNull(nanVar)).toEqual(false);
      });
    });
  });

  describe('isNumberOrNumericString should', function () {
    beforeEach(function () {

    });

    describe('return true if argument is', function () {
      it('a number', function () {
        var numberVar = 10;
        expect(trueUtility.isNumberOrNumericString(numberVar)).toEqual(true);
      });

      it('0', function () {
        var zeroVar = 0;
        expect(trueUtility.isNumberOrNumericString(zeroVar)).toEqual(true);
      });

      it('-1', function () {
        var minusOneVar = -1;
        expect(trueUtility.isNumberOrNumericString(minusOneVar)).toEqual(true);
      });

      it('\'0\'', function () {
        var zeroStringLiteral = '0';
        expect(trueUtility.isNumberOrNumericString(zeroStringLiteral)).toEqual(true);
      });

      it('\'1\'', function () {
        var oneStringLiteral = '1';
        expect(trueUtility.isNumberOrNumericString(oneStringLiteral)).toEqual(true);
      });

      it('NaN', function () {
        var nanVar = 1 / 0;
        expect(trueUtility.isNumberOrNumericString(nanVar)).toEqual(true);
      });

      it('false', function () {
        var falseVar = false;
        expect(trueUtility.isNumberOrNumericString(falseVar)).toEqual(true);
      });

      it('true', function () {
        var trueVar = true;
        expect(trueUtility.isNumberOrNumericString(trueVar)).toEqual(true);
      });
    });

    describe('return false if argument is', function () {
      it('null', function () {
        var nullVar = null;
        expect(trueUtility.isNumberOrNumericString(nullVar)).toEqual(false);
      });

      it('undefined', function () {
        var undefinedVar;
        expect(trueUtility.isNumberOrNumericString(undefinedVar)).toEqual(false);
      });

      it('a string', function () {
        var stringVar = "hello";
        expect(trueUtility.isNumberOrNumericString(stringVar)).toEqual(false);
      });

      it('an empty string', function () {
        var emptyString = "";
        expect(trueUtility.isNumberOrNumericString(emptyString)).toEqual(false);
      });

      it('an empty array', function () {
        var emptyArray = [];
        expect(trueUtility.isNumberOrNumericString(emptyArray)).toEqual(false);
      });

      it('an empty object', function () {
        var emptyObject = {};
        expect(trueUtility.isNumberOrNumericString(emptyObject)).toEqual(false);
      });
    });
  });

  describe('isPromise should', function () {
    var $q;

    beforeEach(inject(function (_$q_) {
      $q = _$q_;
    }));

    describe('return true if argument is', function () {
      it('a promise', function () {
        var promiseVar = $q.defer().promise;
        expect(trueUtility.isPromise(promiseVar)).toEqual(true);
      });
    });

    describe('return false if argument is', function () {
      it('the deferred object', function () {
        var deferredVar = $q.defer();
        ;
        expect(trueUtility.isPromise(deferredVar)).toEqual(false);
      });

      it('null', function () {
        var nullVar = null;
        expect(trueUtility.isPromise(nullVar)).toEqual(false);
      });

      it('undefined', function () {
        var undefinedVar;
        expect(trueUtility.isPromise(undefinedVar)).toEqual(false);
      });

      it('a string', function () {
        var stringVar = "hello";
        expect(trueUtility.isPromise(stringVar)).toEqual(false);
      });

      it('an empty string', function () {
        var emptyString = "";
        expect(trueUtility.isPromise(emptyString)).toEqual(false);
      });

      it('an empty array', function () {
        var emptyArray = [];
        expect(trueUtility.isPromise(emptyArray)).toEqual(false);
      });

      it('an empty object', function () {
        var emptyObject = {};
        expect(trueUtility.isPromise(emptyObject)).toEqual(false);
      });
    });
  });

  describe('shuffle should', function () {
    var $q;

    beforeEach(inject(function (_$q_) {
      $q = _$q_;
    }));

    it('not return the same array', function () {
      var stubArray = [1,2,3,4,5,6,7,8,9,0];
      var result = trueUtility.shuffle(angular.copy(stubArray));
      expect(result).not.toEqual(stubArray);
    });
  });

  describe('findWithAttr', function () {
    var data = [
      {id_list: 2, name: 'John', token: '123123'},
      {id_list: 1, name: 'Nick', token: '312312'}
    ];

    it('returns the object from the array with the attribute having the value', function () {
      expect(trueUtility.findWithAttr(data, 'name', 'John')).toEqual(0);
      expect(trueUtility.findWithAttr(data, 'token', '312312')).toEqual(1);
      expect(trueUtility.findWithAttr(data, 'id_list', '10')).toBeUndefined();
    });
  });
});
