
(function( require, vproConfig, dataServer ) {

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

    var bookmarksContainer = document.getElementById( 'project-bookmarks' ),
        projectName = getURLParameter( 'project' ),
	    playerSkin = getURLParameter( 'skin' );


    if( !projectName ){
        bookmarksContainer.style.display = 'block';
    } else {
        bookmarksContainer.style.display = 'none';
    }


    angular.module('SE',
        [
            'angular.filter',
            'ngCookies'
        ]
    ).constant('PROJECT_NAME', projectName)
        .constant('PLAYER_SKIN', playerSkin)
        .constant('ASSET_ROOT', dataServer + '/projects/' + projectName + '/project-assets/');


    function getURLParameter ( name, url ) {

		if ( !url ){
			url = location.href;
		}

		name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");

		var regexS = "[\\?&]"+name+"=([^&#]*)",
		    regex = new RegExp( regexS ),
		    results = regex.exec( url );

		return results === null ? null : results[1];
	}

}( window.require, window.vpro, window.dataServer ));