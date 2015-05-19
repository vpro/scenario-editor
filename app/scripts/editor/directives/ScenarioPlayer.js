angular.module('SE').directive('sePlayer',

	function ($document) {

		'use strict';

		return {
            restrict: 'E',
			controller: ['$scope', '$window', function ($scope, $window) {

				function ScenarioPlayer () {

				}

                ScenarioPlayer.prototype = {

                    bindPlayerEvents : function () {
                        this.player.on( 'ready', function(){
                            this.player.setScript(
                                {
                                    "name":"Srebrenica pilot",
                                    "duration":480000,
                                    "actors":[

                                        {
                                            "name": "Main audio track",
                                            "type": "audio",
                                            "start": 0,
                                            "duration": 480000,
                                            "offset":2427000,
                                            "src": "audio/chapter_01/voice_01.mp3",
                                            "preload": {
                                                "type": "audio"
                                            }
                                        }
                                    ]
                                }
                            );
                        }.bind( this ));
                    },

                    createPlayer: function ( ScenarioPlayerApp ) {

                        this.player = new ScenarioPlayerApp({
                            rootNode: 'se-player',
                            assetRoot: 'http://files.vpro.nl/frontend/srebrenica/assets/'
                        });

                        this.bindPlayerEvents();
                    },

					init: function ( element ) {

                        $window.require( ['vpro/gui/scenarioPlayer/js/App'], this.createPlayer.bind(this) );
					}
				};

				return new ScenarioPlayer();
			}],

			link: function (scope, element, attrs, controllers) {

                controllers.init( element );
			}
		};
	}
);