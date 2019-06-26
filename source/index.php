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
    <script src="lib/http_cdnjs.cloudflare.com_ajax_libs_popper.js_1.12.9_umd_popper.js"></script>

    <script src="lib/jQuery-3.3.1/jquery-3.3.1.min.js"></script>

    <? if (isset($_GET['edit']) and is_array($_SESSION['user'])) { ?>

        <script src="lib/ace-builds/src-min-noconflict/ace.js" type="text/javascript" charset="utf-8"></script>
        <link rel="stylesheet" type="text/css" href="lib/datatables/DataTables-1.10.18/css/dataTables.bootstrap4.min.css"/>
        <script type="text/javascript" src="lib/datatables/datatables.min.js"></script>
        <script type="text/javascript" src="lib/datatables/datatables.bootstrap4.js"></script>
        <link rel="stylesheet" href="editor/editor.css">

    <? }elseif (!isset($_GET['edit'])){ ?>

        <link rel="stylesheet" href="dashboard/css/main.css">

    <? } ?>

    <? if (is_array($_SESSION['user'])) { ?>

        <link rel="stylesheet" href="dashboard/css/dashboard.css">

    <? } ?>

        <script src="lib/http_code.jquery.com_ui_1.12.1_jquery-ui.js"></script>
        <script src="lib/jquery.ui.touch-punch.min.js"></script>
        <script src="lib/http_cdnjs.cloudflare.com_ajax_libs_tether_1.2.0_js_tether.js"></script>
        <script src="lib/bootstrap/bootstrap.min.js"></script>

    <script src="lib/html2canvas.js"></script>
</head>
<body>


<?php


$adapters = array();
foreach ($adapterConfigs as $adapter => $settings) {
    $class = 'SocialAuther\Adapter\\' . ucfirst($adapter);
    $adapters[$adapter] = new $class($settings);
}


if (isset($_GET['registration'])) {
    include_once('registration.php');
} elseif (!isset($_SESSION['user'])) {
    include_once('login.php');
} elseif (isset($_GET['edit'])) {
    include_once('editor/editor.php');
} elseif (isset($_GET['diagram_list'])) {
    include_once('dashboard/diagram_list.php');
} elseif (isset($_GET['logout'])) {
    include_once('logout.php');
} else {
    include_once('dashboard/diagram_list.php');
}
?>


<script src="dashboard/js/main.js"></script>

</body>
</html>
