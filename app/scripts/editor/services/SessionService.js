angular.module( 'SE' ).factory( 'SessionService', [
    '$q',
    '$http',
    'DATA_SERVER',

    function ($q, $http, DATA_SERVER ) {

        function SessionService() {

        }

        SessionService.prototype = {

            getAssetsForProject : function ( projectName ) {

                var deferred = $q.defer();

                $http.jsonp( DATA_SERVER +'/api/get.php', {

                    params : {
                        project : projectName || 'srebrenica',
                        resource: 'assets',
                        callback : 'JSON_CALLBACK'
                    }

                }).then(

                    function (response) {
                        deferred.resolve( response.data );
                    },

                    function () {
                        deferred.reject( new Error('Error loading project assets') );
                    }

                );

                return deferred.promise;
            },

            getScenariosForProject : function ( projectName ) {

                var deferred = $q.defer();

                $http.jsonp( DATA_SERVER +'/api/get.php', {

                    params : {
                        project : projectName || 'srebrenica',
                        resource: 'scenarios',
                        callback : 'JSON_CALLBACK'
                    }

                }).then(

                    function (response) {
                        deferred.resolve( response.data );
                    },

                    function () {
                        deferred.reject( new Error('Error loading project scenarios') );
                    }

                );

                return deferred.promise;
            },

            getScenarioForProject : function ( scenarioId, projectName ) {

                var deferred = $q.defer();

                $http.jsonp( DATA_SERVER +'/api/get.php', {

                    params : {
                        project : projectName || 'srebrenica',
                        resource: 'scenarios',
                        id: scenarioId || 'chapter-01',
                        callback : 'JSON_CALLBACK'
                    }

                }).then(

                    function (response) {
                        deferred.resolve(response.data);
                    },

                    function () {
                        deferred.reject(new Error('Error loading scenario data'));
                    }

                );

                return deferred.promise;
            },


            loadScript: function () {

                return this.getScenarioForProject();
            },


            saveScenarioForProject : function ( scenarioId, scenarioData, projectName ) {

                var deferred = $q.defer();

                /*
                     Een post werkt niet vanuit JSONP, dus voorlopig maar even de data via de URL meegeven, kijken hoever
                     we daar mee komen :)
                 */

                $http.jsonp( DATA_SERVER +'/api/post.php', {

                    params : {
                        project : projectName || 'srebrenica',
                        resource: 'scenarios',
                        id: scenarioId || 'chapter-01',
                        scenario : scenarioData,
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