<?php
session_start();
if (!isset($_SESSION['phplogin']) || $_SESSION['phplogin'] !== true) {
    header('Location: login.php'); //Replace that if login.php is somewhere else
    exit;
}
?>