angular.module('starter.controllers', [])

.controller('GradesCtrl', function($scope, nycHealth, $rootScope, $cordovaGeolocation, ngGPlacesAPI, $http) {
  $rootScope.dataArray = [];
  $scope.restaurantsArr = [];
  //set the default options for the ngPlacesApi

  var posOptions = {
    timeout: 30000,
    enableHighAccuracy: false
  };
  $cordovaGeolocation
    .getCurrentPosition(posOptions)
    .then(function(position) {
      $rootScope.lat = position.coords.latitude;
      $rootScope.long = position.coords.longitude;
      nycHealth.localRestraunts($rootScope.lat, $rootScope.long).then(function (rests) {
        angular.forEach(rests, function (key, val) {
          nycHealth.localRestrauntsMoreInfo(key).then(function (rest) {
              nycHealth.healthData(rest).then(function (grade) {
                $scope.restaurantsArr.push({restaurantInfo: key, gradeInfo: grade});
                console.log($scope.restaurantsArr);
              })
          });
        });
      })
    }, function(err) {
      console.log(err)
      alert('Seems like your location settings are turned off. Please check your location setting!')
        // error
    });

  var watchOptions = {
    frequency: 1000,
    timeout: 3000,
    enableHighAccuracy: false
  };

  var watch = $cordovaGeolocation.watchPosition(watchOptions);
  watch.then(
    null,
    function(err) {
      // error
    },
    function(position) {
      var lat = position.coords.latitude
      var long = position.coords.longitude
      console.log('watch', lat, long)
    });


})
