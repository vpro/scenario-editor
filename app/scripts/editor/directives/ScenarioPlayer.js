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

                    bindScopeEvents: function () {

                        $scope.$watch('script', function ( newScript, oldScript ) {

                            if ( newScript &&
                                JSON.stringify( this.scriptData || {} ) !== JSON.stringify( newScript ) ) {

                                this.scriptData = newScript;

                                if ( this.playerReady ) {
                                    this.player.setScript( this.scriptData );
                                }
                            }
                        }.bind( this ));

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