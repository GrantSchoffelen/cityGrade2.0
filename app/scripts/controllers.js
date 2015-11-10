angular.module('starter.controllers', [])

.controller('GradesCtrl', function($scope, nycHealth, $rootScope, $cordovaGeolocation, ngGPlacesAPI, $http, $ionicModal) {
  $rootScope.dataArray = [];
  if (!$rootScope.userZipcode) {
    $rootScope.userZipcode = null
  };
  $scope.restaurantsArr = [];

  $ionicModal.fromTemplateUrl('templates/singlecuisine.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.singleRestaurant = modal;
  });
  $scope.openSingleRestaurant = function(restaurant) {
    $scope.currentRestaurant = restaurant
    $scope.singleRestaurant.show();
  };
  $scope.closeSingleRestaurant = function() {
    $scope.singleRestaurant.hide();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.singleRestaurant.remove();
  });

  $ionicModal.fromTemplateUrl('templates/tab-filter.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.filter = modal;
  });
  $scope.openFilter = function() {
    $scope.filter.show();
  };
  $scope.closeFilter = function() {
    $scope.filter.hide();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.filter.remove();
  });
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
      nycHealth.localRestraunts($rootScope.lat, $rootScope.long).then(function(rests) {
        angular.forEach(rests, function(key, val) {
          nycHealth.localRestrauntsMoreInfo(key).then(function(rest) {
            if (!$rootScope.userZipcode) {
              $rootScope.userZipcode = rest.formatted_address.match(/[0-9]{5}/g);
            }
            nycHealth.healthDataByPhone(rest).then(function(grade) {
              $scope.restaurantsArr.push(grade);
              console.log($scope.restaurantsArr)
            })
          });
        });
      })
    }, function(err) {
      console.log(err)
      alert('Seems like your location settings are turned off. Please check your location setting!')
        // error
    });

  //  $scope.cuisines = ['Thai', 'Bakery', 'American', 'Jewish/Kosher', 'Delicatessen', 'Chinese', 'Hotdog', 'Ice Cream, Gelato, Yogurt, Ices', 'Chicken', 'Turkish', 'Carribbean', 'Donuts', 'Sandwiches/Salads/Mixed Buffet', 'Hamburgers']
  $scope.cuisines = [{
    name: 'Thai',
    image: 'images/thai.png'
  }, {
    name: 'Bakery',
    image: '../images/bakery.png'
  }, {
    name: 'American',
    image: '../images/American.png'
  }, {
    name: 'Jewish/Kosher',
    image: '../images/jewish.png'
  }, {
    name: 'Delicatessen',
    image: '../images/delicatessen.png'
  }, {
    name: 'Chinese',
    image: '../images/Chinese.png'
  }, {
    name: 'Turkish',
    image: '../images/thai.png'
  }]
  $scope.getLocationsByCuisine = function(cuisine) {
    $scope.restaurantsArr = [];
    nycHealth.healthDataByCuisine(cuisine, $rootScope.userZipcode).then(function(grade) {
      console.log(grade)
      $scope.restaurantsArr.push(grade)
      console.log($scope.restaurantsArr)
      $scope.closeFilter()
    })
  }

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
