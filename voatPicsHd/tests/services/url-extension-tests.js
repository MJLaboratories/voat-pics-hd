/**
 * Created by Matthew on 07/10/2015.
 */
describe('UrlExtensionService', function () {

  var urlExtensionService;

  beforeEach(module('ionic'));
  beforeEach(module('app.services'));
  beforeEach(module('app.controllers'));
  beforeEach(module('app.model'));


  beforeEach(inject(function (_UrlExtensionService_) {
    urlExtensionService = _UrlExtensionService_;
  }));

  describe('isValidExtension', function () {

    it('with html image returns false', function () {

      var isValid = urlExtensionService.isValid('index.html');

      expect(isValid).toBeFalsy();
    });

  });


});
