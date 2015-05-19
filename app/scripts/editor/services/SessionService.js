angular.module( 'SE' ).factory( 'SessionService', [
    '$q',
    '$http',
    'DATA_SERVER',

    function ($q, $http, DATA_SERVER ) {

        function SessionService() {

        }

        SessionService.prototype = {


            getScenariosForProject : function ( projectName ) {

            },


            loadScript: function () {

                var deferred = $q.defer();

                $http.jsonp( DATA_SERVER +'/api/get.php', {

                    params : {
                        project : 'srebrenica',
                        resource: 'scenarios',
                        id: 'chapter-01',
                        callback : 'JSON_CALLBACK'
                    }

                }).then(

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