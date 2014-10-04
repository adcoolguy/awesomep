'use strict';

/**
 * @ngdoc function
 * @name fapApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the fapApp
 */
angular.module('fapApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
