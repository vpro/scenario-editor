angular.module( 'SE' ).factory( 'ActorService', [
    '$q',
    '$http',
    function ( $q, $http ) {

        function ActorService() {

            /**
             *
             * TODO: add actors
             *
             * - add preload properties
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
                    title: '',
                    start: 0,
                    duration: 5000,
                    offset: 0,
                    src: ''
                },
                {
                    type: 'video',
                    name: 'Video',
                    title: '',
                    start: 0,
                    duration: 5000,
                    offset: 0,
                    src: '',
                    cover: true,
                    preload:
                    {
                        type: 'video'
                    }
                },
                {
                    type: 'generic',
                    name: 'Image Cover',
                    title: '',
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
                    title: '',
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
                    title: '',
                    start: 0,
                    duration: 5000,
                    image: '',
                    trigger: {
                        event: 'click',
                        active: false,
                        type: 'video',
                        src: '',
                        iframesrc: '',
                        galleryroot: ''
                    },
                    template: {
                        caption: {
                            src: '',
                            title: '',
                            subtitle: ''
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