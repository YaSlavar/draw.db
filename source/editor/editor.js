
//SYSTEM

function set_error(text) {
    $(".error").text(text);
    return false;
}


//DRAGGABLE

function setting_link() {
    var work_zone_container = $(".work_zone_container");
    var main = work_zone_container.children('.main');
    main.each(function (i, elem) {
        var main_id = $(elem).attr("id");
        var main = $("#" + main_id);

        var attribute = work_zone_container.children('[parent="' + main_id + '"]');
        var first_relationship = work_zone_container.children('.relationship[first=' + main_id + ']');
        var second_relationship = work_zone_container.children('.relationship[second=' + main_id + ']');
        var relationship = $.extend(first_relationship, second_relationship);
        // console.log(relationship);
        // console.log(first_relationship);
        // console.log(second_relationship);
        attribute.each(function (i, elem) {
            var attribute_id = $(elem).attr("id");
            var attribute = $('.attribute[id="' + attribute_id + '"]');
            var link = $('.link[id="' + attribute_id + '"]');
            var main_pos = main.position();
            var attribute_pos = attribute.position();
            link.attr({
                "x1": attribute_pos["left"] + Number(attribute.innerWidth() / 2),
                "y1": attribute_pos["top"] + Number(attribute.innerHeight() / 2),
                "x2": main_pos["left"] + Number(main.innerWidth() / 2),
                "y2": main_pos["top"] + Number(main.innerHeight() / 2)
            });
        });

        relationship.each(function (i, elem) {
            var relationship_id = $(elem).attr("id");
            var relationship = $('.relationship[id="' + relationship_id + '"]');

            var first_main_id = relationship.attr("first");
            var second_main_id = relationship.attr("second");
            var second_main;
            if (main_id === first_main_id) {
                second_main = $("#" + second_main_id);
            } else if (main_id === second_main_id) {
                second_main = $("#" + first_main_id);
            }

            var link = $('.link[parent="' + relationship_id + '"]');
            var main_pos = main.position();
            var second_main_pos = second_main.position();
            var relationship_pos = relationship.position();

            link.each(function (i, elem) {
                if (i === 0) {
                    $(elem).attr({
                        "x1": relationship_pos["left"] + Number(relationship.innerWidth() / 2),
                        "y1": relationship_pos["top"] + Number(relationship.innerHeight() / 2),
                        "x2": main_pos["left"] + Number(main.innerWidth() / 2),
                        "y2": main_pos["top"] + Number(main.innerHeight() / 2)
                    });
                } else {
                    $(elem).attr({
                        "x1": relationship_pos["left"] + Number(relationship.innerWidth() / 2),
                        "y1": relationship_pos["top"] + Number(relationship.innerHeight() / 2),
                        "x2": second_main_pos["left"] + Number(second_main.innerWidth() / 2),
                        "y2": second_main_pos["top"] + Number(second_main.innerHeight() / 2)
                    });
                }
            });

        });
    });
}


function draggable_box() {

    var work_zone_container = $(".work_zone_container");
    var main = work_zone_container.children('.main');
    var relationship = work_zone_container.children('.relationship');

    main.each(function (i, elem) {
        var main_id = $(elem).attr("id");
        var attribute = work_zone_container.children('[parent="' + main_id + '"]');

        $('.main[id="' + main_id + '"]').draggable({
            cursor: "move",
            stop: function () {
                if ($(this).offset().left < 0) {
                    $(this).css("left", 0);
                }
            },
            drag: function () {
                setting_link();
            }
        });

        attribute.each(function (i, elem) {
            $('.attribute[id="' + $(elem).attr("id") + '"]').draggable({
                drag: function () {
                    setting_link();
                }
            });
            setting_link();
        });

        relationship.each(function (i, elem) {
            $('.relationship[id="' + $(elem).attr("id") + '"]').draggable({
                drag: function () {
                    setting_link();
                }
            });
            setting_link();
        });

    });
}


//ADD
function add_main_block(main_id, name_new_main) {
    return '<div class=\"box main\" id=\"' + main_id + '\">' +
        '       <div class=\"main_text\">' + name_new_main + '</div>' +
        '       <div class=\"options\">' +
        '           <div class=\"box_option_bottom btn_text\">' +
        '               <div class=\"edit_main light_bottom\" id=\"' + main_id + '\" onclick="add_main(' + main_id + ');">Изменить сущность</div>' +
        '               <div class=\"add_atribute light_bottom\" id=\"' + main_id + '\" onclick=\"add_attribute(' + main_id + ');">Добавить атрибут</div>' +
        '               <div class=\"add_relationships light_bottom\" id=\"' + main_id + '\" onclick=\"add_relationship(' + main_id + ');">Создать связь</div>' +
        '               <div class=\"remove_main light_bottom red_bottom\" id=\"' + main_id + '\" onclick=\"remove_main(' + main_id + ');">Удалить сущность</div>' +
        '           </div>' +
        '      </div>' +
        '</div>';
}


function add_attribute_block(attribute_id, main_id, name_new_main, data_type, len_data, primary_key) {
    var is_pk = "";
    if (primary_key === true) {
        is_pk = "is_primary_key"
    }
    return '<div class=\"box attribute\" id=\"' + attribute_id + '\" parent=\"' + main_id + '\" data_type=\"' + data_type + '\" len_data=\"' + len_data + '\" primary_key=\"' + primary_key + '\">' +
        '       <div class="attribute_text ' + is_pk + '">' + name_new_main + '</div>' +
        '       <div class=\"options\">' +
        '           <div class=\"box_option_bottom btn_text\">' +
        '               <div class=\"edit_atribute light_bottom\" id=\"' + attribute_id + '\" onclick="add_attribute(' + main_id + ", " + attribute_id + ')">Изменить атрибут</div>' +
        '               <div class=\"remove_attribute light_bottom red_bottom\" id=\"' + attribute_id + '\" onclick=\"remove_attr(' + attribute_id + ');">Удалить атрибут</div>' +
        '           </div>' +
        '      </div>' +
        '</div>'
}


function add_relationship_block(relationship_id, rel_type, rel_desc, first_main, second_main) {
    return '<div class="relationship" id="' + relationship_id + '" first="' + first_main + '" second="' + second_main + '">' +
        '      <div class="box diamond">' +
        '          <div class="diamond_text">' + rel_type + '</div>' +
        '      </div>' +
        '          <div class="desc_diamond">' + rel_desc + '</div>' +
        '          <div class="options">' +
        '             <div class="box_option_bottom btn_text">' +
        '                <div class="edit_relationship light_bottom" onclick="add_relationship(' + relationship_id + ');">Изменить связь</div>' +
        '                <div class="remove_attribute light_bottom red_bottom" onclick="remove_relationship(' + relationship_id + ')">Удалить связь</div>' +
        '             </div>' +
        '          </div>' +
        '      </div>';
}


function add_link(parent_id, link_id) {
    return '<line class=\"link\" id=\"' + link_id + '\" parent=\"' + parent_id + '\" x1=\"10\" y1=\"10\" x2=\"226\" y2=\"90\" stroke=\"black\"></line>'
}


function add_main(edit_main_id = NaN) {
    var main_id = randInt();

    var name_new_main_input = $('input[name="main_name"]');
    name_new_main_input.val("");


    var edited_main = $('.main[id="' + edit_main_id + '"]');
    if ($('div').is(edited_main)) {
        $('#new_diagramm_title').text("Изменение сущности");
        $('#btn_new_main').text("Измененить!");
        name_new_main_input.val(edited_main.children(".main_text").text());
    } else {
        $('#new_diagramm_title').text("Создание новой сущности");
        $('#btn_new_main').text("Создать!");
    }

    var main_edit_window = $("#new_main");
    main_edit_window.modal("toggle");


    $("#form_new_main").submit(function (event) {
        var name_new_main = name_new_main_input.val();

        if (name_new_main !== "") {
            main_edit_window.modal("toggle");
            if (isNaN(edit_main_id)) {
                $(".work_zone_container").append(add_main_block(main_id, name_new_main));
            } else {
                $("#" + edit_main_id).children(".main_text").text(name_new_main);
            }
            draggable_box();
        }
        $(this).off(event);
        return false;
    });
}


function add_attribute(main_id, edit_attr_id = NaN) {
    var attribute_id = randInt();

    var new_attribute_window = $("#new_attribute");
    new_attribute_window.modal("toggle");

    var input_name_new_attribute = $('input[name="attribute_name"]');
    var input_attr_datatype = $('select[name="attr_datatype"]');
    var input_len_datatype = $('input[name="attr_data_len"]');
    var primary_key_checkbox = $('input[name="primary_key"]');

    input_name_new_attribute.val("");
    input_attr_datatype.empty();
    input_len_datatype.val(0);
    primary_key_checkbox.prop('checked', false);

    input_attr_datatype.append('<option value="int">int</option>' +
        '<option value="char">char</option>' +
        '<option value="float">float</option>' +
        '<option value="money">money</option>' +
        '<option value="varchar">varchar</option>' +
        '<option value="date">date</option>'
    );

    var edited_attribute = $('.attribute[id="' + edit_attr_id + '"]');
    if ($('div').is(edited_attribute)) {
        $('#new_attribute_title').text("Изменение атрибута");
        $('#btn_new_attribute').text("Измененить!");
        input_name_new_attribute.val(edited_attribute.children(".attribute_text").text());
        input_attr_datatype.val(edited_attribute.attr("data_type"));
        input_len_datatype.val(edited_attribute.attr("len_data"));
        primary_key_checkbox.prop('checked', edited_attribute.attr("primary_key"));
    } else {
        $('#new_attribute_title').text("Добавление нового атрибута");
        $('#btn_new_attribute').text("Добавить!");
    }

    $("#form_new_attribute").submit(function (event) {
        var name_new_attribute = input_name_new_attribute.val();
        var data_type = input_attr_datatype.val();
        var len_data = input_len_datatype.val();
        var primary_key = primary_key_checkbox.prop("checked");

        if (name_new_attribute !== "") {
            new_attribute_window.modal("toggle");

            if ($('div').is('.attribute[id="' + edit_attr_id + '"]')) {
                var edited_attribute_text = edited_attribute.children(".attribute_text");
                edited_attribute_text.text(name_new_attribute);
                edited_attribute.attr("data_type", data_type);
                edited_attribute.attr("len_data", len_data);
                edited_attribute.attr("primary_key", primary_key);
                if (primary_key === true) {
                    edited_attribute_text.addClass("is_primary_key");
                }
                else {
                    edited_attribute_text.removeClass("is_primary_key");
                }
            } else {
                $(".work_zone_container").append(add_attribute_block(attribute_id, main_id, name_new_attribute, data_type, len_data, primary_key));
                var canvas = $(".canvas");
                canvas.append(add_link(main_id, attribute_id));
                // перерисовка svg
                canvas.html(canvas.html());
                draggable_box();
            }
        }
        $(this).off(event);
        return false;
    });
}


function add_relationship(edit_rel_id) {
    var new_relationship_window = $("#new_relationship");

    // инициализация и очистка форм
    var rel_first_main = $('select[name="rel_first_main"]');
    var rel_second_main = $('select[name="rel_second_main"]');
    var rel_type = $('select[name="rel_type"]');
    var rel_description = $('input[name="rel_description"]');

    rel_first_main.empty();
    rel_second_main.empty();
    rel_type.empty();
    rel_description.val("");

    set_error("");

    // Действия над формами модального окна
    var work_zone_container = $(".work_zone_container");
    var main = work_zone_container.children('.main');
    main.each(function (i, elem) {
        var main_name = $(elem).children(".main_text").text();
        var main_id = $(elem).attr("id");
        rel_first_main.append('<option value="' + main_id + '">' + main_name + '</option>');
        rel_second_main.append('<option value="' + main_id + '">' + main_name + '</option>');
    });
    rel_type.append('<option value="1:1">1:1</option>' +
        '<option value="1:N">1:N</option>' +
        '<option value="N:N">N:N</option>');

    var edited_relationship = $('.relationship[id="' + edit_rel_id + '"]');
    if ($('div').is(edited_relationship)) {
        $('#new_relationship_title').text("Изменение связи");
        $('#btn_new_relationship').text("Измененить!");
        rel_description.val(edited_relationship.children(".desc_diamond").text());
        rel_first_main.val(edited_relationship.attr("first"));
        rel_second_main.val(edited_relationship.attr("second"));
        rel_type.val(edited_relationship.children('.diamond').children(".diamond_text").text());
        console.log(edited_relationship.children('.diamond').children(".diamond_text"));
    } else {
        $('#new_relationship_title').text("Добавление новой связи");
        $('#btn_new_relationship').text("Добавить!");
    }

    new_relationship_window.modal("toggle");

    rel_first_main.change(function () {
        rel_first_main.children().css("display", "block");
        rel_second_main.children().css("display", "block");
        var first_main_val = rel_first_main.val();
        rel_second_main.children('[value=' + first_main_val + ']').css("display", "none");
    });
    rel_second_main.change(function () {
        rel_first_main.children().css("display", "block");
        rel_second_main.children().css("display", "block");
        var second_main_val = rel_second_main.val();
        rel_first_main.children('[value=' + second_main_val + ']').css("display", "none");
    });
    // --- Действия над формами модального окна ---

    $("#form_new_relationship").submit(function (event) {
        var relationship_id = randInt();
        var first_link = randInt();
        var second_link = randInt();

        var first_main_id = rel_first_main.val();
        var second_main_id = rel_second_main.val();
        var rel_type_val = rel_type.val();
        var rel_desc = rel_description.val();


        if (first_main_id !== "" && second_main_id !== "" && first_main_id[0] !== second_main_id[0]) {
            var edited_relationship = $('.relationship[id="' + edit_rel_id + '"]');
            if ($('div').is(edited_relationship)) {
                edited_relationship.attr('first', first_main_id);
                edited_relationship.attr('second', second_main_id);
                edited_relationship.children('.diamond').children(".diamond_text").text(rel_type_val);
                edited_relationship.children('.desc_diamond').text(rel_desc);
            } else {
                $(".work_zone_container").append(add_relationship_block(relationship_id, rel_type_val, rel_desc, first_main_id, second_main_id));
                var canvas = $(".canvas");
                canvas.append(add_link(relationship_id, first_link));
                canvas.append(add_link(relationship_id, second_link));
                // перерисовка svg
                canvas.html(canvas.html());
            }
            $(this).off(event);
            draggable_box();
            new_relationship_window.modal("toggle");
        } else {
            set_error("Не выбрана одна из сущностей, или выбраны одинаковые сущности!");
        }
        return false;
    });
}


//REMOVE

function remove_main(main_id) {
    $('.main[id="' + main_id + '"]').remove();
    $('.relationship[parent="' + main_id + '"]').remove();

    work_zone_container = $(".work_zone_container");
    attributes = work_zone_container.children('[parent="' + main_id + '"]');
    attributes.each(function (i, elem) {
        $('.attribute[parent="' + $(elem).attr("parent") + '"]').remove();
    });

    canvas = $(".canvas");
    links = canvas.children('[parent="' + main_id + '"]');

    console.log(links);
    links.each(function (i, elem) {
        $('.link[parent="' + $(elem).attr("parent") + '"]').remove();
    });


    draggable_box();
}

function remove_attr(attr_id) {
    $('.attribute[id="' + attr_id + '"]').remove();
    $('.link[id="' + attr_id + '"]').remove();
    draggable_box();
}

function remove_relationship(rel_id) {
    $('.relationship[id="' + rel_id + '"]').remove();
    $('.link[parent="' + rel_id + '"]').remove();
    draggable_box();
}


// SAVE

function save_diagram() {
    var Out_JSON = {};
    var mains = {};
    var attributes = {};
    var relationships = {};
    var links = {};

    var work_zone_container = $(".work_zone_container");

    var main = work_zone_container.children('.main');
    main.each(function (i, elem) {
        var id = $(elem).attr('id');
        mains[id] = {};
        mains[id]['position'] = $(elem).offset();
        mains[id]['name'] = $(elem).children('.main_text').text();
    });
    Out_JSON['mains'] = mains;

    var attribute = work_zone_container.children('.attribute');
    attribute.each(function (i, elem) {
        var id = $(elem).attr('id');
        attributes[id] = {};
        attributes[id]['parent'] = $(elem).attr('parent');
        attributes[id]['data_type'] = $(elem).attr('data_type');
        attributes[id]['len_data'] = $(elem).attr('len_data');
        attributes[id]['primary_key'] = $(elem).attr('primary_key');
        attributes[id]['name'] = $(elem).children('.attribute_text').text();
        attributes[id]['position'] = $(elem).offset();
    });
    Out_JSON['attributes'] = attributes;

    var relationship = work_zone_container.children('.relationship');
    relationship.each(function (i, elem) {
        var id = $(elem).attr('id');
        relationships[id] = {};
        relationships[id]['first'] = $(elem).attr('first');
        relationships[id]['second'] = $(elem).attr('second');
        relationships[id]['rel_type'] = $(elem).children('.diamond').children('.diamond_text').text();
        relationships[id]['rel_description'] = $(elem).children('.desc_diamond').text();
        relationships[id]['position'] = $(elem).offset();
    });
    Out_JSON['relationships'] = relationships;

    var link = $('.canvas').children('.link');
    link.each(function (i, elem) {
        var id = $(elem).attr('id');
        links[id] = {};
        links[id]['parent'] = $(elem).attr('parent');
        links[id]['position'] = {
            'x1': Number($(elem).attr('x1')),
            'y1': Number($(elem).attr('y1')),
            'x2': Number($(elem).attr('x2')),
            'y2': Number($(elem).attr('y2'))
        };
    });
    Out_JSON['links'] = links;
    Out_JSON['diagram_id'] = get_diagram_id();
    Out_JSON['diagram_name'] = $('div#diagram_name').text();

    // console.log(JSON.stringify(Out_JSON));

    $.ajax({
        type: "POST",
        url: "editor/save.php",
        data: Out_JSON
    }).done(function (msg) {
        console.log("Изменения в диаграмме id:'" + msg + "' сохранены");
    });

    return Out_JSON;
}



function save_diagram_img() {

    setTimeout(function () {

        var img = html2canvas(document.getElementById('screenshot_zone')).then(function (canvas) {

            var REQUEST_DATA = {};
            img = canvas.toDataURL("image/png", 1);

            REQUEST_DATA['image'] = img.replace(/^data:image\/(png|jpg);base64,/, "");
            REQUEST_DATA['diagram_id'] = get_diagram_id();

            $.ajax({
                type: "POST",
                url: "save_diagram_img.php",
                async: false,
                data: REQUEST_DATA,
                success: function () {
                    console.log("Снимок диаграммы сохранен!");
                }
            });
        });

    }, 600);
}

function open_screenshot_window() {

    save_diagram_img();
    var get_diagram_img = $("#get_diagram_img");
    var preview_image = $('#preview_image');
    var download_diagram_img = $('#download_diagram_img');


    get_diagram_img.modal('toggle');

    preview_image.attr("src", "user_data/"+ get_diagram_id() +".png");
    download_diagram_img.attr("href", "user_data/"+ get_diagram_id() +".png");
}


//LOAD

function load_diagram() {
    var Out_JSON = {};
    Out_JSON['diagram_id'] = get_diagram_id();

    $.ajax({
        type: "POST",
        url: "editor/load.php",
        data: Out_JSON
    }).done(function (msg) {
        var JSON_answer = JSON.parse(msg);

        $('#diagram_name').text(JSON_answer['diagram_name']);

        var result = JSON.parse(msg);

        var mains = result['mains'];
        var attributes = result['attributes'];
        var relationships = result['relationships'];
        var links = result['links'];


        jQuery.each(mains, function (i, elem) {
            var position = JSON.parse(elem['position']);

            $(".work_zone_container").append(add_main_block(elem['main_id'], elem['name']));
            $(".main#" + elem['main_id']).offset(position);
        });

        jQuery.each(attributes, function (i, elem) {
            var position = JSON.parse(elem['position']);

            $(".work_zone_container").append(add_attribute_block(elem['attribute_id'], elem['parent_id'], elem['name'], elem['data_type'], elem['data_len'], Boolean(elem['is_PK'])));
            $(".attribute#" + elem['attribute_id']).offset(position);
        });

        jQuery.each(relationships, function (i, elem) {
            var position = JSON.parse(elem['position']);

            $(".work_zone_container").append(add_relationship_block(elem['relationship_id'], elem['rel_type'], elem['rel_description'], elem['first_main'], elem['second_main']));
            $(".relationship#" + elem['relationship_id']).offset(position);
        });

        jQuery.each(links, function (i, elem) {
            var canvas = $(".canvas");
            canvas.append(add_link(elem['parent_id'], elem['link_id']));
            canvas.html(canvas.html());
        });
        draggable_box();

        save_diagram_img();
    });
}


// MSSQL FUNCTIONS

function mssql_connect_check() {
    var REQUEST_DATA = {};

    REQUEST_DATA['type'] = 'check';

    var result = $.ajax({
        type: "POST",
        url: "editor/MSSQL_Connect.php",
        async: false,
        data: REQUEST_DATA
    }).responseText;

    return JSON.parse(result)
}

function mssql_connect(server_name, database, login, password) {
    var REQUEST_DATA = {};

    REQUEST_DATA['type'] = 'connect';
    REQUEST_DATA['server_name'] = server_name;
    REQUEST_DATA['database'] = database;
    REQUEST_DATA['login'] = login;
    REQUEST_DATA['password'] = password;

    var result = $.ajax({
        type: "POST",
        url: "editor/MSSQL_Connect.php",
        async: false,
        data: REQUEST_DATA
    }).responseText;
    return JSON.parse(result)
}

// mssql_connect('msuniversity.ru,1450', "Polenok", "Polenok", 'koneloP');


function mssql_disconnect() {
    var REQUEST_DATA = {};

    REQUEST_DATA['type'] = 'disconnect';

    var result = $.ajax({
        type: "POST",
        url: "editor/MSSQL_Connect.php",
        async: false,
        data: REQUEST_DATA
    }).responseText;

    return JSON.parse(result)
}

function mssql_query(sql_query) {
    var REQUEST_DATA = {};

    REQUEST_DATA['type'] = 'query';
    REQUEST_DATA['query'] = sql_query;

    var result = $.ajax({
        type: "POST",
        url: "editor/MSSQL_Connect.php",
        async: false,
        data: REQUEST_DATA
    }).responseText;

    return JSON.parse(result)
}

// console.log(mssql_query("SELECT * FROM INFORMATION_SCHEMA.TABLES"));


function open_server_connect_window() {

    function swich_connect_status() {

        var check = mssql_connect_check();
        var btn_disconnect = $('#btn_disconnect');

        if (check['connect'] === false) {
            mssql_connect_description.text("Подключение не установлено, пожалуйста пройдите авторизацию, чтобы продолжить создание физической модели.");
            btn_disconnect.css({"display" : "none"});
        } else {
            mssql_connect_description.text('Установлено соединение! База данных:\" '+ check['database'] +' \" на сервере:\"' + check['server'] + '\"');
            btn_disconnect.css({"display" : "block"});
        }
        return check['connect'];
    }

    function disconnect() {

        $('#btn_disconnect').off('click').on('click', function () {
            mssql_disconnect();
            swich_connect_status();
        });

    }

    var data_diagram = save_diagram();

    var get_sql_code_window = $("#get_sql_code");
    var mssql_connect_window = $('#new_mssql_connect');
    get_sql_code_window.modal("toggle");

    var sql_code_viewer = $('#sql_code_viewer');
    sql_code_viewer.html('');

    var mssql_connect_description = $('#mssql_connect_description');

    swich_connect_status();

    disconnect();


    function format_server_result(server_result) {

        function get_attributes_list(server_result) {
            var columns = [];
            $.each(server_result[0], function (key, value) {
                columns.push({title: key});
            });
            return columns;
        }

        var columns =  get_attributes_list(server_result);
        var dataset = [];

        $.each(server_result, function (index, dataline_obj) {

            var dataline = [];

            $.each(dataline_obj, function (key, value) {
                if (typeof value === "object") {

                    var blkstr = "";

                    $.each(value, function(idx2,val2) {
                        blkstr += idx2 + ":" + val2 + "\n";
                    });

                    dataline.push(blkstr);
                }else{
                    dataline.push(value);
                }
            });
            dataset.push(dataline);
        });

        return {columns: columns, dataset: dataset};
    }

    function connect_and_insert_to_server(editor, result_viewer){

        $('#insert_sql_to_server').off('click').on('click', function (event) {


            if (mssql_connect_check()['connect'] === false) {

                get_sql_code_window.modal("toggle");
                mssql_connect_window.modal("toggle");

                $('#form_new_mssql_connect').off('submit').submit(function (event) {

                    event.preventDefault();

                    var server_name = $('#mssql_server');
                    var login = $('#mssql_login');
                    var password = $('#mssql_password');
                    var database = $('#database_name');

                    var server_name_value = server_name.val();
                    var login_value = login.val();
                    var password_value = password.val();
                    var database_value = database.val();

                    if (server_name_value !== "" && login_value !== "" && password_value !== "" && database_value !== ""){

                        try{
                            var connect = mssql_connect(server_name_value, database_value, login_value, password_value);
                            console.log(connect);
                        }catch (e) {
                            console.log(e);
                        }
                        

                        if (connect['code'] === 18456){

                            login.addClass('is-invalid');
                            password.addClass('is-invalid');
                            database.addClass('is-invalid');
                            $('#form_new_mssql_connect').addClass('was-validated');

                        }else{

                            swich_connect_status();

                            get_sql_code_window.modal("toggle");
                            mssql_connect_window.modal("toggle");
                        }
                    }else{
                        server_name.addClass('is-invalid');
                        $('#form_new_mssql_connect').addClass('was-validated');
                    }

                    return false;
                });

            }else{

                SQL_str = editor.getValue();

                swich_connect_status();

                try{
                    var result = mssql_query(SQL_str);
                    console.log(result);
                }catch (err) {
                    console.log(err)
                }

                if (result && result.length !== 0){

                    result_viewer.insert(result['message'] + "\n");



                    if (typeof result['result'] !== "undefined" && result['result'].length !== 0) {

                        var formatted_server_result = format_server_result(result['result']);


                        $('#result_table_wrapper').remove();
                        $("#output_block").append("<table id=\"result_table\" class=\"table table-striped table-bordered\" style=\"width:80%\"></table>");


                        $('#result_table').dataTable( {
                            'data': formatted_server_result['dataset'],
                            'columns': formatted_server_result['columns'],
                            "scrollX": true,
                            'language': {
                                'url': "../lib/datatables/russian.json"
                            }
                        });
                    }

                }else{
                    result_viewer.insert("Сервер вернул пустой ответ!\n");
                }

            }


        });
    }


    function get_sql_code(data_diagram){

        function get_main_PK(data_diagram, main_id){
            var result;

            jQuery.each(data_diagram['attributes'], function (attr_index, attribute) {

                if (attribute['primary_key'] === 'true' && attribute['parent'] === String(main_id)){
                    result = attribute;
                    return false;
                }
            });
            return result;
        }

        var RESULT_SQL_CODE = [];

        jQuery.each(data_diagram['mains'], function (main_index, main) {

            var SQL_str = "";
            var all_attributes = [];

            SQL_str += "CREATE TABLE " + main['name'] + " (\n";

            jQuery.each(data_diagram['attributes'], function (attr_index, attribute) {

                var PK_str = "";
                var attr_str = "";

                if (attribute['parent'] === main_index) {
                    if (attribute['primary_key'] === "true") {
                        PK_str += "  " + attribute['name'] + " " + attribute['data_type'] + "(" + attribute['len_data'] + ")" + " " + "NOT NULL CONSTRAINT PK_" + attribute['name'] + " PRIMARY KEY(" + attribute['name'] + ")";
                        all_attributes.push(PK_str);
                    } else {
                        attr_str += "  " + attribute['name'] + " " + attribute['data_type'] + "(" + attribute['len_data'] + ")";
                        all_attributes.push(attr_str);
                    }
                }

            });

            jQuery.each(data_diagram['relationships'], function (rel_index, relationship) {

                var attr_str = "";

                if(relationship['second'] === main_index){
                    var first_main_PK = get_main_PK(data_diagram, relationship['first']),
                        first_main_PK_name = first_main_PK['name'],
                        first_main_PK_type = first_main_PK['data_type'],
                        first_main_PK_len = first_main_PK['len_data'];

                    var first_main_name = data_diagram['mains'][relationship['first']]['name'],
                        second_main_name = data_diagram['mains'][relationship['second']]['name'];

                    attr_str += "  " + first_main_PK_name + "_FK " + first_main_PK_type + "(" + first_main_PK_len + "), \n  " +
                        "CONSTRAINT FK_" + first_main_name + "_" + second_main_name + " FOREIGN KEY (" +  first_main_PK_name +
                        "_FK) REFERENCES " + first_main_name + "(" + first_main_PK_name + ")";

                    all_attributes.push(attr_str);
                }

            });

            SQL_str += all_attributes.join(',\n') + "\n);\n\n";

            RESULT_SQL_CODE.push(SQL_str);
        });

        return RESULT_SQL_CODE;
    }



    var SQL_str = get_sql_code(data_diagram).join('\n');

    var editor = ace.edit("sql_code_editor", {
        theme: "ace/theme/sqlserver",
        mode: "ace/mode/sqlserver",
        maxLines: 20,
        wrap: true,
        autoScrollEditorIntoView: true
    });
    editor.session.setValue("");
    editor.insert(SQL_str);


    var result_viewer = ace.edit("result_viewer", {
        theme: "ace/theme/sqlserver",
        mode: "ace/mode/sqlserver",
        maxLines: 10,
        wrap: true,
        readOnly: true,
        autoScrollEditorIntoView: true
    });
    result_viewer.session.setValue("");


    connect_and_insert_to_server(editor, result_viewer);

}

$(document).ready(function () {

});