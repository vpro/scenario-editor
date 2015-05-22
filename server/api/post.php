<?php

include_once( dirname(__FILE__) ."/../lib/Util.php" );

$projectId = Util::getRequestVar("project");
$resource = Util::getRequestVar("resource");
$resourceId = Util::getRequestVar("id");
$subresource = Util::getRequestVar("subresource");

$callback = Util::getRequestVar("callback", "string");

// respond to preflights
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
  // return only the headers and not the content
  // only allow CORS if we're doing a GET - i.e. no saving for now.
  if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']) && $_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'] == 'POST') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
  }
  exit;
}

header('Access-Control-Allow-Origin: *');

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

            $scenarioData = Util::getPostVar("scenario", "raw");

            if ( isset( $scenarioData ) ) {

                $scenarioData = json_decode( urldecode( $scenarioData ) );

                if ( $scenarioService->saveScenarioForProject( $resourceId, json_encode( $scenarioData, JSON_PRETTY_PRINT ) ) ) {

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