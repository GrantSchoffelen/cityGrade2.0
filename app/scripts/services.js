angular.module('starter.services', [])

  .factory('nycHealth', function($http, ngGPlacesAPI, ngGPlacesAPI, $cordovaGeolocation, $rootScope) {
    return {  
        healthData:function(data) {
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
        }
        
    }     
})


