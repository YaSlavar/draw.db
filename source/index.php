<?
require_once 'config.php';

include 'lib/hybridauth/autoload.php';
use Hybridauth\Hybridauth;

try {
    $hybridauth = new Hybridauth($auth_config);
    $adapters = $hybridauth->getConnectedAdapters();
} catch (\Hybridauth\Exception\InvalidArgumentException $e) {
    print_r($e);
} catch (\Hybridauth\Exception\UnexpectedValueException $e) {
    print_r($e);
}

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

    <link rel="stylesheet" href="lib/bootstrap/bootstrap.css?version=<?echo ($version)?>">
    <script type="text/javascript" src="lib/jquery_3.5.0/jquery_3.5.0.js?version=<?echo ($version)?>"></script>
    <script type="text/javascript" src="lib/popper_js_1.16.0.js?version=<?echo ($version)?>"></script>
    <script type="text/javascript" src="lib/crypto-js.js?version=<?echo ($version)?>"></script>


    <? if (isset($_GET['edit']) and is_array($_SESSION['user'])) { ?>


        <script type="text/javascript" src="lib/datatables/datatables.min.js?version=<?echo ($version)?>"></script>
        <script type="text/javascript" src="lib/ace-builds/src-min-noconflict/ace.js?version=<?echo ($version)?>" charset="utf-8"></script>
        <script type="text/javascript" src="lib/mouseWheel/jquery.mousewheel.min.js?version=<?echo ($version)?>"></script>
        <script type="text/javascript" src="editor/js/editor.js?version=<?echo ($version)?>"></script>
        <link rel="stylesheet" type="text/css" href="lib/datatables/DataTables-1.10.20/css/dataTables.bootstrap.min.css?version=<?echo ($version)?>"/>
        <link rel="stylesheet" href="editor/css/editor.css?version=<?echo ($version)?>">

    <? }elseif (!isset($_GET['edit'])){ ?>

        <link rel="stylesheet" href="dashboard/css/main.css?version=<?echo ($version)?>">

    <? } ?>

    <? if (is_array($_SESSION['user'])) { ?>

        <script type="text/javascript" src="editor/js/editor.js?version=<?echo ($version)?>"></script>
        <script src="dashboard/js/main.js?version=<?echo ($version)?>"></script>
        <link rel="stylesheet" href="dashboard/css/dashboard.css?version=<?echo ($version)?>">

    <? } ?>

        <script src="lib/http_code.jquery.com_ui_1.12.1_jquery-ui.js?version=<?echo ($version)?>"></script>
        <script src="lib/jquery.ui.touch-punch.min.js?version=<?echo ($version)?>"></script>
        <script src="lib/http_cdnjs.cloudflare.com_ajax_libs_tether_1.2.0_js_tether.js?version=<?echo ($version)?>"></script>
        <script src="lib/bootstrap/bootstrap.js?version=<?echo ($version)?>"></script>
        <script src="lib/bootstrap_menu/BootstrapMenu.js?version=<?echo ($version)?>"></script>

        <script src="lib/html2canvas.min.js?version=<?echo ($version)?>"></script>

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

if (isset($_GET['registration'])) {
    include_once('registration.php');
} elseif (!isset($_SESSION['user'])) {
    include_once('login.php');
} elseif (isset($_GET['edit'])) {
    include_once('editor/editor.php');
} elseif (isset($_GET['diagram_list']) and isset($_SESSION['user'])) {
    include_once('dashboard/diagram_list.php');
} elseif (isset($_GET['logout'])) {

        foreach ($adapters as $provider_name => $adapter) :
            $adapter->disconnect();
        endforeach;

        session_start();
        unset($_SESSION['user']);
        header("location: index.php");

} else {
    include_once('dashboard/diagram_list.php');
}
?>


</body>
</html>
