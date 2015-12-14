angular.module('ionic.screenshot', [])
.service('$cordovaScreenshot', ['$q', function ($q){
    return {
        capture: function (filename, extension, quality){
            extension = extension || 'jpg';
            quality = quality || '100';
            var defer = $q.defer();

            navigator.screenshot.URI(function (error, res){
                if (error) {
                    console.error(error);
                    defer.reject(error);
                } else {
                    console.log('screenshot saved in: ', res.URI);
                    defer.resolve(res.URI);
                }
            }, extension, quality, filename);

            return defer.promise;
        }
    };
}])