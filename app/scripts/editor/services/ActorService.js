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
                    template: {
                        background: {
                            image: '',
                            sizing: 'cover'
                        }
                    }
                },
                {
                    type: 'generic',
                    name: 'Image Contain',
                    start: 0,
                    duration: 5000,
                    template: {
                        background: {
                            image: '',
                            sizing: 'contain'
                        }
                    }
                },
                {
                    type: 'caption',
                    name: 'Caption',
                    start: 0,
                    duration: 5000,
                    image: '',
                    title: '',
                    subtitle: '',
                    trigger: {
                        event: 'click',
                        active: true,
                        type: 'video',
                        src: ''
                    }
                }
            ];

        }

        ActorService.prototype = {

            getActor: function( type ){
                return this.actors[type];
            },

            getActors: function(){
                return this.actors;
            }

        };

        return new ActorService();
    }
]);