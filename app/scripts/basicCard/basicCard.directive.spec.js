'use strict';

describe('Directive: basicCard', function () {

  // load the directive's module and view
  beforeEach(module('appApp'));
  beforeEach(module('app/basicCard/basicCard.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<basic-card></basic-card>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the basicCard directive');
  }));
});