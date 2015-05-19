angular.module( 'SE' ).directive( 'sePlayer',

    function ( $document ) {

        'use strict';

        return {
            restrict: 'E',
            controller: ['$scope', '$window', function ( $scope, $window ) {

                function ScenarioPlayer () {

                    this.playerReady = false;
                    this.bindScopeEvents();
                }

                ScenarioPlayer.prototype = {

                    bindPlayerEvents : function () {
                        this.player.on( 'ready', function(){
                            console.log('player ready!');
                        });
                    },

                    bindPlayerEvents: function () {
                        this.player.on( 'ready', function () {

                            this.playerReady = true;

                            if ( this.scriptData ) {
                                this.player.setScript( this.scriptData );
                            }

                        }.bind(this) );
                    },

                    createPlayer: function ( ScenarioPlayerApp ) {

                        this.player = new ScenarioPlayerApp( {
                            rootNode: 'se-player',
                            assetRoot: 'http://files.vpro.nl/frontend/srebrenica/assets/'
                        } );

                        this.bindPlayerEvents();
                    },

                    init: function ( element ) {

                        $window.require( ['vpro/gui/scenarioPlayer/js/App'], this.createPlayer.bind( this ) );
                    }
                };

                return new ScenarioPlayer();
            }],

            link: function ( scope, element, attrs, controllers ) {

                controllers.init( element );
            }
        };
    }
);