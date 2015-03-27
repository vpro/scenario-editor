
angular.module('SE').controller('MainController', [
	'$scope',
	'SessionService',
	function ($scope, SessionService) {

		'use strict';

		function MainController () {

		}

		MainController.prototype = {

			init: function () {

				console.log('Main controller init', $scope, SessionService);

				$scope.message = 'Hallo Wereld!'
			}
		};

		return new MainController();
	}
]);
