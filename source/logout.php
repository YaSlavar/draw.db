<?php
/**
 * Created by PhpStorm.
 * User: yasla
 * Date: 04.01.2019
 * Time: 21:19
 */


session_start();
unset($_SESSION['user']);
header("location: ../index.php");