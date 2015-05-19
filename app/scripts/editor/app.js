
(function( require, vproConfig ) {

	'use strict';

	var domainConfig = vproConfig.configuration;

	define( 'domain-config', domainConfig );

	require.config(
		{
			baseUrl : '/',
			waitSeconds : 15,
			paths : {
				jquery : 'http://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min',
				ext :    domainConfig.jsServer + '/ext',
				vpro :   domainConfig.jsServer + '/' + vproConfig.JavascriptDirectory + '/vpro'
			}
		}
	);

	angular.module('SE', []);

}( window.require, window.vpro ));