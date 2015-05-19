angular.module( 'SE' ).factory( 'ActorService', [
    '$q',
    '$http',
    function ( $q, $http ) {

        function ActorService() {

            this.actors = [
                {
                    name: 'Image',
                    type: 'image',
                    start: 0,
                    duration: 5000
                },
                {
                    name: 'Audio',
                    type: 'audio',
                    start: 0,
                    duration: 5000,
                    offset: 0
                },
                {
                    type: 'generic',
                    name: 'Image Cover',
                    start: 0,
                    duration: 5000,
                    'template': {
                        "background": {
                            'image': '',
                            'sizing': 'cover'
                        }
                    }
                },
                {
                    type: 'generic',
                    name: 'Image Contain',
                    start: 0,
                    duration: 5000,
                    'template': {
                        "background": {
                            'image': '',
                            'sizing': 'contain'
                        }
                    }
                }
            ];

            //this.actors = [];
            //this.actorTypes = [];

            //actors.forEach( function( actor ){
            //    var type = actor['type'];
            //
            //    this.actors[type] = actor;
            //    this.actorTypes.push( type );
            //
            //}.bind( this ));

        }

        ActorService.prototype = {

            getActor: function( type ){
                return this.actors[type];
            },

            getActors: function(){
                return this.actors;
            },

            getActorTypes: function(){
                return this.actorTypes();
            }

        };

        return new ActorService();
    }
]);