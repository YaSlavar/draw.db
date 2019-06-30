<?php
/**
 * Created by PhpStorm.
 * User: yasla
 * Date: 16.12.2018
 * Time: 14:17
 */


require_once('../config.php');


function save_elements($diagram_id, $db)
{

    if (is_array($_POST['mains'])) {
        foreach ($_POST['mains'] as $key => $item) {
            $main_id = $key;
            $main_name = $item['name'];
            $position = json_encode($item['position']);

            $select = $db->query("SELECT * FROM mains WHERE main_id = $main_id");
            $res = $select->fetchArray();


            if ($res['diagram_id'] == $diagram_id) {
                $mains = $db->prepare('UPDATE mains SET name = :main_name, position =  :position, diagram_id =  :diagram_id WHERE main_id = :main_id');
            } else {
                $mains = $db->prepare('INSERT INTO mains VALUES (:main_id, :main_name, :position, :diagram_id)');
            }

            $mains->bindValue(':main_id', $main_id);
            $mains->bindValue(':main_name', $main_name);
            $mains->bindValue(':position', $position);
            $mains->bindValue(':diagram_id', $diagram_id);

            $mains->execute();
        }
    }


    if (is_array($_POST['attributes'])) {
        foreach ($_POST['attributes'] as $key => $item) {
            $attribute_id = $key;
            $attribute_name = $item['name'];
            $parent_id = $item['parent'];
            $data_type = $item['data_type'];
            $data_len = $item['len_data'];
            $is_PK = $item['primary_key'] === 'true' ? true : false;
            $position = json_encode($item['position']);

            $select = $db->query("SELECT * FROM attributes WHERE attribute_id = $attribute_id");
            $res = $select->fetchArray();

            if ($res['diagram_id'] == $diagram_id) {
                $attributes = $db->prepare('UPDATE attributes SET parent_id = :parent_id, name = :attribute_name, position =  :position, data_type = :data_type, data_len = :data_len, is_PK = :is_PK, diagram_id =  :diagram_id WHERE attribute_id = :attribute_id');
            } else {
                $attributes = $db->prepare('INSERT INTO attributes VALUES (:attribute_id, :parent_id, :attribute_name, :position, :data_type, :data_len, :is_PK, :diagram_id)');
            }

            $attributes->bindValue(':attribute_id', $attribute_id);
            $attributes->bindValue(':attribute_name', $attribute_name);
            $attributes->bindValue(':parent_id', $parent_id);
            $attributes->bindValue(':data_type', $data_type);
            $attributes->bindValue(':data_len', $data_len);
            $attributes->bindValue(':is_PK', $is_PK);
            $attributes->bindValue(':position', $position);
            $attributes->bindValue(':diagram_id', $diagram_id);

            $attributes->execute();
        }
    }


    if (is_array($_POST['links'])) {
        foreach ($_POST['links'] as $key => $item) {
            $link_id = $key;
            $parent_id = $item['parent'];
            $position = json_encode($item['position']);

            $select = $db->query("SELECT * FROM links WHERE link_id = $link_id");
            $res = $select->fetchArray();

            if ($res['diagram_id'] == $diagram_id) {
                $links = $db->prepare('UPDATE links SET parent_id = :parent_id, position =  :position, diagram_id = :diagram_id WHERE link_id = :link_id');
            } else {
                $links = $db->prepare('INSERT INTO links VALUES (:link_id, :parent_id, :position, :diagram_id)');
            }

            $links->bindValue(':link_id', $link_id);
            $links->bindValue(':parent_id', $parent_id);
            $links->bindValue(':position', $position);
            $links->bindValue(':diagram_id', $diagram_id);

            $links->execute();
        }
    }


    if (is_array($_POST['relationships'])) {
        foreach ($_POST['relationships'] as $key => $item) {
            $relationship_id = $key;
            $first_main = $item['first'];
            $second_main = $item['second'];
            $rel_type = $item['rel_type'];
            $rel_description = $item['rel_description'];
            $position = json_encode($item['position']);

            $select = $db->query("SELECT * FROM relationships WHERE relationship_id = $relationship_id");
            $res = $select->fetchArray();

            if ($res['diagram_id'] == $diagram_id) {
                $relationships = $db->prepare('UPDATE relationships SET first_main = :first_main, second_main = :second_main, rel_type = :rel_type, rel_description = :rel_description, diagram_id =  :diagram_id, position =  :position WHERE relationship_id = :relationship_id');
            } else {
                $relationships = $db->prepare('INSERT INTO relationships VALUES (:relationship_id, :first_main, :second_main, :rel_type, :rel_description, :position, :diagram_id)');
            }

            $relationships->bindValue(':relationship_id', $relationship_id);
            $relationships->bindValue(':first_main', $first_main);
            $relationships->bindValue(':second_main', $second_main);
            $relationships->bindValue(':rel_type', $rel_type);
            $relationships->bindValue(':rel_description', $rel_description);
            $relationships->bindValue(':position', $position);
            $relationships->bindValue(':diagram_id', $diagram_id);

            $relationships->execute();
        }
    }


}

function create_diagramm($diagram_id, $diagram_name, $db)
{
    $author_id = $_SESSION['user']['user_id'];
    $relationships = $db->prepare('INSERT INTO diagrams(diagram_id, author_id, diagram_name) VALUES (:diagram_id, :author_id, :diagram_name)');
    $relationships->bindValue(':diagram_id', $diagram_id);
    $relationships->bindValue(':author_id', $author_id);
    $relationships->bindValue(':diagram_name', $diagram_name);

    $relationships->execute();
}

function clean_diagramm($diagram_id, $db)
{
    $claen_mains = $db->prepare('DELETE FROM mains WHERE diagram_id = :diagram_id');
    $claen_mains->bindValue(':diagram_id', $diagram_id);
    $claen_mains->execute();

    $claen_attributes = $db->prepare('DELETE FROM attributes WHERE diagram_id = :diagram_id');
    $claen_attributes->bindValue(':diagram_id', $diagram_id);
    $claen_attributes->execute();

    $claen_relationships = $db->prepare('DELETE FROM relationships WHERE diagram_id = :diagram_id');
    $claen_relationships->bindValue(':diagram_id', $diagram_id);
    $claen_relationships->execute();

    $claen_links = $db->prepare('DELETE FROM links WHERE diagram_id = :diagram_id');
    $claen_links->bindValue(':diagram_id', $diagram_id);
    $claen_links->execute();
}

function delete_diagramm($diagram_id, $db)
{
    $delete_diagramm = $db->prepare('DELETE FROM diagrams WHERE diagram_id = :diagram_id');
    $delete_diagramm->bindValue(':diagram_id', $diagram_id);
    $delete_diagramm->execute();
    try{
        unlink("../user_data/".$diagram_id.".png");
    }catch (Exception $err){
        echo('{"error": "'.$err.'"}');
    }


}


// TODO: Написать функцию удаления диаграммы!
if (isset($_POST['diagram_id'])) {
    $diagram_id = $_POST['diagram_id'];
    $diagram_name = $_POST['diagram_name'];
    $command = $_POST['command'];

    $select = $db->query("SELECT * FROM diagrams WHERE diagram_id = $diagram_id");
    $check_saved_diagram = $select->fetchArray();


    if (is_array($check_saved_diagram)) {
        if ($check_saved_diagram['author_id'] == $_SESSION['user']['user_id']) {

            if ($command === "delete") {
                clean_diagramm($diagram_id, $db);
                delete_diagramm($diagram_id, $db);
                echo('{"status": "delete_ok", "error" : "none"}');

            } else {
                clean_diagramm($diagram_id, $db);
                save_elements($diagram_id, $db);
            }

        } else {
            $diagram_id = mt_rand(0, 999) . (string)date('YmdHis');
            create_diagramm($diagram_id, $diagram_name, $db);
            save_elements($diagram_id, $db);
        }

    } else {
        create_diagramm($diagram_id, $diagram_name, $db);
        save_elements($diagram_id, $db);
    }


}


