angular.module('starter.services', [])

.factory('nycHealth', function($http, ngGPlacesAPI, ngGPlacesAPI, $cordovaGeolocation, $rootScope, $q) {
    var nycUrl = 'https://data.cityofnewyork.us/resource/9w7m-hzhe.json?'

    function putInRightFormat(dat) {
        var restaurantsArr = [];
        var rests = dat.data ? dat.data : dat;
        angular.forEach(rests, function(key, val) {
            if (restaurantsArr.length === 0) {
                restaurantsArr.push([key]);
            } else {
                index = findBycamis(restaurantsArr, key.camis);
                if (index !== null && index !== undefined) {
                    restaurantsArr[index].push(key);
                } else {
                    if (key.camis) {
                        restaurantsArr.push([key]);
                    }
                }
            };
        });
        return restaurantsArr;
    }

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
        formatRestraunts: function(dat) {
            return putInRightFormat(dat);
        },
        reverseGeoCode: function(lat, long) {
            return $http.get('https://www.geocode.farm/v3/json/reverse/?lat=' + lat + '&lon=' + long + '&country=us&lang=en&count=1').then(function(address) {
                console.log(address)
                return address.data.geocoding_results.RESULTS[0];
            })
        },
        healthDataByZip: function(zip) {
            var getUrl = nycUrl + 'zipcode=' + zip;
            return $http.get(getUrl)
                .then(function(dat) {
                    return putInRightFormat(dat);
                }).catch(function(err) {}).finally(function() {})
        },
        healthDataByGrade: function(grade, zipcode) {
            var getUrl = nycUrl + 'zipcode=' + zip + '&grade='
            grade;
            return $http.get(getUrl)
                .then(function(dat) {
                    var restaurantsByZip = [];
                    var rests = dat.data;
                    angular.forEach(rests, function(key, val) {
                        if (restaurantsByZip.length === 0) {
                            restaurantsByZip.push([key]);
                        } else {
                            index = findBycamis(restaurantsByZip, key.camis);
                            if (index !== null && index !== undefined) {
                                restaurantsByZip[index].push(key);
                            } else {
                                if (key.camis) {
                                    restaurantsByZip.push([key]);
                                }
                            }
                        };
                    });
                    return restaurantsByZip;
                }).catch(function(err) {}).finally(function() {})

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
                    return putInRightFormat(dat);
                }).catch(function(err) {}).finally(function() {})
        },
        healthDataByCuisine: function(cuisine, zipcode) {
            var url = 'https://data.cityofnewyork.us/resource/9w7m-hzhe.json?zipcode=' + zipcode + '&cuisine_description=' + cuisine;
            return $http.get(url)
                .then(function(dat) {
                    return putInRightFormat(dat);
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
