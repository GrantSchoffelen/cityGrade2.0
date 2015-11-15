// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'angular-loading-bar', 'starter.services', 'starter.controllers', 'starter.directives', 'ngCordova', 'ngGPlaces', 'ngMaterial', 'ngAnimate'])

.run(function($ionicPlatform, $cordovaGeolocation, $rootScope, $http, nycHealth) {
    $ionicPlatform.ready(function() {

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
                        content: "The internet is disconnected on your device."
                    })
                    .then(function(result) {
                        if (!result) {
                            ionic.Platform.exitApp();
                        }
                    });
            }
        }

    });
})


.config(function($stateProvider, $urlRouterProvider, cfpLoadingBarProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // setup an abstract state for the tabs directive
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
                controller: 'GradesCtrl'
            }
        }

        //,
        // resolve: {
        //   message: function(nycHealth) {
        //     console.log(nycHealth.init());
        //     return nycHealth.init()
        //   }
        // }
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
    cfpLoadingBarProvider.spinnerTemplate = '<div style="position:absolute; z-index:10000; margin:49%"><img src="images/spinner.svg"></div>';
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/dash');

});
