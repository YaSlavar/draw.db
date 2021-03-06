<?php
/**
 * Created by PhpStorm.
 * User: yasla
 * Date: 04.01.2019
 * Time: 21:45
 */
?>

<? include_once("modal_window.php"); ?>

<div class="background container-fluid h-100">
    <div class="row h-100 justify-content-center">
        <div class="col-xl-9 col-lg-9 col-md-10 col-sm-12 col-12">

            <header class="head_panel main_block">
                <div class="row align-items-center">
                    <? if ($_SESSION['user']['avatar'] != '') { ?>
                        <div class="col-sm-auto col-3">
                            <div class="avatar">
                                <img class="avatar_size" src="<? echo($_SESSION['user']['avatar']); ?>" alt="avatar">
                            </div>
                        </div>
                    <? } ?>
                    <div class="col">
                        <h5 class="name">
                            <? echo($_SESSION['user']['name']); ?>
                        </h5>
                    </div>
                    <div class="col-sm-auto">
                        <div class="create_diagramm">
                            <button id="new_diagram" class="login_btn btn btn-primary btn-block"
                                    onclick="create_and_rename_diagram()">Новая диаграмма
                            </button>
                        </div>
                    </div>
                    <div class="col-sm-auto justify-content-end">
                        <div class="logout">
                            <a href="?logout=true">Выход</a>
                        </div>
                    </div>
                </div>
            </header>

            <section class="diagram_list row">

                <?
                $author_id = $_SESSION['user']['user_id'];
                $select = $db->query("SELECT * FROM diagrams WHERE author_id = $author_id");

                $data = Array();

                while ($res = $select->fetchArray(SQLITE3_ASSOC)) {
                    array_push($data, $res);
                }


                if (count($data) > 0) {

                    while ($res = $select->fetchArray(SQLITE3_ASSOC)) {
                        ?>
                        <div class="col-xl-4 col-lg-6 col-md-6 col-sm-12 col-12 diagram_block" diagram_id="<?
                        echo($res['diagram_id']); ?>">
                            <a href="?edit=<?
                            echo($res['diagram_id']); ?>">
                                <div class="main_block tile">
                                    <div class="diagram_img_block">
                                        <img class="diagram_img" src="user_data/<?
                                        echo($res['diagram_id'] . ".png?id=" . date("YmdHis")) ?>" alt="">
                                    </div>
                                    <div class="diagram_title_block row">
                                        <div class="diagram_title col-8">
                                            <a class="diagram_name_label" diagram_id="<?
                                            echo($res['diagram_id']); ?>"
                                               href="?edit=<? echo($res['diagram_id']); ?>">
                                                <? echo($res['diagram_name']); ?>
                                            </a>
                                            <span class="badge badge-pill badge-primary diagram_type_label">
                                                <? echo(ucwords($res['diagram_type'])) ?>
                                             </span>
                                        </div>
                                        <div class="edit_diagram_button col-4">
                                            <button id="rename_<? echo($res['diagram_id']); ?>" type="button"
                                                    class="rename_diagramm_button" aria-label="Rename"
                                                    data-toggle="tooltip"
                                                    data-placement="left"
                                                    onclick="create_and_rename_diagram(<?
                                                    echo($res['diagram_id']); ?>);"
                                                    title="Переименовать диаграмму">
                                                <div class="rename_diagramm_icon"></div>
                                            </button>
                                            <button id="delete_<? echo($res['diagram_id']); ?>" type="button"
                                                    class="close close-button" aria-label="Close" data-toggle="tooltip"
                                                    onclick="delete_diagram(<?
                                                    echo($res['diagram_id']); ?>);" data-placement="left"
                                                    title="Удалить диаграмму">
                                                <div class="delete_diagramm_icon"></div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>
                        <?
                    }

                } else {

                    ?>
                    <div class="no_diagrams_title d-flex justify-content-center align-items-center">
                        <p class="text-center">Список диаграмм пуст!</p>
                    </div>
                    <?
                }

                ?>

            </section>
        </div>
    </div>
</div>

<script>
    $(document).ready(function () {
        $("form#form_new_diagram").attr('action', "?edit=" + randInt());

        $('[data-toggle="tooltip"]').tooltip();
    });
</script>

