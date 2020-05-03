<?php
/**
 * Created by PhpStorm.
 * User: yasla
 * Date: 17.04.2019
 * Time: 20:46
 */


session_start();

$RESULT_DATE = array();






if ($_POST['type'] === 'check'){

    if (isset($_SESSION['MSSQL_CONNECT'])){
        $RESULT_DATE['server'] = $_SESSION['MSSQL_CONNECT']['server_name'];
        $RESULT_DATE['database'] = $_SESSION['MSSQL_CONNECT']['database'];
    }else{
        $RESULT_DATE['connect'] = false;
    }
    print_r(json_encode($RESULT_DATE, JSON_UNESCAPED_UNICODE));
    exit;



}elseif ($_POST['type'] === 'connect') {

    unset($_SESSION['MSSQL_CONNECT']);

    $serverName = $_POST['server_name'];
    $connectionInfo = array( "Database"=>$_POST['database'], "UID"=>$_POST['login'], "PWD"=>$_POST['password'], "CharacterSet" => "UTF-8");

    $conn = sqlsrv_connect($serverName, $connectionInfo);


    if(!$conn) {

        $error = sqlsrv_errors()[0];
        $RESULT_DATE['code'] = $error['code'];
        $RESULT_DATE['message'] = $error['message'];
        $RESULT_DATE["description"] = "Не удалось установить соединение! Проверьте правильность введенных учетных данных!";

        print_r(json_encode($RESULT_DATE));


        unset($_SESSION['MSSQL_CONNECT']);

        exit;
    }else{
        $_SESSION['MSSQL_CONNECT'] = array("server_name" => $_POST['server_name'], "database" => $_POST['database'], "UID"=>$_POST['login'], "PWD"=>$_POST['password'], "CharacterSet" => "UTF-8");
        $RESULT_DATE['connect'] = $_SESSION['MSSQL_CONNECT']['server_name'];
        $error = sqlsrv_errors()[0];
        $RESULT_DATE['code'] = $error['code'];
        $RESULT_DATE['message'] = $error['message'];
        $RESULT_DATE['description'] = "Соединение установлено!";
        print_r(json_encode($RESULT_DATE, JSON_UNESCAPED_UNICODE));
        exit;
    }


}elseif ($_POST['type'] === 'disconnect') {

    $RESULT_DATE['description'] = "Соединение разорвано!";
    print_r(json_encode($RESULT_DATE, JSON_UNESCAPED_UNICODE));
    unset($_SESSION['MSSQL_CONNECT']);
    exit;



}elseif ($_POST['type'] === 'query'){

    if(isset($_SESSION['MSSQL_CONNECT'])) {



        $serverName = $_SESSION['MSSQL_CONNECT']['server_name'];

        $database = $_SESSION['MSSQL_CONNECT']['database'];
        $login = $_SESSION['MSSQL_CONNECT']['UID'];
        $password = $_SESSION['MSSQL_CONNECT']['PWD'];



        $connectionInfo = array("Database"=>$database, "UID"=>$login, "PWD"=>$password, "CharacterSet" => "UTF-8");
        $conn = sqlsrv_connect($serverName, $connectionInfo);

        $sql = $_POST['query'];
        $stmt = sqlsrv_query($conn, $sql);


        if( $stmt === false ) {

            $error = sqlsrv_errors()[0];
            $RESULT_DATE['code'] = $error['code'];
            $RESULT_DATE['message'] = str_replace("[Microsoft][ODBC Driver 11 for SQL Server][SQL Server]", "", $error['message']);

            print_r(json_encode($RESULT_DATE));
            exit;

        }else{
            $result = array();

            while( $dataArray = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC)) {

                array_push($result, $dataArray);

            }
            $RESULT_DATE['message'] = "Запрос '". str_replace("/n", "", $_POST['query']) ."' успешно выполнен!";
            $RESULT_DATE['result'] = $result;
            print_r(json_encode($RESULT_DATE));
            exit;
        }

    }else{
        $RESULT_DATE['message'] = "Не установлено подключение к MSSQL Server";
        print_r(json_encode($RESULT_DATE));
    }

}




