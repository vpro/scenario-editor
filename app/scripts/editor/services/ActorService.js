angular.module( 'SE' ).factory( 'ActorService', [
    '$q',
    '$http',
    function ( $q, $http ) {

        function ActorService() {

            /**
             *
             * TODO: add actors
             *
             * - basic caption
             * - caption with trigger -> video
             * - caption with trigger -> audio
             * - caption with trigger -> image gallery?
             *
             */

            this.actors = [
                {
                    name: 'Audio',
                    type: 'audio',
                    start: 0,
                    duration: 5000,
                    offset: 0,
                    src: ''
                },
                {
                    type: 'generic',
                    name: 'Image Cover',
                    start: 0,
                    duration: 5000,
                    template: {
                        background: {
                            src: '',
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
                            src: '',
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
                    },
                    template: {
                        caption: {
                            trigger: {
                                title: ''
                            }
                        }
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