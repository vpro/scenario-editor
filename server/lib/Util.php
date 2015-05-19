<?php
/**
 * Static utility class
 */

class Util{

    static function basePathHost() {
        $protocol = "http";

        if ( !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off'
    || $_SERVER['SERVER_PORT'] == 443 ) {
            $protocol = "https";
        }

        return $protocol ."://". $_SERVER["HTTP_HOST"];
    }

    static function basePath() {
        return Util::basePathHost() . BASEPATH;
    }

    /* the project specific absolute api location */
    static function basePathApi() {
        return Util::basePathHost() . BASEPATH_API;
    }


    /* the project specific absolute assets folder */
    static function basePathAssets() {
        return Util::basePathHost() . BASEPATH_ASSETS;
    }

    /* the project specific absolute scenarios folder */
    static function basePathScenarios() {
        return Util::basePathHost() . BASEPATH_SCENARIOS;
    }


    static function getRequestVar($strQName, $strVType="string", $objDefault=NULL){

		if(isset($_REQUEST[$strQName])){
			switch($strVType){
				case "integer":
					if(is_numeric($_REQUEST[$strQName])){
						return intval($_REQUEST[$strQName]);
					}
					break;

                case "url":
                    return filter_var( $_REQUEST[$strQName], FILTER_SANITIZE_URL);
                    break;

				case "string":
				    return filter_var( $_REQUEST[$strQName], FILTER_SANITIZE_STRING);
				    break;

                case "raw":
                    return $_REQUEST[$strQName];
                    break;

			}
		}
		return $objDefault;
	}

	static function getPostVar($strQName, $strVType = "string", $objDefault = NULL){

		if(isset($_POST[$strQName])){
			switch($strVType){
				case "integer":
					if(is_numeric($_POST[$strQName])){
						return intval($_POST[$strQName]);
					}
					break;

				case "string":
				    return filter_var( $_POST[$strQName], FILTER_SANITIZE_STRING);
				    break;

                case "url":
                    return filter_var( $_POST[$strQName], FILTER_SANITIZE_URL);
                    break;

                case "raw":
                    return $_POST[$strQName];
                    break;
			}
		}
		return $objDefault;
	}

    static function includeProjectConfig ( $projectId ) {

        $dirName = dirname(__FILE__);
        $cfgFile = $dirName ."/../projects/". $projectId ."/config.php";

        if ( file_exists( $cfgFile ) ) {
            include_once( $cfgFile );
            return true;
        }
        return false;
    }

    static function outputNotFound ( $callback=null ) {

        header("HTTP/1.0 404 Not Found");

        $msg = array(
                       "statusCode" => 404,
                       "statusMessage" => "Not Found",
                       "developerMessage" => "The requested resource was not found."
                   );

        if ( isset( $callback ) ) {

            Util::outputJsonP( $msg, $callback );

        } else {
            Util::outputJson( $msg );
        }
    }

    static function outputBadRequest ( $callback=null ) {

        header("HTTP/1.0 400 Bad Request");

        $msg = array(
            "statusCode" => 400,
            "statusMessage" => "Bad Request",
            "developerMessage" => "The request was not formulated correctly."
        );

        if ( isset( $callback ) ) {

            Util::outputJsonP( $msg, $callback );

        } else {
            Util::outputJson( $msg );
        }
    }

    static function outputServerError ( $callback=null ) {

        header("HTTP/1.0 500 Server Error");

        $msg = array(
            "statusCode" => 500,
            "statusMessage" => "Server Error",
            "developerMessage" => "Something went wrong handling the request."
        );

        if ( isset( $callback ) ) {

            Util::outputJsonP( $msg, $callback );

        } else {
            Util::outputJson( $msg );
        }
    }

    static function outputJsonP ( $object, $callback ) {
        echo $callback .'(';
        echo json_encode( $object );
        echo ');';
    }

    static function outputJson( $object ) {
        echo json_encode( $object );
    }

    static function wrapOutput( $object, $callback=null ) {

        if ( isset( $callback ) ) {

            Util::outputJsonP( $object, $callback );

        } else {
            Util::outputJson( $object );
        }
    }
}

?>