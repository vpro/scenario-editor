
angular.module('SE').controller('MainController', [
    '$document',
	'$scope',
	'ScenarioService',
    'ActorService',
    '$cookieStore',
	'DATA_SERVER',
    'ASSET_ROOT',

	function ( $document, $scope, ScenarioService, ActorService, $cookieStore, DATA_SERVER, ASSET_ROOT ) {

		'use strict';

		function MainController () {

            $scope.actorTypes = [];
            $scope.playerVisible = $cookieStore.get( 'playerVisible' ) || true;
            $scope.audioActorsVisible = $cookieStore.get( 'audioActorsVisible' ) || true;
            $scope.compactView = $cookieStore.get( 'compactView' ) || false;
            $scope.playerFullScreen = $cookieStore.get( 'playerFullScreen' ) || false;
		}

		MainController.prototype = {

            init: function () {

				ScenarioService.getScenariosForProject().then(function ( data ) {

					$scope.scenarios = data;
				});

                $scope.actorTypes = ActorService.getActors();

                this.bindHandlers();
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

            bindHandlers: function(){

                $document.bind( 'keypress', function( e ) {

                    var tag = e.target.tagName.toLowerCase();

                    if( tag !== 'input' && tag !== 'textarea' && e.which === 102 ){
                        this.togglePlayerFullScreen();
                    }

                }.bind( this ));

            },

			activateScenario : function ( scenario ) {

				if ( scenario !== '' ) {

					ScenarioService.getScenarioForProject( scenario ).then(function ( data ) {

						$scope.activeScenario = scenario;

						$scope.assetRoot = ASSET_ROOT;

					    $scope.script = data;

						$scope.actors = data.actors;

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

                this.updateZindices();

            },

            deleteActor: function( index ){

                var actor = $scope.actors[ index ];

                if( actor ){

                    if( window.confirm( 'Delete ' + actor.title + '?' ) ){
                        $scope.actors.splice( index, 1 );
                    }

                }

                this.updateZindices();

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

            moveActor: function( old_index, new_index ){

                if ( new_index >= $scope.actors.length ) {
                    var k = new_index - $scope.actors.length;

                    while ( ( k-- ) + 1 ) {
                        $scope.actors.push( undefined );
                    }
                }
                $scope.actors.splice( new_index, 0, $scope.actors.splice( old_index, 1 )[0]);

                this.updateZindices();

            },

            updateZindices: function(){

                var len = $scope.actors.length;

                $scope.actors.forEach( function( actor, i ){
                    actor.zindex = len - i;
                });
            },

            togglePlayerVisible: function(){
                $scope.playerVisible = $scope.playerVisible === false;
                $cookieStore.put( 'playerVisible', $scope.playerVisible );
		    },

            toggleAudioActorsVisible: function(){
                $scope.audioActorsVisible = $scope.audioActorsVisible === false;
                $cookieStore.put( 'audioActorsVisible', $scope.audioActorsVisible );
            },

            toggleCompactView: function(){
                $scope.compactView = $scope.compactView === false;
                $cookieStore.put( 'compactView', $scope.compactView );
            },

            togglePlayerFullScreen: function(){
                $scope.playerFullScreen = $scope.playerFullScreen === false;
                $cookieStore.put( 'playerFullScreen', $scope.playerFullScreen );

                $scope.$apply();
            }

		};

		return new MainController();
	}
]);
