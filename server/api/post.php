<?php

/**
 * For now this is called with JSONP so no real POST method
 */


include_once( dirname(__FILE__) ."/../lib/Util.php" );

$projectId = Util::getRequestVar("project");
$resource = Util::getRequestVar("resource");
$resourceId = Util::getRequestVar("id");
$subresource = Util::getRequestVar("subresource");

$callback = Util::getRequestVar("callback", "string");

if ( isset( $callback ) ) {
    header("Content-Type: application/javascript"); // cause we're JSONPing
} else {
    header("Content-Type: application/json");
}

// Get the project specific configuration ( of paths for instance ) or quit

if ( ! ( isset( $projectId ) && Util::includeProjectConfig( $projectId ) ) ) {
    Util::outputNotFound();
    die();
}

include_once( dirname(__FILE__) ."/../lib/ScenarioService.php" );

$scenarioService = new ScenarioService();

switch ( $resource ) {

    case "scenarios":

        if ( isset( $resourceId ) ) {

            // Save the contents of the scenario file

            $scenarioData = Util::getRequestVar("scenario", "raw");

            if ( isset( $scenarioData ) ) {

                if ( $scenarioService->saveScenarioForProject( $resourceId, urldecode( $scenarioData ) ) ) {

                    Util::wrapOutput(array("saved"=>"success"), $callback);

                } else {
                    Util::outputServerError();
                }
            } else {
                Util::outputBadRequest();
            }

        } else {
            Util::outputNotFound( $callback );
        }
        break;

    default:
        Util::outputNotFound( $callback );
        break;
}
?>