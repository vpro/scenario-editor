<?php

$dirName = dirname(__FILE__) ."/";

include_once( $dirName ."Util.php");

class ScenarioService {

    /*
        /api/projects/project-id/scenarios
        lijst van chapters (namen)


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


    }

}

?>