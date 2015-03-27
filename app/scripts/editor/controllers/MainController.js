
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
					$scope.actors = data.actors;
				})
			}
		};

		return new MainController();
	}
]);
