
angular.module('SE').controller('MainController', [
	'$scope',
	'SessionService',
	function ($scope, SessionService) {

		'use strict';

		function MainController () {

		}

		MainController.prototype = {

			init: function () {

				SessionService.loadScript().then(function (data) {

					$scope.timeline = {
						name: data.name,
						duration:data.duration
					};

					$scope.actors = data.actors;

					this.sortActors();
				}.bind(this))
			},

			onDrag: function (actor, x, y) {

				actor.start = Math.round(x * $scope.timeline.duration);
				$scope.$apply();
			},

			onDrop: function () {

				this.sortActors();
				$scope.$apply();
			},

			sortActors: function () {

				$scope.actors.sort(function (a,b) {

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
