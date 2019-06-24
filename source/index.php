<?
    require_once 'lib/SocialAuther/autoload.php';
    require_once 'config.php';
?>

<!DOCTYPE html>
<html lang="ru">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <title>DB Logic Assistant</title>
        <link rel="stylesheet" href="lib/bootstrap/bootstrap.css">
    <?if(isset($_GET['edit']) and is_array($_SESSION['user'])){?>
        <link rel="stylesheet" href="lib/highlight/styles/default.css">
        <script src="lib/highlight/highlight.pack.js"></script>
        <script src="lib/ace-builds/src-min-noconflict/ace.js" type="text/javascript" charset="utf-8"></script>
        <link rel="stylesheet" href="editor/editor.css">
    <?}elseif (!isset($_GET['edit'])){?>
        <link rel="stylesheet" href="css/main.css">
    <?}?>
    <?if (is_array($_SESSION['user'])){?>
        <link rel="stylesheet" href="css/dashboard.css">
    <?}?>
        <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.0.0/jquery.min.js" integrity="sha384-THPy051/pYDQGanwU6poAc/hOdQxjnOEXzbT+OuUAFqNqFjL+4IGLBgCJC3ZOShY" crossorigin="anonymous"></script>
        <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
        <script src="lib/jquery.ui.touch-punch.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/tether/1.2.0/js/tether.min.js" integrity="sha384-Plbmg8JY28KFelvJVai01l8WyZzrYWG825m+cZ0eDDS1f7d/js6ikvy1+X+guPIB" crossorigin="anonymous"></script>
        <script src="lib/bootstrap/bootstrap.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.min.js"></script>
        <script src="lib/html2canvas.js"></script>
    </head>
<body>


<?php


    $adapters = array();
    foreach ($adapterConfigs as $adapter => $settings) {
        $class = 'SocialAuther\Adapter\\' . ucfirst($adapter);
        $adapters[$adapter] = new $class($settings);
    }


    if(isset($_GET['registration'])) {
        include_once('registration.php');
    }elseif(!isset($_SESSION['user'])){
        include_once('login.php');
    }elseif(isset($_GET['edit'])){
        include_once('editor/editor.php');
    }elseif(isset($_GET['diagram_list'])){
        include_once('diagram_list.php');
    }else{
        include_once('diagram_list.php');
    }
?>



<script src="js/main.js"></script>

</body>
</html>
