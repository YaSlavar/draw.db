<?php

$auth_config = [
    'callback' => 'http://localhost/auth',

    //Providers specifics
    'providers' => [
        'Vkontakte' => [
            'enabled' => true,
            'keys' => [
                'key' => '',
                'secret' => ''
            ]
        ],
        'Google' => [
            'enabled' => true,
            'keys' => [
                'id' => '',
                'secret' => '']
        ],
        'Yandex' => [
            'enabled' => true,
            'keys' => [
                'id' => '',
                'secret' => '']
        ],
    ]
];

$version = 4;

$path_to_database = "/usr/share/nginx/html/database.db";

// SQLite 3
$db = new SQLite3($path_to_database, SQLITE3_OPEN_READWRITE);

$db->busyTimeout(5000);
$db->exec('PRAGMA journal_mode=WAL;');


session_start();