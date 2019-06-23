<?php
/**
 * Created by PhpStorm.
 * User: yasla
 * Date: 04.01.2019
 * Time: 21:45
 */
?>

<?include_once('editor/modal_window.php');?>

<div class="background container-fluid h-100">
    <div class="row h-100 justify-content-center">
        <div class="col-xl-9 col-lg-9 col-md-10 col-sm-11 col-12">

            <header class="main_block head_panel">
                <div class="row align-items-center">
                    <div class="col-sm-auto">
                        <?if ($_SESSION['user']['avatar'] != ''){ ?>
                        <div class="avatar">
                            <img class="avatar_size" src="<?echo($_SESSION['user']['avatar']);?>" alt="avatar">
                        </div>
                        <?}?>
                    </div>
                    <div class="col">
                        <h5 class="name">
                            <?echo($_SESSION['user']['name']);?>
                        </h5>
                    </div>
                    <div class="col-sm-auto">
                         <div class="create_diagramm">
                            <button id="new_diagram" class="login_btn btn btn-primary btn-block" onclick="create_new_diagram()">Новая диаграмма</button>
                        </div>
                    </div>
                    <div class="col-sm-auto">
                        <div class="logout">
                            <a href="logout.php">Выход</a>
                        </div>
                    </div>
                </div>
            </header>

            <section class="diagram_list row">
                <div class="col">
                    <?
                    $author_id = $_SESSION['user']['user_id'];
                    $select = $db ->query("SELECT * FROM diagrams WHERE author_id = $author_id");
                    while ($res = $select->fetchArray()) {
                    ?>
                        <div class="main_block tile">
                            <div class="diagram_title_block row">
                                <a class="diagram_title col" href="index.php?edit=<?echo($res['diagram_id']);?>">
                                    <?
                                    echo($res['diagram_name']);
                                    ?>
                                </a>
                                <div class="close_buttom_block col-1">
                                    <button type="button" class="close close-button" aria-label="Close" data-toggle="tooltip" data-placement="left" title="Удалить диаграмму">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    <?
                    }
                    ?>
                </div>
            </section>
        </div>
    </div>
</div>

<script>
    $(document).ready(function(){
        $("form#form_new_diagram").attr('action', "?edit="+randInt());

        $('[data-toggle="tooltip"]').tooltip();
    });
</script>

