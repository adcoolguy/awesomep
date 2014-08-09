'use strict';

var jmpress;
var app = angular.module("app", []);

app.directive('uiImpress', function () {
    return {
        restrict: 'A',
        scope: false,
        link: function ($scope, $element, $window) {
            var init = $scope.$watch('newdata', function (data) {
                if (data) {
                    $scope.$evalAsync(function () {
                        console.log(' $scope.data[0] check ======> [' 
                        // + $scope.data[0].author + "\n"
                        + $scope.newdata[0] + "\n"
                        + $scope.newdata[1] + "\n"
                        + "]");
                        jmpress = $($element).jmpress();

                        // $('.step')
                        //     .on('enterStep', function(event) {
                        //         // Called when entering only this step
                        //         alert('entered!')
                        //     })
                        //     .on('leaveStep', function(event) {
                        //         // Called when leaving only this step
                        //         alert('leave!')
                        //     });


                        console.log('jmpress 107d initialized!');
                        //init();
                    });
                };
            });
        }
    };
});

// var data;
// function cb(res) {
//   alert('100: ContentService responded author [' + res.data[0].author + ']');
//   console.log(res);
//   data = res.data[0];
// }

app.controller('randomData', function ($scope, $http, $window, $timeout, $interval) {
    var slides = 10;

    var config = {
        coordinates: [-1000, 1000],
        rotate: [-180, 180],
        scale: [0.1, 10]
    };

    // var randomDataSource = "http://api.icndb.com/jokes/random/" + slides;
    // var randomDataSource = "https://script.googleusercontent.com/macros/echo?user_content_key=g3jJn8mc4EDli4_78fFE6X-E539HccVRIMamTaTzhJ4GzJjSU_Mmpn9LKXuVKsTIrP-CzO7Ofh5qRyfh9ZkZAQDMbrdAE9W_m5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnO2VxMsvENCyASFMhBamCj5M4dAlGsP-vEkcs0Q0IKyTnLuhxfwBpu5zpL-1vuSTjA&lib=MDXkAoIMXv4rbCs-aIjOT_nTpSR1OlyVI";
    var randomDataSource = "https://script.google.com/macros/s/AKfycbyfELimRE5WFtYHUocEpnArHipg6WazmGR09fFULayA/dev?t=jsonp&callback=JSON_CALLBACK";
    
    // function getRandomInt(min, max) {
    //     return Math.floor(Math.random() * (max - min + 1)) + min;
    // }

    // function generateData(messages) {
    //     return _.range(slides).map(function (value, index) {
    //         return {
    //             message: messages[index],
    //             coordinates: {
    //                 x: getRandomInt.apply(null, config.coordinates),
    //                 y: getRandomInt.apply(null, config.coordinates),
    //                 z: getRandomInt.apply(null, config.coordinates)
    //             },
    //             rotate: {
    //                 x: getRandomInt.apply(null, config.rotate),
    //                 y: getRandomInt.apply(null, config.rotate),
    //                 z: getRandomInt.apply(null, config.rotate)
    //             },
    //             scale: getRandomInt.apply(null, config.scale)
    //         };
    //     });
    // }

    $http.jsonp(randomDataSource)
      .success(function (response) {
        //var myObj = angular.fromJson(response.data);
        console.log(' response.data[0].author ======> [' 
        + response.data[0].author +"\n "
        + response.data[0].t1 +"\n "
        + response.data[0].t2
        + "]");
        $scope.newdata = [];
        var obj = response.data[0]; //JSON.parse(response.data[0]) ;
        var count = 0;
        var previousObj = {};
        for(var prop in obj) {
            if(obj.hasOwnProperty(prop)) {
                console.info('key = [' + prop + ']'); // key name
                console.info('val = [' + obj[prop] + ']'); // value
                if (prop.charAt(0) !== 't' && prop.charAt(0) !== 'b') {
                  $scope.newdata.push({prop: {key: prop, value: obj[prop]}});
                } else if (prop.charAt(0) === 't') {
                  previousObj = {prop: {key: obj[prop], value: undefined}}; //TODO the value needs to be the second json object!!!
                }
                else if (prop.charAt(0) === 'b') {
                  if(previousObj.prop) previousObj.prop.value = obj[prop];
                  $scope.newdata.push(previousObj); //TODO the value needs to be the second json object!!!
                  // previousObj = {}
                }
            }
        }

        // var messages = response.data.value.map(function (item) {
        //     return item.joke;
        // })
        // //$scope.data = generateData(messages);
      })
      .error(function (data) {
        $scope.newdata = "Request failed";
      });

    //this is just a workaround for GAS with no callback to AngularJS success() method!
    // $scope.$watch(
    //     function () {
    //       return $window.data; 
    //     }, function(n, o){
    //       $timeout(function(){
    //         $scope.$apply(function(){
    //           $scope.data = $window.data;
    //         });
    //         console.log("window.data changed ", n);
    //       });
    //     }
    // );
    $scope.START_COUNT = 2;
    $scope.countDown = $scope.START_COUNT;
    $interval(function($window){
      $scope.countDown--;
      //console.log($scope.countDown);
      if($scope.countDown <=0) {
        $scope.countDown = $scope.START_COUNT;
        $('#jmpress').jmpress('next');
        //$window.jmpress.jmpress('next');
        //$window.jmpress().jmpress('jump', '#step-5', 'i said so');
      }
    },1000,0);

});

/**
 * @ngdoc overview
 * @name fapApp
 * @description
 * # fapApp
 *
 * Main module of the application.
 */
// angular
//   .module('fapApp', [
//     'ngAnimate',
//     'ngCookies',
//     'ngResource',
//     'ngRoute',
//     'ngSanitize',
//     'ngTouch'
//   ])
//   .config(function ($routeProvider) {
//     $routeProvider
//       .when('/', {
//         templateUrl: 'views/main.html',
//         controller: 'MainCtrl'
//       })
//       .when('/about', {
//         templateUrl: 'views/about.html',
//         controller: 'AboutCtrl'
//       })
//       .otherwise({
//         redirectTo: '/'
//       });
//   });
