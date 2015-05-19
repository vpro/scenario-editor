<?php

$dirName = dirname(__FILE__) ."/";

include_once( $dirName ."Util.php");

class ScenarioService {

    function getAssetsForProject ( ) {

        return $this->listDirectory( $dirName .'..'. BASEPATH_ASSETS );
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

    private function listDirectory($dir, $prefix = '') {
      $dir = rtrim($dir, '\\/');
      $result = array();

        foreach (scandir($dir) as $f) {
          if ($f !== '.' and $f !== '..') {
            if (is_dir("$dir/$f")) {
              $result = array_merge($result, $this->listDirectory("$dir/$f", "$prefix$f/"));
            } else {
              $result[] = $prefix.$f;
            }
          }
        }

      return $result;
    }
}

?>