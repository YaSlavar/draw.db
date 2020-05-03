<?php

$adapterConfigs = array(
    'vk' => array(
        'client_id'     => '6805794',
        'client_secret' => 'TGGzKKH6b4XWQ9MetDC4',
        'redirect_uri'  => 'http://localhost/registration.php?provider=vk'
    ),
    'mailru' => array(
        'client_id'     => '770076',
        'client_secret' => '5b8f8906167229feccd2a7320dd6e140',
        'redirect_uri'  => 'http://localhost/auth/?provider=mailru'
    ),
    'yandex' => array(
        'client_id'     => 'bfbff04a6cb60395ca05ef38be0a86cf',
        'client_secret' => '219ba8388d6e6af7abe4b4b119cbee48',
        'redirect_uri'  => 'http://localhost/auth/?provider=yandex'
    ),
    'google' => array(
        'client_id'     => '333193735318.apps.googleusercontent.com',
        'client_secret' => 'lZB3aW8gDjIEUG8I6WVcidt5',
        'redirect_uri'  => 'http://localhost/auth?provider=google'
    ),
    'facebook' => array(
        'client_id'     => '613418539539988',
        'client_secret' => '2deab137cc1d254d167720095ac0b386',
        'redirect_uri'  => 'http://localhost/auth?provider=facebook'
    )
);


$version = 2;

$path_to_database = "/usr/share/nginx/html/database.db";

// SQLite 3
$db=new SQLite3($path_to_database, SQLITE3_OPEN_READWRITE);

$db->busyTimeout(5000);
$db->exec('PRAGMA journal_mode=WAL;');



session_start();