
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
				})
			}
		};

		return new MainController();
	}
]);
