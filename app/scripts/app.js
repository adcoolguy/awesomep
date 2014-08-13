'use strict';

var underscore = angular.module('underscore', []);
underscore.factory('_', function() {
    return window._; // assumes underscore has already been loaded on the page
});

//courtesy of http://stackoverflow.com/questions/17289448/angularjs-to-output-plain-text-instead-of-html
angular.module('app.filters', []).
  filter('htmlToPlainText', function() {
    return function(text) {
      return String(text).replace(/<[^>]+>/gm, '');
    }
  }
);

var app = angular.module("app", ['underscore', 'ngSanitize', 'app.filters']);

app.filter('numberFixedLen', function () {
    return function(a,b){
        return(1e4+a+"").slice(-b)
    }
});

app.directive('uiImpress', function () {
    return {
        restrict: 'A',
        scope: false,
        link: function ($scope, $element, $window) {
            var init = $scope.$watch('newdata', function (data) {
                if (data) {
                    $scope.$evalAsync(function () {
                        //console.log(' $scope.data[0] check ======> ['
                        //// + $scope.data[0].author + "\n"
                        //+ $scope.newdata[0] + "\n"
                        //+ $scope.newdata[1] + "\n"
                        //+ "]");
                        $($element).jmpress(
//                            {
//                                viewPort: {
//                                    height: 800,
//                                    width: 500,
//                                    maxScale: 3
//                                }
//                            }
                        );
                        //$($element).jmpress({
                        //    stepSelector: "section"
                        //    ,hash: { use: false }
                        //});
                        //start: "step-1"
                        // $('.step')
                        //     .on('enterStep', function(event) {
                        //         // Called when entering only this step
                        //         alert('entered!')
                        //     })
                        //     .on('leaveStep', function(event) {
                        //         // Called when leaving only this step
                        //         alert('leave!')
                        //     });


                        console.log('jmpress 108b initialized!');
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

app.controller('randomData', function ($scope, $http, $window, $timeout, $interval, _, $sce, htmlToPlainTextFilter) {
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

    //poor man's word count logic (thanks to http://jsfiddle.net/shaydoc/rxcHA/)
    $scope.getWordCount = 
    function(tex) {
      //console.log(tex);
      var removePunctuation = tex.replace(/[!,?.":;]/g,' ');
      var split = removePunctuation.split(" ");
      var res =
          _.chain(split)
        .without('',' ','a','an','and','any','are','that','The','the','this','of','for','to','with','is','in','on','our','Our')
        .groupBy( function(word){return word;} )
        .sortBy(  function(word){ return word.length; } )
        .value();
      var totalWords = 0;
      
      $.each( res, function( index, word ){
        totalWords += word.length;
      });
      //console.log('wcount ' + totalWords);
      
      return totalWords;
    };
    
    $scope.createTimedIndex = 
    function(seconds) {
      var years = Math.floor(seconds / 31536000);
      var max =2;
      var current = 0;
      var str = "";
      if (years && current<max) {
          str+= years + 'y ';
          current++;
      }
      var days = Math.floor((seconds %= 31536000) / 86400);
      if (days && current<max) {
          str+= days + 'd ';
          current++;
      }
      var hours = Math.floor((seconds %= 86400) / 3600);
      if (hours && current<max) {
          str+= hours + ':';
          str = htmlToPlainTextFilter(str, 2);
          current++;
      } else {
          str+='00:';
      }
      var minutes = Math.floor((seconds %= 3600) / 60);
      if (minutes && current<max) {
          str+= minutes + ':';
          str = htmlToPlainTextFilter(str, 2);
          current++;
      } else {
          str+='00:';
      }
      var seconds = seconds % 60;
      if (seconds && current<max) {
          str+= seconds + '';
          str = htmlToPlainTextFilter(str, 2);
          current++;
      } else {
          str+='00';
      }
      
      return str;
    }

    $http.jsonp(randomDataSource)
      .success(function (response) {
        //var myObj = angular.fromJson(response.data);
        console.log(' response.data[0].topic ======> ['
        + response.data[0].topic +"] \n author ["
        + response.data[0].author +"] \n created ["
        + response.data[0].created +"] \n updated ["
        + response.data[0].updated + "]"
        + "]");
        $scope.author = response.data[0].author;
        $scope.topic = response.data[0].topic;
        $scope.created = response.data[0].created;
        $scope.updated = response.data[0].updated;
        $scope.flag = response.data[0].flag;
        $scope.bg1 = response.data[0].bg1;
        $scope.bg2 = response.data[0].bg2;
        $scope.f1 = response.data[0].f1;
        $scope.newmeta = [];
        $scope.newdata = [];
        $scope.weight = [];
        $scope.timings = [];
        var obj = response.data[0]; //JSON.parse(response.data[0]) ;
        var count = 0;
        var previousObj = {};
        var curr;
        var currTotalWeight = 0;
        for(var prop in obj) {
            if(obj.hasOwnProperty(prop)) {
                //console.info('key = [' + prop + ']'); // key name
                //console.info('val = [' + obj[prop] + ']'); // value
                if (prop.charAt(0) !== 't' && prop.charAt(0) !== 'b') {
                    $scope.newmeta.push({prop: {key: prop, value: obj[prop]}});
                } else if (prop.charAt(0) === 't') {
                    previousObj = {prop: {key: obj[prop], value: undefined}};
                }
                else if (prop.charAt(0) === 'b') {
                    if(previousObj.prop) {
                      previousObj.prop.value = obj[prop]; //this won't work with ng-bind-html
                      previousObj.prop.safevalue = $sce.trustAsHtml(obj[prop]);
                      previousObj.prop.safekey = $sce.trustAsHtml(previousObj.prop.key);
                      curr = Math.round($scope.getWordCount(obj[prop])/3);
                      currTotalWeight += curr;
                      $scope.weight.push(curr);   //*** TIMING LOGIC: just the simple words count logic for now
                      $scope.timings.push($scope.createTimedIndex(currTotalWeight) + ' ' + previousObj.prop.safekey);
                    }
                    if(typeof previousObj.prop !== 'undefined' && previousObj.prop.key.trim() !== '' && previousObj.prop.key.trim().length > 0
                    ) {
                      $scope.newdata.push(previousObj);
                    }
                }
            }
        }
        console.log($scope.timings);
        _.compact($scope.newdata);
        
        // var messages = response.data.value.map(function (item) {
        //     return item.joke;
        // })
        // //$scope.data = generateData(messages);
        
        console.log($scope.weight);
        var stopTime;
        $scope.START_COUNT = $scope.weight[0];
        $scope.currentStep = 1;
        $scope.countDown = $scope.START_COUNT;
        stopTime = $interval(function($window){
          $scope.countDown--;
          //console.log($scope.countDown);
          if($scope.countDown <=0) {
            if(!isNaN($scope.weight[$scope.currentStep])) {
                if($scope.weight[$scope.currentStep] > 0) {
                    $scope.countDown = $scope.weight[$scope.currentStep];
                } else {
                    $scope.countDown = 3;   //at least 3 seconds
                }
            } else {
              $scope.countDown = 0;
              $interval.cancel(stopTime);
            }
//        $('#jmpress').jmpress('next');
            $('#jmpress').jmpress('select', '#step-' + ($scope.currentStep+1), 'move only 1 step at a time not two!');
            $scope.currentStep++;
          }
        },1000,0);
    
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
