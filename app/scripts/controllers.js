angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, nycHealth, $rootScope, $cordovaGeolocation, ngGPlacesAPI,$http) {
     $rootScope.dataArray = [];
        //set the default options for the ngPlacesApi
      
        var posOptions = {
            timeout: 10000,
            enableHighAccuracy: false
        };
        $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function(position) {
                $rootScope.lat = position.coords.latitude;
                $rootScope.long = position.coords.longitude;                
                $rootScope.data = ngGPlacesAPI.nearbySearch({
                    latitude: $rootScope.lat,
                    longitude: $rootScope.long
                }).then(
                    function(data) {
                        $rootScope.nearbyRes = data;
                       var processedArray = [];
            var resName;
            var number = [];
            var resStreetNum;
            var boro
            var cityOpenDataUrl = 'https://data.cityofnewyork.us/resource/9w7m-hzhe.json?dba='
            var borugh = '&boro='
                var cityOpenDataUrl = 'https://data.cityofnewyork.us/resource/9w7m-hzhe.json?phone='
                var borugh = '&boro='
                             data.forEach(function(value, key) {
                    var getPhoneNumers = ngGPlacesAPI.placeDetails({
                        reference: value.reference
                    }).then(
                        function(el) {
                             return el
                        });
                    getPhoneNumers.then(function(el) {
                        var phoneNumber = el.formatted_phone_number
                        phoneNumber = phoneNumber.replace(/\s/g, '');
                        phoneNumber = phoneNumber.replace(/\)/g, '');
                        phoneNumber = phoneNumber.replace(/\(/g, '');
                        phoneNumber = phoneNumber.replace(/\-/g, '');
                        // console.log(el)
                        var getUrl = cityOpenDataUrl + phoneNumber;

                    $http.get(getUrl)
                        .then(function(dat) {
                            dat.value = value;
                            processedArray.push(dat)
                            $scope.restaurants = processedArray;
                            console.log($scope.restaurants)
                        })
                })

            })
                    });
            }, function(err) {
                alert('Seems like your location settings are turned off. Please check your location setting!')
                    // error
            });

        var watchOptions = {
            frequency: 1000,
            timeout: 3000,
            enableHighAccuracy: false // may cause errors if true
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

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
