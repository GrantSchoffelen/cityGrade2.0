angular.module('starter.services', [])

.factory('nycHealth', function($http, ngGPlacesAPI, ngGPlacesAPI, $cordovaGeolocation, $rootScope, $q) {
  return {
    healthDataByPhone: function(el) {
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
          console.log(dat.data, 'by phone')
          return dat.data;
        }).catch(function(err) {
          console.log(err);
        }).finally(function() {})
    },

    healthDataByCuisine: function(cuisine, zipcode){
      var url ='https://data.cityofnewyork.us/resource/9w7m-hzhe.json?zipcode='+zipcode+'&cuisine_description='+cuisine;
      return $http.get(url)
        .then(function(dat) {
          console.log(dat.data, 'by zip')

          return dat.data;
        }).catch(function(err) {
          console.log(err);
        }).finally(function() {})
    },

    localRestraunts: function(lat, long) {
      var defaults = {
        radius: 30000,
        sensor: false,
        latitude: null,
        longitude: null,
        types: ['food'],
        map: null,
        elem: null,
        nearbySearchKeys: ['name', 'reference', 'vicinity'],
        placeDetailsKeys: ['formatted_address', 'formatted_phone_number',
          'reference', 'website'
        ],
        nearbySearchErr: 'Unable to find nearby places',
        placeDetailsErr: 'Unable to find place details',
      };
      return ngGPlacesAPI.nearbySearch({
        latitude: lat,
        longitude: long,
        defaults: defaults
      }).then(function(restMin) {
        return restMin;
      }).catch(function(response) {
      })
      return restaurantsArr;
    },
    localRestrauntsMoreInfo: function(restaurant) {
        return ngGPlacesAPI.placeDetails({
          reference: restaurant.reference
        }).then(function(el) {
          return el;
        });
      }
  }
})
