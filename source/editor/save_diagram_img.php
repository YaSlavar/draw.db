<?php
/**
 * Created by PhpStorm.
 * User: yasla
 * Date: 27.01.2019
 * Time: 21:38
 */

$image = $_POST['image'];
$name = $_POST['diagram_id'];

$location = "../user_data";

$image = str_replace('data:image/png;base64,', '', $image);
$bin = base64_decode($image);

$size = getimagesizefromstring($bin);

if (empty($size['mime']) || strpos($size['mime'], 'image/') !== 0){
    echo ("Изображение имеет неполную структуру");
}

$ext = substr($size['mime'], 6);

if (!in_array($ext, ['png', 'gif', 'jpg'])){
    echo ("Неподдерживаемый тип изоюражения");
}

$image_name = $name . ".{$ext}";
$image_path = $location . "/" . $image_name;

file_put_contents($image_path, $bin);

echo $image_name;
