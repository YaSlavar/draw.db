<?php
/**
 * Created by PhpStorm.
 * User: yasla
 * Date: 27.10.2018
 * Time: 16:45
 */
?>


<div class="modal_window">
    <div class="modal fade" id="message_box" tabindex="-1" role="dialog" aria-labelledby="message_box" aria-hidden="false">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="message_box_title">Сообщение</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
              <h6 class="message_text">Текст сообщения</h6>
              <div id="message_box_content"></div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Закрыть</button>
          </div>
        </div>
      </div>
    </div>
</div>



<div class="modal_window">
    <div class="modal fade" id="craete_new_diagram" tabindex="-1" role="dialog" aria-labelledby="message_box" aria-hidden="false">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="message_box_title">Создание новой диаграммы</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
            <form id="form_new_diagram" method="post">
              <div class="modal-body">
                  <div class="modal-body">
                    <input type="hidden" name="edit" value="" id="diagram_id">
                    <input type="text" name="diagram_name" class="form-control" placeholder="Введите название новой диаграммы">
                  </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                <button id="btn_new_diagram" type="submit" class="btn btn-primary btn_bg_color">Создать!</button>
              </div>
            </form>
        </div>
      </div>
    </div>
</div>




<div class="modal_window">
    <div class="modal fade" id="new_main" tabindex="-1" role="dialog" aria-labelledby="new_diagramm" aria-hidden="false">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="new_diagramm_title">Создание новой сущности</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
            <form id="form_new_main">
              <div class="modal-body">
                <input type="text" name="main_name" class="form-control name_diagramm" placeholder="Введите название новой сущности">
                <div class="error"></div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                <button id="btn_new_main" type="submit" class="btn btn-primary btn_bg_color">Создать!</button>
              </div>
            </form>
        </div>
      </div>
    </div>
</div>


<div class="modal_window">
    <div class="modal fade" id="new_attribute" tabindex="-1" role="dialog" aria-labelledby="new_diagramm" aria-hidden="false">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="new_attribute_title">Добавление нового атрибута</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
            <form id="form_new_attribute">
              <div class="modal-body">
                  <div class="form-group">
                      <label for="attribute_name">Название нового атрибута</label>
                      <input type="text" name="attribute_name" class="form-control name_attribute" placeholder="Введите название нового атрибута">
                  </div>
                  <div class="form-group">
                        <label for="attr_datatype">Тип данных атрибута</label>
                        <select class="form-control" name="attr_datatype" title=""></select>
                  </div>
                  <div class="form-group row">
                        <label for="attr_data_len" class="col-8 col-form-label">Количество символов (длина атрибута)</label>
                        <div class="col-4">
                        <input type="number" class="form-control" name="attr_data_len" title="" min="1" max="9999">
                        </div>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" value="" name="primary_key" title="">
                      <label class="form-check-label" for="primary_key">Первичный ключ</label>
                  </div>
                  <div class="error"></div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                <button id="btn_new_attribute" type="submit" class="btn btn-primary btn_bg_color">Добавить!</button>
              </div>
            </form>
        </div>
      </div>
    </div>
</div>


<div class="modal_window">
    <div class="modal fade" id="new_relationship">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="new_relationship_title">Добавление новой связи</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
            <form id="form_new_relationship">
              <div class="modal-body">
                <strong>Необходимо выбрать 2 сущности для создания связи</strong>
                  <div class="row">
                    <div class="col-sm">
                      Главная сущность
                       <select multiple class="form-control" name="rel_first_main" title=""></select>
                      Степень соединения
                       <select class="form-control" name="rel_type" title=""></select>
                    </div>
                    <div class="col-sm">
                      Второстепенная сущность
                       <select multiple class="form-control" name="rel_second_main" title=""></select>
                      Описание связи
                       <input type="text" name="rel_description" class="form-control name_attribute" placeholder="Введите описание связи">
                    </div>
                  </div>
                  <div class="error"></div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                <button id="btn_new_relationship" type="submit" class="btn btn-primary btn_bg_color">Создать!</button>
              </div>
            </form>
        </div>
      </div>
    </div>
</div>



<div class="modal_window">
    <div class="modal fade" id="get_sql_code" tabindex="-1" role="dialog" aria-labelledby="message_box" aria-hidden="false">
      <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="message_box_title">Генерация SQL кода</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
              <div class="modal-body">
                  <div class="input-group mb-3">
                      <h6 class="modal-title" id="mssql_connect_description"></h6>
                      <button id="btn_disconnect" type="button" class="btn btn-danger">Разъеденить!</button>
                  </div>
                  <pre><code class="sql" id="sql_code_viewer"></code></pre>
                  <h6 class="modal-title" id="mssql_result_description">Результат выполнения запроса на сервере: </h6>
                  <textarea class="MSSQL_error" title="Результат выполнения запроса на сервере"></textarea>
              </div>
            <div class="modal-footer">
                <button id="insert_sql_to_server" type="button" class="btn btn-primary btn_bg_color">Создать физическую модель на сервере</button>
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Закрыть</button>
            </div>
        </div>
      </div>
    </div>
</div>


<div class="modal_window">
    <div class="modal fade" id="new_mssql_connect" tabindex="-1" role="dialog" aria-labelledby="new_mssql_connect" aria-hidden="false">
        <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="new_mssql_connect_title">Создание подключения к MSSQL Server</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <form id="form_new_mssql_connect" novalidate>
                    <div class="modal-body">
                        <div class="mssql_connection_form">
                            <h6 class="modal-title" id="mssql_connect_description">Подключение не установлено, пожалуйста пройдите авторизацию, чтобы продолжить создание физической модели.</h6>
                            <br>
                            <div class="form-group">
                                <label for="inputAddress">Имя сервера, порт</label>
                                <input type="text" class="form-control" id="mssql_server" placeholder="msuniversity.ru,1450" required>
                                <div id="invalid_server" class="invalid-feedback">
                                    Необходимо заполнить поле.
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group col-md-6">
                                    <label for="inputEmail4">Имя пользователя</label>
                                    <input type="text" class="form-control" id="mssql_login" placeholder="Login" required>
                                    <div id="invalid_login" class="invalid-feedback">
                                        Введены неверные учетные данные.
                                    </div>
                                </div>
                                <div class="form-group col-md-6">
                                    <label for="inputPassword4">Пароль</label>
                                    <input type="password" class="form-control" id="mssql_password" placeholder="Password" required>
                                    <div id="invalid_password" class="invalid-feedback">
                                        Введены неверные учетные данные.
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="inputAddress">Имя базы данных</label>
                                <input type="text" class="form-control" id="database_name" placeholder="Database Name" required>
                                <div id="invalid_database" class="invalid-feedback">
                                    Введены неверные учетные данные.
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                        <button id="btn_new_connect" type="submit" class="btn btn-primary btn_bg_color">Соеденить!</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>


<div class="modal_window">
    <div class="modal fade" id="get_diagram_img" tabindex="-1" role="dialog" aria-labelledby="message_box" aria-hidden="false">
        <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="message_box_title">Экспорт диаграммы как изображение</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="preview_image">
                        <img src="" id="preview_image" alt="">
                    </div>
                </div>
                <div class="modal-footer">
                    <a href="" download="export.png" id="download_diagram_img" class="btn btn-primary btn_bg_color">Сохранить изображение на диск!</a>
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                </div>
            </div>
        </div>
    </div>
</div>