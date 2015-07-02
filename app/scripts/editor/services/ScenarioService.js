angular.module( 'SE' ).factory( 'ScenarioService', [
    '$q',
    '$http',
    'DATA_SERVER',

    function ($q, $http, DATA_SERVER ) {

        function ScenarioService() {

        }

        ScenarioService.prototype = {

            getAssetsForProject : function ( projectName ) {

                var deferred = $q.defer();

                $http.get( DATA_SERVER +'/api/get.php', {

                    params : {
                        project : projectName,
                        resource: 'assets'
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

                $http.get( DATA_SERVER +'/api/get.php', {

                    params : {
                        project : projectName,
                        resource: 'scenarios'
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

                $http.get( DATA_SERVER +'/api/get.php', {

                    params : {
                        project : projectName,
                        resource: 'scenarios',
                        id: scenarioId || 'chapter-01'
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

                $http.post( DATA_SERVER +'/api/post.php',  'scenario='+ encodeURIComponent( JSON.stringify( scenarioData ) ),

                    {
                        headers : {
                            'Content-type' : 'application/x-www-form-urlencoded'
                        },

                        params : {
                            project : projectName,
                            resource: 'scenarios',
                            id: scenarioId || 'chapter-01'
                        }
                    }
                ).then(

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

        return new ScenarioService();
    }
]);