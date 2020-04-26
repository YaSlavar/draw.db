<?php
/**
 * Created by PhpStorm.
 * User: yasla
 * Date: 29.06.2019
 * Time: 16:45
 */
?>


<div class="modal_window">
    <div class="modal fade" id="craete_new_diagram" tabindex="-1" role="dialog" aria-labelledby="message_box"
         aria-hidden="false">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="create_and_rename_diagramm_title">Создание новой диаграммы</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <form id="form_new_diagram" method="post">
                    <div class="modal-body">
                        <div class="form-group">
                            <input type="hidden" name="edit" value="" id="diagram_id">
                            <label for="diagram_name">Название диаграммы:</label>
                            <input type="text" name="diagram_name" class="form-control"
                                   placeholder="Введите название диаграммы">
                        </div>
                        <div class="form-group">
                            <label for="diagram_type">Нотация:</label>
                            <select class="form-control" id="diagram_type" name="diagram_type">
                                <option value="chen">Нотация Питера Чена</option>
                                <option value="idef1x">IDEF1X</option>
                            </select>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                        <button id="btn_new_diagram" type="submit" class="btn btn-primary btn_bg_color">Создать</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>


<div class="modal_window">
    <div class="modal fade" id="check_for_deletion" tabindex="-1" role="dialog" aria-labelledby="message_box"
         aria-hidden="false">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="message_box_title">Удаление диаграммы</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>

                <div class="modal-body">
                    <div class="modal-body">
                        <h4 id="delete_message"></h4>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Отменить</button>
                    <button id="btn_delete_diagram" type="submit" class="btn btn-danger">УДАЛИТЬ!</button>
                </div>

            </div>
        </div>
    </div>
</div>