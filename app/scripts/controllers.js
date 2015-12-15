angular.module('starter.controllers', [])

.controller('GradesCtrl', function($scope,
    currentLocation,
    $ionicLoading,
    nycHealth,
    $rootScope,
    $cordovaGeolocation,
    ngGPlacesAPI,
    $http,
    $ionicModal,
    $mdToast,
    $ionicPopup,
    $cordovaScreenshot,
    lodash,
    $filter) {
    console.log(currentLocation, 'here is the current location')
    $rootScope.lat = currentLocation.lat;
    $rootScope.long = currentLocation.long;
    $rootScope.dataArray = [];
    if (!$rootScope.userZipcode) {
        $rootScope.userZipcode = null
    };
    $scope.restaurantsArr = [];
    $scope.cuisineArr = [];
    $scope.showCurrentRepeat = 'location';
    $scope.checkCurrentRepeat = function(fil) {
        $scope.showCurrentRepeat = fil;
    };
    $ionicModal.fromTemplateUrl('templates/singlecuisine.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.singleRestaurant = modal;
    });
    $scope.openSingleRestaurant = function(restaurant) {
        console.log($scope.currentRestaurant, restaurant);
        $scope.currentRestaurant = restaurant;
        $scope.getChartData($scope.currentRestaurant)
        $scope.singleRestaurant.show();
    };
    $scope.closeSingleRestaurant = function() {
        $scope.singleRestaurant.hide();
    };
    //get random images
    $scope.randomImg = function() {
            return Math.floor(Math.random() * 5) + 1;
        }
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
                    $scope.showCurrentRepeat = 'filter';
                    $scope.restaurantsByFilter = restaurantsByPhone;
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
                    $scope.showCurrentRepeat = 'filter';
                    $scope.restaurantsByFilter = restaurants;
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

    // var posOptions = {
    //     timeout: 10000,
    //     enableHighAccuracy: false
    // };
    var init = function(lat, long) {
        nycHealth.reverseGeoCode(lat, long).then(function(address) {
            $rootScope.userZipcode = address.ADDRESS.postal_code;
            nycHealth.healthDataByZip($rootScope.userZipcode).then(function(rests) {
                angular.forEach(rests, function(key, val) {
                    $scope.restaurantsArr.push(key);
                    angular.forEach($scope.restaurantsArr, function(key, val) {
                        $scope.cuisineArr.push(key[0]);
                    })
                });
                angular.forEach($scope.restaurantsArr, function(key, val) {
                    $scope.restaurantsArr[val] = $filter('orderBy')(key, '-inspection_date');
                });
            })
        })
        nycHealth.localRestraunts(lat, long).then(function(rests) {
            angular.forEach(rests, function(key, val) {
                nycHealth.localRestrauntsMoreInfo(key).then(function(rest) {
                    if (!$rootScope.userZipcode) {
                        $rootScope.userZipcode = rest.formatted_address.match(/[0-9]{5}/g);
                    }
                    nycHealth.healthDataByPhone(rest).then(function(grade) {
                        $scope.restaurantsArr.push(grade);
                        angular.forEach($scope.restaurantsArr, function(key, val) {
                            $scope.restaurantsArr[val] = $filter('orderBy')(key, '-inspection_date');
                        });
                    })
                });
            });
        })
    };
    init($rootScope.lat, $rootScope.long);

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
        nycHealth.healthDataByCuisine(cuisine, $rootScope.userZipcode).then(function(grades) {
            $scope.closeFilter();
            if (grades.length === 0) {
                $mdToast.show(
                    $mdToast.simple()
                    .content('Sorry, No restaurant found by this cuisine in your area!')
                    .position('top')
                    .hideDelay(5000)
                );
            } else {
                $scope.showCurrentRepeat = 'filter';
                $scope.restaurantsByFilter = grades;
            }
        })
    };
    $scope.shareThisRes = function() {
        $cordovaScreenshot.capture().then(function(uri) {
            //message, subject, file, link
            window.plugins.socialsharing.share('Hey checkout this restaurant!', $scope.currentRestaurant[0].dba + '\'s Grade', uri, null)
        })
    }
    $scope.getChartData = function(current) {
        $scope.labels = [];
        $scope.chartData = [
            []
        ];
        angular.forEach(current, function(key, val) {
            if (key.score !== undefined) {
                var length = $scope.chartData[0].length;
        console.log($scope.chartData[0][length -1])

                if (Number(key.score) !== $scope.chartData[0][length -1]) {
                    $scope.chartData[0].push(Number(key.score));
                    var grade;
                    grade = key.score <= 13 ? 'A' : undefined;
                    grade = key.score > 13 && key.score <= 27 ? 'B' : grade;
                    grade = key.score > 27 ? 'C' : grade;
                    $scope.labels.push(grade)
                }
            }
        })
    };
    // var watchOptions = {
    //     frequency: 2000,
    //     timeout: 3000,
    //     enableHighAccuracy: false
    // };

    // var watch = $cordovaGeolocation.watchPosition(watchOptions);
    // watch.then(
    //     null,
    //     function(err) {
    //         // error
    //     },
    //     function(position) {
    //         var lat = position.coords.latitude;
    //         var long = position.coords.longitude;
    //         console.log('watch', lat, long)
    //     });


})
