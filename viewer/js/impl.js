var domainConfig = window.vpro.configuration;
var vproConfig = window.vpro;

var DATA_SERVER = 'https://files.vpro.nl/scenario-editor';

require(
    {
        baseUrl : '/',
        waitSeconds : 15,
        paths : {
            jquery : 'http://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min',
            ext :    domainConfig.jsServer + '/ext',
            vpro :   domainConfig.jsServer + '/' + vproConfig.JavascriptDirectory + '/vpro'
        }
    },
    [
        'vpro/gui/scenarioPlayer/js/App',
        'jquery'
    ],

    function( ScenarioPlayerApp, $ ){

        var projectName = getURLParameter( 'project' );
        var scenario = getURLParameter( 'scenario' );

        var $nav = $( '#nav' );

        var url = DATA_SERVER + '/api/get.php?project=' + projectName + '&resource=scenarios';

        $.ajax({
            url: url,
            success: function( scenarios ){

                var len = scenarios.length;
                for ( var i = 0; i < len; i++) {

                    var url = document.location.origin + document.location.pathname + '?project=' + projectName + '&scenario=' + scenarios[i]

                    $nav.append( '<li><a href="' + url + '">' + scenarios[i] + '</a></li>' );

                }

            }
        });

        if( scenario ){

            var player = new ScenarioPlayerApp( {
                rootNode: '.scenario-player',
                assetRoot: 'http://files.vpro.nl/scenario-editor/projects/' + projectName + '/project-assets/',
                skin: projectName,
                autoPlay: true
            } );

            var path = DATA_SERVER + '/api/get.php?id=' + scenario + '&project=' + projectName + '&resource=scenarios';

            player.on( 'ready', function(){
                player.setScript( path );
            });

        }

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

    }
);
