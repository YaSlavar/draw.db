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

    <link rel="apple-touch-icon" sizes="57x57" href="favicon/apple-icon-57x57.png">
    <link rel="apple-touch-icon" sizes="60x60" href="favicon/apple-icon-60x60.png">
    <link rel="apple-touch-icon" sizes="72x72" href="favicon/apple-icon-72x72.png">
    <link rel="apple-touch-icon" sizes="76x76" href="favicon/apple-icon-76x76.png">
    <link rel="apple-touch-icon" sizes="114x114" href="favicon/apple-icon-114x114.png">
    <link rel="apple-touch-icon" sizes="120x120" href="favicon/apple-icon-120x120.png">
    <link rel="apple-touch-icon" sizes="144x144" href="favicon/apple-icon-144x144.png">
    <link rel="apple-touch-icon" sizes="152x152" href="favicon/apple-icon-152x152.png">
    <link rel="apple-touch-icon" sizes="180x180" href="favicon/apple-icon-180x180.png">
    <link rel="icon" type="image/png" sizes="192x192" href="favicon/android-icon-192x192.png">
    <link rel="icon" type="image/png" sizes="32x32" href="favicon/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="96x96" href="favicon/favicon-96x96.png">
    <link rel="icon" type="image/png" sizes="16x16" href="favicon/favicon-16x16.png">
    <link rel="manifest" href="favicon/manifest.json">
    <meta name="msapplication-TileColor" content="#ffffff">
    <meta name="msapplication-TileImage" content="favicon/ms-icon-144x144.png">
    <meta name="theme-color" content="#ffffff">

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

    <!-- Yandex.Metrika counter -->
    <script type="text/javascript" >
        (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
        (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

        ym(55457170, "init", {
            clickmap:true,
            trackLinks:true,
            accurateTrackBounce:true,
            webvisor:true,
            trackHash:true
        });
    </script>
    <noscript><div><img src="https://mc.yandex.ru/watch/55457170" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
    <!-- /Yandex.Metrika counter -->

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
