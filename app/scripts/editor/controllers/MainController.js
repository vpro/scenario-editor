
angular.module('SE').controller('MainController', [
    '$document',
    '$scope',
    'ScenarioService',
    'ActorService',
    '$cookieStore',
    'DATA_SERVER',
    'ASSET_ROOT',
    'PROJECT_NAME',

    function ( $document, $scope, ScenarioService, ActorService, $cookieStore, DATA_SERVER, ASSET_ROOT, PROJECT_NAME ) {

        'use strict';

        function MainController () {

            $scope.actorTypes = [];
            $scope.playerVisible = $cookieStore.get( 'playerVisible' ) || true;
            $scope.audioActorsVisible = $cookieStore.get( 'audioActorsVisible' ) || true;
            $scope.compactView = $cookieStore.get( 'compactView' ) || false;
            $scope.playerFullScreen = $cookieStore.get( 'playerFullScreen' ) || false;
        }

        MainController.prototype = {

            init: function () {

                this.projectName = PROJECT_NAME;

                ScenarioService.getScenariosForProject( this.projectName ).then(function ( data ) {
                    $scope.scenarios = data;
                });

                $scope.actorTypes = ActorService.getActors();

                this.bindHandlers();
                this.bindScopeHandlers();
            },

            activateScenario : function ( scenario ) {

                if ( scenario !== '' ) {

                    ScenarioService.getScenarioForProject( scenario, this.projectName ).then(function ( data ) {

                        $scope.activeScenario = scenario;

                        $scope.assetRoot = ASSET_ROOT;

                        $scope.script = data;

                        $scope.actors = data.actors;

                        this.previewScenario();

                    }.bind(this));
                }
            },

            addActor: function( actor ){

                $scope.script.actors.push( angular.copy( actor ) );

                $( 'html, body' ).animate({
                    scrollTop: $(document).height()
                }, 500);

                this.updateZindices();

            },

            bindHandlers: function(){

                $document.bind( 'keypress', function( e ) {

                    var tag = e.target.tagName.toLowerCase();

                    if( tag !== 'input' && tag !== 'textarea' && e.which === 102 ){
                        this.togglePlayerFullScreen();
                    }

                }.bind( this ));

            },

            bindScopeHandlers: function(){
                $scope.$on( 'player-animations', function( e, animations ){

                    $scope.animationNames = animations.map(function( animation ){
                        return animation.name;
                    });

                    $scope.$apply();

                }.bind( this ));
            },

            closeAssetSelector: function(){
                $( 'body' ).removeClass( 'modal-open' );
                $( '#asset-selector' ).removeClass( 'open' );
            },

            deleteActor: function( index ){

                var actor = $scope.actors[ index ];

                if( actor ){

                    if( window.confirm( 'Delete ' + actor.title + '?' ) ){
                        $scope.actors.splice( index, 1 );
                    }

                }

                this.updateZindices();

            },

            getGalleryAssets: function( galleryName ){

                return $scope.availableAssets.filter( function( el ){
                    return  el.path.indexOf( 'gallery/' + galleryName + '/' ) === 0;
                }).map( function( el ){
                    return el.path;
                });

            },

            moveActor: function( old_index, new_index ){

                if ( new_index >= $scope.actors.length ) {
                    var k = new_index - $scope.actors.length;

                    while ( ( k-- ) + 1 ) {
                        $scope.actors.push( undefined );
                    }
                }
                $scope.actors.splice( new_index, 0, $scope.actors.splice( old_index, 1 )[0]);

                this.updateZindices();

            },

            onDrag: function ( actor, x, y ) {

                if( ( actor.start + actor.duration ) >= $scope.script.duration ) {
                    actor.start = Math.round( x * $scope.script.duration ) - actor.duration;
                } else {
                    actor.start = Math.round( x * $scope.script.duration );
                }

                if ( actor.start < 0 ) {
                    actor.start = 0;
                }

                $scope.$apply();
            },

            onDrop: function () {

                $scope.$apply();
            },

            openAssetSelector: function( caller, actor ){

                this.currentCaller = caller.target;
                this.currentActor = actor;

                $( 'body' ).addClass( 'modal-open' );
                $( '#asset-selector').addClass( 'open' );

                ScenarioService.getAssetsForProject( this.projectName ).then(
                    function( data ){

                        var assetData = data.map(function( el, i, arr ){
                            var type = el.substring( 0, el.indexOf( '/' ) );
                            return {
                                path: el.toString(),
                                type: type.toString()
                            };
                        });

                        var galleries = {};

                        var filteredAssets = assetData.map( function( el, i, arr ){

                            if( el.path.indexOf( 'gallery/' ) === 0 ){

                                var galleryName = /gallery\/([^\/]+)\//.exec( el.path );

                                if( galleryName && galleryName.length > 1 ){

                                    if( typeof galleries[ galleryName[1] ] === 'undefined' ){
                                        galleries[ galleryName[1] ] = true;

                                        return {
                                            path: galleryName[1],
                                            type: 'gallery'
                                        };

                                    }
                                }

                            } else {
                                return el;
                            }

                        }).filter( function ( el ) { return el; } );

                        $scope.filteredAssets = filteredAssets;

                        $scope.availableAssets = assetData;

                    },
                    function( error ){
                        throw new Error( error );
                    }
                );

            },

            previewScenario : function () {

                $scope.$emit( 'scenario:update', $scope.script );
            },

            saveScenario : function () {

                ScenarioService.saveScenarioForProject( $scope.activeScenario, $scope.script, this.projectName ).then(function () {

                    alert('The scenario has been saved and will be previewed.');

                    this.previewScenario();


                }.bind( this ), function () {
                    alert('Sorry, there was an error during saving.');
                });
            },

            selectAsset: function( assetPath, assetType ){

                this.closeAssetSelector();

                if( assetPath ){

                    if( assetType === 'gallery' ){
                        this.currentActor.trigger.galleryImages = this.getGalleryAssets( assetPath );
                    } else if( this.currentActor.hasOwnProperty( 'trigger' ) && this.currentActor.trigger.galleryImages !== 'undefined') {
                        this.currentActor.trigger.galleryImages = [];
                        this.currentActor.trigger.galleryroot = '';
                    }

                    this.currentCaller.value = assetPath;
                    angular.element($(this.currentCaller)).triggerHandler( 'input' );

                }

            },

            togglePlayerVisible: function(){
                $scope.playerVisible = $scope.playerVisible === false;
                $cookieStore.put( 'playerVisible', $scope.playerVisible );
            },

            toggleAudioActorsVisible: function(){
                $scope.audioActorsVisible = $scope.audioActorsVisible === false;
                $cookieStore.put( 'audioActorsVisible', $scope.audioActorsVisible );
            },

            toggleCompactView: function(){
                $scope.compactView = $scope.compactView === false;
                $cookieStore.put( 'compactView', $scope.compactView );
            },

            togglePlayerFullScreen: function(){
                $scope.playerFullScreen = $scope.playerFullScreen === false;
                $cookieStore.put( 'playerFullScreen', $scope.playerFullScreen );

                $scope.$apply();
            },

            updateZindices: function(){

                var len = $scope.actors.length;

                $scope.actors.forEach( function( actor, i ){
                    actor.zindex = len - i;
                });
            }

        };

        return new MainController();
    }
]);
