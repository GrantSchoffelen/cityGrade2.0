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
    console.log($scope.currentRestaurant, restaurant);
    $scope.currentRestaurant = restaurant;
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
            })
          });
        });
      })
    }, function(err) {
      console.log(err)
      alert('Seems like your location settings are turned off. Please check your location setting!')
        // error
    });

    $scope.toggleViolation = function(index) {
      console.log($scope.shownViolation, index);
        if ($scope.isViolationShown(index)) {
          $scope.shownViolation = null;
        } else {
          $scope.shownViolation = + index;
        }
      };
      $scope.isViolationShown = function(index) {
        return $scope.shownViolation === index;
      };
  //  $scope.cuisines = ['Thai', 'Bakery', 'American', 'Jewish/Kosher', 'Delicatessen', 'Chinese', 'Hotdog', 'Ice Cream, Gelato, Yogurt, Ices', 'Chicken', 'Turkish', 'Carribbean', 'Donuts', 'Sandwiches/Salads/Mixed Buffet', 'Hamburgers']
  $scope.cuisines = [{
    name: 'Thai',
    image: 'images/thai.png'
  }, {
    name: 'Bakery',
    image: '../images/bakery.png'
  }, {
    name: 'Carribbean',
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
    $scope.restaurantsByCuisine = [];

    function findBycamis(source, camis) {
      var value;
      angular.forEach(source, function(key, val) {
        if (Number(key[0].camis) === Number(camis)) {
          value = val;
          return;
        };
      });
      return value;
    };
    nycHealth.healthDataByCuisine(cuisine.name, $rootScope.userZipcode).then(function(grade) {
      var index;
      angular.forEach(grade, function(key, val) {
        if ($scope.restaurantsByCuisine.length === 0) {
          $scope.restaurantsByCuisine.push([key]);
        } else {
          index = findBycamis($scope.restaurantsByCuisine, key.camis);
          if (index !== null && index !== undefined) {
            $scope.restaurantsByCuisine[index].push(key);
          } else {
            if (key.camis) {
              $scope.restaurantsByCuisine.push([key]);
            }
          }
        };
      });
      console.log($scope.restaurantsByCuisine);
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
