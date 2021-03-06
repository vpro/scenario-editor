angular.module( 'SE' ).directive( 'sePlayer',

    function ( $document ) {

        'use strict';

        return {
            restrict: 'E',
            controller: ['$scope', '$window', 'ASSET_ROOT', 'PLAYER_SKIN', function ( $scope, $window, ASSET_ROOT, PLAYER_SKIN ) {

                function ScenarioPlayer () {

                    this.playerSkin = PLAYER_SKIN || '';
                    this.playerReady = false;
                    this.bindScopeEvents();
                }

                ScenarioPlayer.prototype = {

                    bindScopeEvents: function () {

                        $scope.$on( 'scenario:update', function ( e, newScript ) {

                            if ( newScript ) {

                                this.scriptData = newScript; // will make a reference

                                if ( this.playerReady ) {
                                    this.player.setScript( this.getSafeScriptForPlayer() );
                                }
                            }

                        }.bind( this ));

                    },

                    bindPlayerEvents: function () {
                        this.player.on( 'ready', function () {

                            this.playerReady = true;

                            if ( this.scriptData ) {
                                this.player.setScript( this.getSafeScriptForPlayer() );
                            }

                            var animations = this.player.getAnimations();

                            $scope.$emit( 'player-animations', animations );

                        }.bind(this) );
                    },

                    createPlayer: function ( ScenarioPlayerApp ) {

                        this.player = new ScenarioPlayerApp( {
                            rootNode: 'se-player.scenario-player',
                            assetRoot: ASSET_ROOT,
                            skin: this.playerSkin
                        } );


                        this.bindPlayerEvents();
                    },

                        // return a 'copy' of the script so the Scenario Player can't
                        // mess with it's referenced contents
                    getSafeScriptForPlayer : function () {

                        var scriptAsString = JSON.stringify( this.scriptData );

                        return JSON.parse( scriptAsString );
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