angular.module('SE').factory('SessionService', [
    '$q',
    '$http',
    function ($q, $http) {

        function SessionService() {

        }

        SessionService.prototype = {

            loadScript: function () {

                var deferred = $q.defer();

                $http.get('/script.json').then(
                    function (response) {
                        deferred.resolve(response.data);
                    },
                    function () {
                        deferred.reject(new Error('Error loading scipt'));
                    }
                );

                return deferred.promise;
            }

        };

        return new SessionService();
    }
]);