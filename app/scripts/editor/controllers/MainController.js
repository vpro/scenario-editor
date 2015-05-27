
angular.module('SE').controller('MainController', [
	'$scope',
	'ScenarioService',
    'ActorService',
	'DATA_SERVER',
    'ASSET_ROOT',

	function ($scope, ScenarioService, ActorService, DATA_SERVER, ASSET_ROOT ) {

		'use strict';

		function MainController () {

            $scope.actorTypes = [];
            $scope.playerVisible = true;
            $scope.audioActorsVisible = true;
            $scope.compactView= false;
		}

		MainController.prototype = {

            init: function () {

				ScenarioService.getScenariosForProject().then(function ( data ) {

					$scope.scenarios = data;
				});

                $scope.actorTypes = ActorService.getActors();

				this.bindScopeHandlers();
			},

			bindScopeHandlers: function(){
				$scope.$on( 'player-animations', function( e, animations ){

                    $scope.animationNames = animations.map(function( animation ){
                        return animation.name;
                    });

                    $scope.$apply();

                }.bind( this ));
			},

			activateScenario : function ( scenario ) {

				if ( scenario !== '' ) {

					ScenarioService.getScenarioForProject( scenario ).then(function ( data ) {

						$scope.activeScenario = scenario;

						$scope.assetRoot = ASSET_ROOT;

					    $scope.script = data;

						$scope.actors = data.actors;

						this.sortActors();

						this.previewScenario();

					}.bind(this));
				}
			},

            openAssetSelector: function( caller ){

                this.currentCaller = caller.target;

                $( 'body' ).addClass( 'modal-open' );
                $( '#asset-selector').addClass( 'open' );

                ScenarioService.getAssetsForProject().then(
                    function( data ){

                        var assetData = data.map(function( el, i, arr ){
                            var type = el.substring( 0, el.indexOf( '/' ) );
                            return {
                                path: el.toString(),
                                type: type.toString()
                            };
                        });

                        $scope.availableAssets = assetData;

                    },
                    function( error ){
                        throw new Error( error );
                    }
                );

            },

            closeAssetSelector: function(){
                $( 'body' ).removeClass( 'modal-open' );
                $( '#asset-selector' ).removeClass( 'open' );
            },

            selectAsset: function( assetPath ){

                this.closeAssetSelector();

                if( assetPath ){
                    this.currentCaller.value = assetPath;
                    angular.element($(this.currentCaller)).triggerHandler('input');
                }

            },

            addActor: function( actor ){

                $scope.script.actors.push( angular.copy( actor ) );

                $( 'html, body' ).animate({
                    scrollTop: $(document).height()
                }, 500);

            },

            deleteActor: function( index ){

                var actor = $scope.actors[ index ];

                if( actor ){

                    if( window.confirm( 'Delete ' + actor.title + '?' ) ){
                        $scope.actors.splice( index, 1 );
                    }

                }
            },

			onDrag: function ( actor, x, y ) {

                if( ( actor.start + actor.duration ) >= $scope.script.duration ) {
                    actor.start = Math.round( x * $scope.script.duration ) - actor.duration;
                } else {
                    actor.start = Math.round( x * $scope.script.duration );
                }

				if ( actor.start < 0 ) {
					actor.start = 0;
				}

				$scope.$apply();
			},

			onDrop: function () {

				$scope.$apply();
			},

			previewScenario : function () {

				$scope.$emit( 'scenario:update', $scope.script );
			},

			saveScenario : function () {

				// TODO
				// Wat hier nog niet goed gaat is dat de timeline name en duration niet worden opgeslagen
				// in $scope.script dus die wijzigingen saven nog niet, de rest wel! :)

				ScenarioService.saveScenarioForProject( $scope.activeScenario, $scope.script ).then(function () {

					alert('The scenario has been saved and will be previewed.');

					this.previewScenario();


				}.bind( this ), function () {
					alert('Sorry, there was an error during saving.');
				});
			},

			sortActors: function () {

				$scope.actors.sort( function ( a, b ) {

					if (a.start < b.start) {
						return -1;
					}
					if (a.start === b.start) {
						return 0;
					}
					if (a.start > b.start) {
						return 1;
					}
				});
            },


            togglePlayerVisible: function(){
			   $scope.playerVisible = $scope.playerVisible === false;
		    },

            toggleAudioActorsVisible: function(){
                $scope.audioActorsVisible = $scope.audioActorsVisible === false;
            },

            toggleCompactView: function(){
                $scope.compactView = $scope.compactView === false;
            }

		};

		return new MainController();
	}
]);
