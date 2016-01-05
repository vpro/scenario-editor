<?php
session_start();
if(isset($_POST['login'])) {
    $password = $_POST['pswd'];
    if ( $password == "" ) { // Add password here
        $_SESSION['phplogin'] = true;
        header('Location: index.php'); //Replace dashboard.php with what page you want to go to after succesful login
        exit;
    } else {
    ?>
    <script type="text/javascript">
    <!--
    alert('Incorrect Password');
    //-->
    </script>
    <?php
    }
}
?>

<html>
<head>
</head>

<body>
<form method="post" action="">
<b>Password: </b><input type="password" name="pswd" size="20"><input type="submit" name="login" value="Submit"></form>
</body>
</html>