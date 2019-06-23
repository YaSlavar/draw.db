<?php
/**
 * Created by PhpStorm.
 * User: yasla
 * Date: 17.04.2019
 * Time: 15:26
 */

//include('editor/MSSQL_Connect.php');



$sql = "SELECT * FROM prepods";


$stmt = sqlsrv_query( $conn, $sql);
if( $stmt === false ) {
    die( print_r( sqlsrv_errors(), true));
}

while( $row = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC) ) {
    print_r($row);
}
?>
