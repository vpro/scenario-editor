'use strict';

module.exports = {

    run: function( callback ) {

        var express = require('express');

        var app = express();

        // must specify options hash even if no options provided!
        var phpExpress = require('php-express')({

            // assumes php is in your PATH
            binPath: 'php'
        });

        // set view engine to php-express
        app.engine('php', phpExpress.engine);
        app.set('view engine', 'php');

        // routing all .php file to php-express
        app.get(/.+\.php$/, phpExpress.router);
        app.get('/', phpExpress.router);

        //app.set('base', 'grunt/work');
        app.set('views', 'grunt/work');

        app.use('/', express.static('grunt/work'));
        app.use('/styles/fonts', express.static('app/styles/fonts'));
        app.use('/styles', express.static('grunt/work/styles'));
        app.use('/scripts', express.static('app/scripts'));

        var server = app.listen( 3000, function () {

            callback();

            var host = server.address().address;
            var port = server.address().port;
            console.log('PHPExpress app listening at http://%s:%s', host, port);
        });

    }

};