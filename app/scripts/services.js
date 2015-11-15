angular.module('starter.services', [])

.factory('nycHealth', function($http, ngGPlacesAPI, ngGPlacesAPI, $cordovaGeolocation, $rootScope, $q) {
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
    return {
        findBy: function(source, camis) {
            return findBycamis(source, camis);
        },
        healthDataByPhone: function(el) {
            var cityOpenDataUrl = 'https://data.cityofnewyork.us/resource/9w7m-hzhe.json?phone=';
            var phoneNumber = el.formatted_phone_number || el;
            if (phoneNumber.search(/\s/g) != -1) {
                phoneNumber = phoneNumber.replace(/\s/g, '');
            }
            if (phoneNumber.search(/\)/g) != -1) {
                phoneNumber = phoneNumber.replace(/\)/g, '');
            }
            if (phoneNumber.search(/\(/g) != -1) {
                phoneNumber = phoneNumber.replace(/\(/g, '');
            }
            if (phoneNumber.search(/\-/g) != -1) {
                phoneNumber = phoneNumber.replace(/\-/g, '');
            }
            var getUrl = cityOpenDataUrl + phoneNumber;
            return $http.get(getUrl)
                .then(function(dat) {
                    return dat.data;
                }).catch(function(err) {}).finally(function() {})
        },
        healthDataByDba: function(el) {
            console.log(el)
            var cityOpenDataUrl = 'https://data.cityofnewyork.us/resource/9w7m-hzhe.json?dba=';
            var getUrl = cityOpenDataUrl + el.toUpperCase();
            return $http.get(getUrl)
                .then(function(dat) {
                    var restaurantsByDba = [];
                    var rests = dat.data;

                    angular.forEach(rests, function(key, val) {
                        if (restaurantsByDba.length === 0) {
                            restaurantsByDba.push([key]);
                        } else {
                            index = findBycamis(restaurantsByDba, key.camis);
                            if (index !== null && index !== undefined) {
                                restaurantsByDba[index].push(key);
                            } else {
                                if (key.camis) {
                                    restaurantsByDba.push([key]);
                                }
                            }
                        };
                    });
                    return restaurantsByDba;
                }).catch(function(err) {}).finally(function() {})
        },
        healthDataByCuisine: function(cuisine, zipcode) {
            var url = 'https://data.cityofnewyork.us/resource/9w7m-hzhe.json?zipcode=' + zipcode + '&cuisine_description=' + cuisine;
            return $http.get(url)
                .then(function(dat) {
                    var restaurantsByCusine = [];
                    var rests = dat.data;
                    angular.forEach(rests, function(key, val) {
                        if (restaurantsByCusine.length === 0) {
                            restaurantsByCusine.push([key]);
                        } else {
                            index = findBycamis(restaurantsByCusine, key.camis);
                            if (index !== null && index !== undefined) {
                                restaurantsByCusine[index].push(key);
                            } else {
                                if (key.camis) {
                                    restaurantsByCusine.push([key]);
                                }
                            }
                        };
                    });
                    return restaurantsByCusine;
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
            }).catch(function(response) {})
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
