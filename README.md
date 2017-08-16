# Scenario Editor


# Installation
The scenario editor repository contains the scenario editor app and the server API. 
For now, both will be deployed to http://files.vpro.nl/scenario-editor/

## prerequisites
`npm install` and `npm install grunt -g` should be enough to install all prerequisites. 

## development
In development mode you have to run the dataserver (provides the API and data) in dev
mode, in a standalone terminal, with `grunt dataserver:dev`.

You can now use `grunt dev:watch` for developing and viewing the editor on
[http://localhost:8000](http://localhost:8000). This is also the default
Grunt task.

Note that files.vpro.nl is running PHP 5.3.29.

## build / deployment

### build
If you want to check the editor against the production servers you can run
`grunt test:build` which builds the editor and makes it viewable at 
[http://localhost:8000](http://localhost:8000)

### deployment
If you want to deploy the editor you can deploy the server and/or editor.

The server should be build with `grunt dataserver:build`. The resulting
`/server` contents can now be uploaded to the production server.
 
The editor can be build with `grunt build` and the resulting `/grunt/build`
folder can be uploaded to the production server. Before uploading set the password in app/login.php to the password as described in the VPRO wiki

### note on writing files on our production server
Because PHP isn't allowed to write files on our production server the
scenario editor will read and write the scenario's from/to a specific writeable
location on our production server. The `dataserver:dev` and 
`dataserver:build` task will handle this through setting the `ALLOW_RELATIVE_FILE_WRITES`
constant, which is used in the API to determine which method of file
writing should be chosen.