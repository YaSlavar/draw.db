<?php
/**
 * Created by PhpStorm.
 * User: yasla
 * Date: 27.01.2019
 * Time: 21:38
 */

$image = $_POST['image'];
$name = $_POST['diagram_id'];

$location = "user_data";

$image = str_replace('data:image/png;base64,', '', $image);
$decoded = base64_decode($image);

file_put_contents($location . "/" . $name . ".png", $decoded, LOCK_EX);


echo $image;
