<?php
/**
 * Created by PhpStorm.
 * User: yasla
 * Date: 23.01.2019
 * Time: 21:16
 */

require_once('../config.php');
    $RESULT_DATE = array();

    $diagram_id = $_POST['diagram_id'];

    $select = $db ->query("SELECT * FROM diagrams WHERE diagram_id = $diagram_id");
    $check_saved_diagram = $select->fetchArray();
    if(is_array($check_saved_diagram)){
        if($check_saved_diagram['author_id'] == $_SESSION['user']['user_id']){


            $RESULT_DATE['mains'] = array();
            $select_mains = $db ->query("SELECT * FROM mains WHERE diagram_id = $diagram_id");
            while($mains = $select_mains->fetchArray(SQLITE3_ASSOC)){
                $RESULT_DATE['mains'][] = $mains;
            }

            $RESULT_DATE['attributes'] = array();
            $select_attributes = $db ->query("SELECT * FROM attributes WHERE diagram_id = $diagram_id");
            while($attributes = $select_attributes->fetchArray(SQLITE3_ASSOC)){
                $RESULT_DATE['attributes'][] = $attributes;
            }

            $select_relationships = $db ->query("SELECT * FROM relationships WHERE diagram_id = $diagram_id");
            while($relationships = $select_relationships->fetchArray(SQLITE3_ASSOC)){
                $RESULT_DATE['relationships'][] = $relationships;
            }

            $select_links = $db ->query("SELECT * FROM links WHERE diagram_id = $diagram_id");
            while($links = $select_links->fetchArray(SQLITE3_ASSOC)){
                $RESULT_DATE['links'][] = $links;
            }

            $RESULT_DATE['diagram_id'] = $check_saved_diagram['diagram_id'];
            $RESULT_DATE['diagram_name'] = $check_saved_diagram['diagram_name'];


            $RES_JSON = json_encode($RESULT_DATE);
            print_r($RES_JSON);

        }else{
            // TODO: Вызвать ошибку загрузки по причеине отсутствия прав
        }
    }






