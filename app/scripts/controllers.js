angular.module('starter.controllers', [])

.controller('GradesCtrl', function($scope, $ionicLoading, nycHealth, $rootScope, $cordovaGeolocation, ngGPlacesAPI, $http, $ionicModal, $mdToast) {
     
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
    $scope.searchInputType = 'Name';
    $scope.setSearchInput = function(type) {
        $scope.searchInputType = type;
    };
    //search by text field search from the user

    $scope.inputSearch = function(inputedText, searchType) {
        var searchParam = $scope.SearchByInput || inputedText;
        if ($scope.searchInputType === 'Phone #') {
            nycHealth.healthDataByPhone(searchParam).then(function(restaurants) {
              var restaurantsByPhone = nycHealth.formatRestraunts(restaurants)
                if (restaurantsByPhone.length === 0) {
                    $mdToast.show(
                        $mdToast.simple()
                        .content('Sorry, No restaurant found with this number!')
                        .position('top')
                        .hideDelay(5000)
                    );
                } else {
                    $scope.restaurantsArr = restaurantsByPhone;
                };
            });
        } else if ($scope.searchInputType === 'Name') {
            nycHealth.healthDataByDba(searchParam).then(function(restaurants) {
                console.log(restaurants, 'from search name');
                if (restaurants.length === 0) {
                    $mdToast.show(
                        $mdToast.simple()
                        .content('Sorry, No restaurant found with this Name in your area!')
                        .position('top')
                        .hideDelay(5000)
                    );
                } else {
                    $scope.restaurantsArr = restaurants;
                };
                
            });
        }
    }

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
            nycHealth.reverseGeoCode($rootScope.lat, $rootScope.long).then(function(address) {
              $rootScope.userZipcode = address.ADDRESS.postal_code;
              nycHealth.healthDataByZip($rootScope.userZipcode).then(function(rests) {
                angular.forEach(rests, function(key, val) {
                $scope.restaurantsArr.push(key);
                  
                })
              })
            })
            nycHealth.localRestraunts($rootScope.lat, $rootScope.long).then(function(rests) {
                angular.forEach(rests, function(key, val) {
                    nycHealth.localRestrauntsMoreInfo(key).then(function(rest) {
                        if (!$rootScope.userZipcode) {
                            $rootScope.userZipcode = rest.formatted_address.match(/[0-9]{5}/g);
                        }
                        nycHealth.healthDataByPhone(rest).then(function(grade) {
                            $scope.restaurantsArr.unshift(grade);
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
        if ($scope.isViolationShown(index)) {
            $scope.shownViolation = null;
        } else {
            $scope.shownViolation = +index;
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
        image: 'images/bakery.png'
    }, {
        name: 'Carribbean',
        image: 'images/American.png'
    }, {
        name: 'Jewish/Kosher',
        image: 'images/jewish.png'
    }, {
        name: 'Delicatessen',
        image: 'images/delicatessen.png'
    }, {
        name: 'Chinese',
        image: 'images/Chinese.png'
    }, {
        name: 'Turkish',
        image: 'images/thai.png'
    }]
    $scope.getLocationsByCuisine = function(cuisine) {
        $scope.restaurantsByCuisine = [];
        nycHealth.healthDataByCuisine(cuisine.name, $rootScope.userZipcode).then(function(grades) {
            $scope.closeFilter();
            if (grades.length === 0) {
                $mdToast.show(
                    $mdToast.simple()
                    .content('Sorry, No restaurant found by this cuisine in your area!')
                    .position('top')
                    .hideDelay(5000)
                );
            } else {
                $scope.restaurantsArr = grades;
            }
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
            var lat = position.coords.latitude;
            var long = position.coords.longitude;
            console.log('watch', lat, long)
        });


})
