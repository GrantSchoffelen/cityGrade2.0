'use strict';

angular.module('starter.directives', [])
  .directive('basicCard', function () {
    return {
      templateUrl: 'scripts/basicCard/basicCard.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
