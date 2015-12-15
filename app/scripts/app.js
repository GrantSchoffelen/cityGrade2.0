// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic',
    'angular-loading-bar',
    'starter.services',
    'starter.controllers',
    'starter.directives',
    'ngCordova',
    'ngGPlaces',
    'ngMaterial',
    'ngAnimate',
    'angular.filter',
    'ng-walkthrough',
    'ionic.utils',
    'ionic.screenshot',
    'ngLodash',
    'chart.js'
])

.run(function($ionicPlatform, $cordovaGeolocation, $rootScope, $http, nycHealth, $ionicPopup, $ionicLoading) {
    $ionicLoading.show({
        template: 'Loading...',
        hideOnStateChange: true
    });
    $ionicPlatform.ready(function() {
        $ionicLoading.hide();
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
        if (window.Connection) {
            if (navigator.connection.type == Connection.NONE) {
                $ionicPopup.confirm({
                        title: "Internet Disconnected",
                        content: "The internet is disconnected on your device please connect to internet and try again."
                    })
                    .then(function(result) {
                        if (ionic.Platform.isAndroid()) {
                            ionic.Platform.exitApp();
                        }
                    });
            }
        }

        // var posOptions = {
        //     timeout: 100,
        //     enableHighAccuracy: false
        // };
        // $cordovaGeolocation
        //     .getCurrentPosition(posOptions)
        //     .then(function(position) {}, function(err) {
        //         console.log(err)
        //             // alert('Seems like your location settings are turned off. Please check your location setting!')
        //         $ionicPopup.confirm({
        //                 title: "Location Setting Turned Off",
        //                 content: "Seems like your location settings are turned off. Please check your location setting!"
        //             })
        //             .then(function(result) {
        //                 if (!result) {
        //                     ionic.Platform.exitApp();
        //                 }
        //             });
        //     })

    });
})


.config(function($stateProvider, $urlRouterProvider, cfpLoadingBarProvider, ChartJsProvider) {
    ChartJsProvider.setOptions({
      colours: ['#FF5252', '#FF8A80'],
      responsive: false,
    });
    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider
        .state('tab', {
            url: '/tab',
            abstract: true,
            templateUrl: 'templates/tabs.html'
        })

    // Each tab has its own nav history stack:

    .state('tab.dash', {
        url: '/dash',
        views: {
            'tab-dash': {
                templateUrl: 'templates/tab-dash.html',
                controller: 'GradesCtrl',
                resolve: {
                    currentLocation: function($q, $cordovaGeolocation, $ionicPopup, $ionicLoading, $localStorage) {
                        console.log('hit resolve');
                        // $ionicLoading.show({
                        //     template: 'Loading...',
                        //     hideOnStateChange: true
                        // });
                        var q = $q.defer();
                        var storage = $localStorage;
                        var latLong;
                        var posOptions = {
                            timeout: 1000,
                            enableHighAccuracy: false
                        };
                        $cordovaGeolocation
                            .getCurrentPosition(posOptions)
                            .then(function(position) {
                                var lat = position.coords.latitude
                                var long = position.coords.longitude
                                latLong = {
                                    'lat': lat,
                                    'long': long
                                }
                                $localStorage.setObject(
                                    'latLong', latLong
                                );
                                q.resolve(latLong);
                            }, function(err) {
                                 navigator.geolocation.getCurrentPosition(function() {
                                    console.log('scuss')
                                 }, function(err) {
                                console.log(JSON.stringify(err), 'err in geting location')
                                    
                                 });
                                console.log(JSON.stringify(err), 'err in geting location')
                                latLong = null
                                var inStorage = $localStorage.getObject('latLong')
                                var ifStoreage = inStorage.hasOwnProperty('lat')
                                if (ifStoreage) {
                                    console.log(ifStoreage)
                                    var alertPopup = $ionicPopup.alert({
                                        title: "Location Setting Turned Off",
                                        template: 'Looks like your location settings are turned off, so City Grade will use your last known location. Please enable location setting to get the nearest restaurants.'
                                    });
                                    alertPopup.then(function(res) {
                                        console.log('NO LOCATION');
                                    });
                                    q.resolve(inStorage);
                                } else {
                                    $ionicPopup.confirm({
                                            title: "Location Setting Turned Off",
                                            content: "Seems like your location settings are turned off. Please check your location setting!"
                                        })
                                        .then(function(result) {
                                            console.log(result)
                                            if (ionic.Platform.isAndroid()) {
                                                ionic.Platform.exitApp();
                                            }
                                            q.reject('Failed to Get Lat Long')

                                        });
                                };
                                // navigator.geolocation.getCurrentPosition(function(pos) {
                                //     console.log('Position=')
                                //     console.log(pos);
                                //     latLong = {
                                //         'lat': pos.coords.latitude,
                                //         'long': pos.coords.longitude
                                //     }
                                //     $localStorage.setObject(
                                //         'latLong', latLong
                                //     );
                                //     q.resolve(latLong);

                                // }, function(error) {
                                //     console.log('Got error!');
                                //     console.log(error);
                                //     latLong = null
                                //     if ($localStorage.getObject('latLong')) {
                                //         var alertPopup = $ionicPopup.alert({
                                //             title: "Location Setting Turned Off",
                                //             template: 'Looks like your location settings are turned off, so City Grade will use your last known location. Please enable location setting to get the nearest restaurants.'
                                //         });
                                //         alertPopup.then(function(res) {
                                //             console.log('NO LOCATION');
                                //         });
                                //         q.resolve($localStorage.getObject('latLong'));
                                //     } else {
                                //         $ionicPopup.confirm({
                                //                 title: "Location Setting Turned Off",
                                //                 content: "Seems like your location settings are turned off. Please check your location setting!"
                                //             })
                                //             .then(function(result) {
                                //                 console.log(result)
                                //                 if (ionic.Platform.isAndroid()) {
                                //                     ionic.Platform.exitApp();
                                //                 }
                                //                 q.reject('Failed to Get Lat Long')

                                //             });
                                //     }

                                // });

                            });
                        console.log(JSON.stringify($localStorage.getObject('latLong')) , 'lat lonf')
                        return q.promise;
                    }
                }
            }
        }
    })

    // .state('tab.chats', {
    //     url: '/chats',
    //     views: {
    //       'tab-chats': {
    //         templateUrl: 'templates/tab-chats.html',
    //         controller: 'ChatsCtrl'
    //       }
    //     }
    //   })
    //   .state('tab.chat-detail', {
    //     url: '/chats/:chatId',
    //     views: {
    //       'tab-chats': {
    //         templateUrl: 'templates/chat-detail.html',
    //         controller: 'ChatDetailCtrl'
    //       }
    //     }
    //   })

    // .state('tab.account', {
    //   url: '/account',
    //   views: {
    //     'tab-account': {
    //       templateUrl: 'templates/tab-account.html',
    //       controller: 'AccountCtrl'
    //     }
    //   }
    // });
    cfpLoadingBarProvider.includeBar = false;
    cfpLoadingBarProvider.spinnerTemplate = '<div style="position:absolute; z-index:10000; margin:45%"><img src="images/spinner.svg"></div>';
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/dash');

});
