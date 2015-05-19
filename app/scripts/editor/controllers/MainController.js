
angular.module('SE').controller('MainController', [
	'$scope',
	'SessionService',
    'ActorService',
	function ($scope, SessionService, ActorService) {

		'use strict';

		function MainController () {

            $scope.actorTypes = [];

            $scope.playerVisible = true;


		}

		MainController.prototype = {


            init: function () {

				SessionService.loadScript().then(function ( data ) {

					$scope.assetRoot = 'http://files.vpro.nl/frontend/srebrenica/assets/';

                    $scope.script = data;

					$scope.timeline = {
						name: data.name,
						duration: data.duration
					};

					$scope.actors = data.actors;

					this.sortActors();
				}.bind(this));

                $scope.actorTypes = ActorService.getActors();

			},

            togglePlayerVisible: function(){

                $scope.playerVisible = $scope.playerVisible === false;

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
            }

		};

		return new MainController();
	}
]);
