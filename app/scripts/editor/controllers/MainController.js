
angular.module('SE').controller('MainController', [
	'$scope',
	'SessionService',
    'ActorService',
	'DATA_SERVER',

	function ($scope, SessionService, ActorService, DATA_SERVER ) {

		'use strict';

		function MainController () {

            $scope.actorTypes = [];

            $scope.playerVisible = true;
		}

		MainController.prototype = {


            init: function () {

				SessionService.getScenariosForProject().then(function ( data ) {

					$scope.scenarios = data;

				});

                $scope.actorTypes = ActorService.getActors();
			},

			activateScenario : function ( scenario ) {

				if ( scenario !== '' ) {

					SessionService.getScenarioForProject( scenario ).then(function ( data ) {

						$scope.activeScenario = scenario;

						$scope.assetRoot = 'http://files.vpro.nl/frontend/srebrenica/assets/';

					    $scope.script = data;

						$scope.timeline = {
							name: data.name,
							duration: data.duration
						};

						$scope.actors = data.actors;

						this.sortActors();

					}.bind(this));
				}
			},


            addActor: function( actor ){
                $scope.script.actors.push( angular.copy( actor ) );
            },

			onDrag: function ( actor, x, y ) {

                if( ( actor.start + actor.duration ) >= $scope.timeline.duration ) {
                    actor.start = Math.round( x * $scope.timeline.duration ) - actor.duration;
                } else {
                    actor.start = Math.round( x * $scope.timeline.duration );
                }

				$scope.$apply();
			},

			onDrop: function () {

				$scope.$apply();
			},

			saveScenario : function () {

				SessionService.saveScenarioForProject( $scope.activeScenario, $scope.script ).then(function () {
					alert('jeejj it worked.');
				}, function () {
					alert('sorry, save didn\'t happen');
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

		   }
		};

		return new MainController();
	}
]);
