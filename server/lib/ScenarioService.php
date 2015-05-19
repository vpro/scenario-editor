<?php

$dirName = dirname(__FILE__) ."/";

include_once( $dirName ."Util.php");

class ScenarioService {

    /*
        GET /api/projects/project-id/scenarios/scenario-id/
        chapter inhoud (is het json inleesscript)

        POST /api/projects/project-id/scenarios/scenario-id/


        GET /api/projects/project-id/assets/
        lijst van assets

            ?? Platgeslagen met pad?

            ?? Geordend op type?

            ?? Geordend op directory structuur

            ?? Filtering

    */

    function getAssetsForProject ( ) {

        return array();
    }

    function getScenariosForProject ( ) {

        $scenarios = array();


        foreach( scandir( $dirName .'..'. BASEPATH_SCENARIOS ) as $idx => $scenario ) {

            if ( $scenario !== '.' && $scenario !== '..') {

                $scenario = explode( '.', $scenario );
                array_pop( $scenario ); // remove (.)json

                $scenario = implode( '.', $scenario );

                $scenarios[] = $scenario;
            }
        }

        return $scenarios;
    }

    function getScenarioForProject ( $scenarioId ) {

        $scenarioContents = file_get_contents( $dirName .'..'. BASEPATH_SCENARIOS . $scenarioId .'.json' );

        if ( $scenarioContents ) {

            return json_decode( $scenarioContents );
        }
    }

}

?>