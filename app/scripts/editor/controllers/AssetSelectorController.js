
angular.module('SE').controller('AssetSelectorController', [
	'$scope',
	'ScenarioService',
    'ActorService',
	'DATA_SERVER',

	function ( $scope, ScenarioService, ActorService, DATA_SERVER ) {

		'use strict';

		function AssetSelectorController () {


		}

		AssetSelectorController.prototype = {


            init: function () {

			},

			getAssets: function(){

                ScenarioService.getAssetsForProject();

            }

		};

		return new AssetSelectorController();
	}
]);
