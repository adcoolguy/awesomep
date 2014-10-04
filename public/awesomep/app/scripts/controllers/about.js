'use strict';

/**
 * @ngdoc function
 * @name fapApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the fapApp
 */
angular.module('fapApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
