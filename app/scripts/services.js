angular.module('starter.services', [])

.factory('nycHealth', function($http, ngGPlacesAPI, ngGPlacesAPI, $cordovaGeolocation, $rootScope, $q) {
  return {
    healthData: function(el) {
      var def = $q.defer();
      var cityOpenDataUrl = 'https://data.cityofnewyork.us/resource/9w7m-hzhe.json?phone=';
      var phoneNumber = el.formatted_phone_number
      phoneNumber = phoneNumber.replace(/\s/g, '');
      phoneNumber = phoneNumber.replace(/\)/g, '');
      phoneNumber = phoneNumber.replace(/\(/g, '');
      phoneNumber = phoneNumber.replace(/\-/g, '');
      var getUrl = cityOpenDataUrl + phoneNumber;
      var resDat;
    return $http.get(getUrl)
        .then(function(dat) {
          console.log(dat);
        return dat.data;
        }).catch(function(err) {
          console.log(err);
        }).finally(function () {
        })

      // var googleapisKey = '&key=AIzaSyAH_IyMyerV407ZCEa29Kq7ciIysSwrRSE';
      // var reverseGeocodeApli = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='



      //     data.forEach(function(value, key) {
      //         var getPhoneNumers = ngGPlacesAPI.placeDetails({
      //             reference: value.reference
      //         }).then(
      //             function(el) {
      //                 el.info = value;
      //                 return el
      //             });
      //         getPhoneNumers.then(function(el) {
      //             var phoneNumber = el.formatted_phone_number
      //             phoneNumber = phoneNumber.replace(/\s/g, '');
      //             phoneNumber = phoneNumber.replace(/\)/g, '');
      //             phoneNumber = phoneNumber.replace(/\(/g, '');
      //             phoneNumber = phoneNumber.replace(/\-/g, '');
      //             // console.log(el)
      //             var getUrl = cityOpenDataUrl + phoneNumber;

      //         $http.get(getUrl)
      //             .then(function(dat) {
      //                 dat.value = value;
      //                 processedArray.push(dat)
      //                 console.log(processedArray)
      //             })
      //     })

      // })
    },
    localRestraunts: function(lat, long) {
      return ngGPlacesAPI.nearbySearch({
        latitude: lat,
        longitude: long
      }).then(function(restMin) {
        return restMin;
      }).catch(function(response) {
        console.log(response);
      })
      return restaurantsArr;
    },
    localRestrauntsMoreInfo: function(restaurant) {
      return ngGPlacesAPI.placeDetails({
        reference: restaurant.reference
      }).then(function(el) {
        return el;
      });
    } //,
    // init: function () {
    //   debugger
    //   var restaurantsArr =[]
    //   $cordovaGeolocation
    //     .getCurrentPosition(posOptions)
    //     .then(function(position) {
    //       nycHealth.localRestrauntsposition.coords.latitude, position.coords.longitude).then(function (rests) {
    //         angular.forEach(rests, function (key, val) {
    //           nycHealth.localRestrauntsMoreInfo(key).then(function (rest) {
    //               restaurantsArr.push(rest);
    //           });
    //         });
    //         return restaurantsArr;
    //       })
    //     })
    // }

  }
})
