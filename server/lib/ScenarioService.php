<?php

$dirName = dirname(__FILE__) ."/";

include_once( $dirName ."Util.php");

class ScenarioService {

    function getAssetsForProject () {

        return $this->listDirectory( $dirName .'..'. BASEPATH_ASSETS );
    }

    function getScenariosForProject () {

        $scenarios = array();

        foreach( scandir( $this->getScenariosRootPath() ) as $idx => $scenario ) {

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

        $scenarioContents = file_get_contents( $this->getScenariosRootPath() . $scenarioId .'.json' );

        if ( $scenarioContents ) {

            return json_decode( $scenarioContents );
        }
    }

    function getScenariosRootPath () {

        if ( ALLOW_RELATIVE_FILE_WRITES ) {

            return $dirName .'..'. BASEPATH_SCENARIOS;
        } else {
            return BASEPATH_SCENARIOS_ABS;
        }
    }

    private function listDirectory($dir, $prefix = '') {
      $dir = rtrim($dir, '\\/');
      $result = array();

        foreach (scandir($dir) as $f) {
          if ( substr_compare( $f, ".", 0, 1 ) !== 0 ) {
            if (is_dir("$dir/$f")) {
              $result = array_merge($result, $this->listDirectory("$dir/$f", "$prefix$f/"));
            } else {
              $result[] = $prefix.$f;
            }
          }
        }

      return $result;
    }

    function saveScenarioForProject ( $scenarioId, $scenarioData ) {

        $file = $this->getScenariosRootPath() . $scenarioId .'.json';

        if ( is_writable( $file ) ) {

            if ( ! $handle = fopen( $file, 'w' )) {
                 return false;
            }

            if ( fwrite( $handle, $scenarioData) === FALSE) {
                return false;
            }

            fclose($handle);

            return true;
        }

        return false;
    }
}

?>