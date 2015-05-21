angular.module( 'SE' ).directive( 'sePlayer',

    function ( $document ) {

        'use strict';

        return {
            restrict: 'E',
            controller: ['$scope', '$window', 'DATA_SERVER', 'ASSET_ROOT', function ( $scope, $window, DATA_SERVER, ASSET_ROOT ) {

                function ScenarioPlayer () {

                    this.playerReady = false;
                    this.bindScopeEvents();
                }

                ScenarioPlayer.prototype = {

                    bindScopeEvents: function () {

                        $scope.$on( 'scenario:update', function ( e, newScript ) {

                            if ( newScript && ! this.scriptData ) {

                                this.scriptData = newScript; // will make a reference

                                if ( this.playerReady ) {
                                    this.player.setScript( this.scriptData );
                                }
                            } else if ( this.scriptData && this.playerReady ) {

                                this.player.timer.stop();
                                this.player.setScript( this.scriptData );
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
                            assetRoot: ASSET_ROOT
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