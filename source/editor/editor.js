//SYSTEM

function set_error(text) {
    $(".error").text(text);
    return false;
}

function get_diagram_id() {
    let url_string = window.location.href;
    let url = new URL(url_string);
    return url.searchParams.get("edit");
}


//DRAGGABLE

function setting_link() {
    let work_zone_container = $(".work_zone_container");
    let main = work_zone_container.children('.main');
    main.each(function (i, elem) {
        let main_id = $(elem).attr("id");
        let main = $("#" + main_id);

        let attribute = work_zone_container.children('[parent="' + main_id + '"]');
        let first_relationship = work_zone_container.children('.relationship[first=' + main_id + ']');
        let second_relationship = work_zone_container.children('.relationship[second=' + main_id + ']');
        let relationship = $.extend(first_relationship, second_relationship);

        attribute.each(function (i, elem) {
            let attribute_id = $(elem).attr("id");
            let attribute = $('.attribute[id="' + attribute_id + '"]');
            let link = $('.link[id="' + attribute_id + '"]');
            let main_pos = main.position();
            let attribute_pos = attribute.position();
            link.attr({
                "x1": attribute_pos["left"] + Number(attribute.innerWidth() / 2),
                "y1": attribute_pos["top"] + Number(attribute.innerHeight() / 2),
                "x2": main_pos["left"] + Number(main.innerWidth() / 2),
                "y2": main_pos["top"] + Number(main.innerHeight() / 2)
            });
        });

        relationship.each(function (i, elem) {
            let relationship_id = $(elem).attr("id");
            let relationship = $('.relationship[id="' + relationship_id + '"]');

            let first_main_id = relationship.attr("first");
            let second_main_id = relationship.attr("second");
            let second_main;
            if (main_id === first_main_id) {
                second_main = $("#" + second_main_id);
            } else if (main_id === second_main_id) {
                second_main = $("#" + first_main_id);
            }

            let link = $('.link[parent="' + relationship_id + '"]');
            let main_pos = main.position();
            let second_main_pos = second_main.position();
            let relationship_pos = relationship.position();

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
    let work_zone_container = $(".work_zone_container");
    let main = work_zone_container.children('.main');
    let relationship = work_zone_container.children('.relationship');

    main.each(function (i, elem) {
        let main_id = $(elem).attr("id");
        let attribute = work_zone_container.children('[parent="' + main_id + '"]');

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

// Оппа, посхалочка)))0)
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
    let is_pk = "";
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


function validate_value(change_type = "add", value_type, value) {
    let check_list = {"total_false": 0};

    function check_not_free_value(value) {
        if (value === "" || value === undefined) {
            check_list['check_not_free_value'] = false;
            check_list['total_false'] += 1;
        } else {
            check_list['check_not_free_value'] = true;
        }
    }

    function check_space(value) {
        let pattern = new RegExp('\\s', 'ig');

        if (pattern.test(value)) {
            check_list['check_space'] = false;
            check_list['total_false'] += 1;
        } else {
            check_list['check_space'] = true;
        }
    }

    function check_num_in_start_of_string(value) {
        let pattern = new RegExp('^[0-9]', 'ig');

        if (pattern.test(value)) {
            check_list['check_num_in_start_of_string'] = false;
            check_list['total_false'] += 1;
        } else {
            check_list['check_num_in_start_of_string'] = true;
        }

    }

    function check_uniq_attribute(value) {
        let diagram_info = load_diagram(Number(get_diagram_id()));
        let attributes_name_list = [];

        $.each(diagram_info['attributes'], function (i, elem) {
            attributes_name_list.push(elem['name']);
        });

        if (attributes_name_list.includes(value)) {
            check_list['check_uniq'] = false;
            check_list['total_false'] += 1;
        } else {
            check_list['check_uniq'] = true;
        }
    }

    function check_uniq_main(value) {
        let diagram_info = load_diagram(Number(get_diagram_id()));
        let mains_name_list = [];

        $.each(diagram_info['mains'], function (i, elem) {
            mains_name_list.push(elem['name']);
        });

        if (mains_name_list.includes(value)) {
            check_list['check_uniq'] = false;
            check_list['total_false'] += 1;
        } else {
            check_list['check_uniq'] = true;
        }
    }

    switch (value_type) {
        case 'main': {
            check_not_free_value(value);
            check_space(value);
            check_num_in_start_of_string(value);
            if (change_type === "add") {
                check_uniq_main(value);
            }
            return check_list;
        }
        case 'attribute': {
            check_not_free_value(value);
            check_space(value);
            check_num_in_start_of_string(value);
            if (change_type === "add") {
                check_uniq_attribute(value);
            }
            return check_list;
        }
    }
}


function add_main(edit_main_id = NaN) {
    let main_id = randInt();

    let main_name_label = $('.main_name_label');
    let name_new_main_input = $('input[name="main_name"]');
    let new_diagramm_title = $('#new_diagramm_title');
    let btn_new_main = $('#btn_new_main');

    name_new_main_input.val("");

    let edited_main = $('.main[id="' + edit_main_id + '"]');

    if ($('div').is(edited_main)) {
        new_diagramm_title.text("Изменение сущности");
        main_name_label.text("Название сущности:");
        btn_new_main.text("Изменить");
        name_new_main_input.val(edited_main.children(".main_text").text());
    } else {
        new_diagramm_title.text("Создание новой сущности");
        main_name_label.text("Название новой сущности:");
        btn_new_main.text("Создать");
    }

    var main_edit_window = $("#new_main");
    main_edit_window.modal("toggle");

    name_new_main_input.off('change').on('change', function () {

        let name_new_main = name_new_main_input.val();
        let change_type = "add";

        if ($('div').is(edited_main)) {
            change_type = "change";
        }

        let check_list = validate_value(change_type, 'main', name_new_main);
        let main_invalid_feedback = $('#main_name_invalid_feedback');

        // console.log(check_list);

        if (check_list['total_false'] > 0) {
            let error_list = Array();

            if (!check_list['check_not_free_value']) {
                error_list.push("Название не может быть пустой строкой");
            }

            if (!check_list['check_space']) {
                error_list.push("В названии сущности присутствуют пробельные символы");
            }

            if (!check_list['check_num_in_start_of_string']) {
                error_list.push("Название не может начинаться с цифры");
            }

            if (!check_list['check_uniq'] && change_type === 'add') {
                error_list.push("Название не уникально");
            }

            let error_str = error_list.join("<br>");

            main_invalid_feedback.removeClass('valid-feedback');
            main_invalid_feedback.addClass('invalid-feedback');
            main_invalid_feedback.html(error_str);
            name_new_main_input.removeClass('is-valid');
            name_new_main_input.addClass('is-invalid');

            $("#btn_new_main").off('click');

        } else {
            main_invalid_feedback.removeClass('invalid-feedback');
            main_invalid_feedback.addClass('valid-feedback');
            main_invalid_feedback.html("Название допустимо");
            name_new_main_input.removeClass('is-invalid');
            name_new_main_input.addClass('is-valid');

            $("#btn_new_main").off('click').on('click', function () {

                let name_new_main = name_new_main_input.val();
                main_edit_window.modal("toggle");

                if (isNaN(edit_main_id)) {
                    $(".work_zone_container").append(add_main_block(main_id, name_new_main));
                } else {
                    $("#" + edit_main_id).children(".main_text").text(name_new_main);
                }
                draggable_box();
            });
        }
    });
}

// TODO: Сделать проверку заполненности длины значения
function add_attribute(main_id, edit_attr_id = NaN) {

    function show_data_len_input(input_attr_data_type) {

        let input_len_data_type_group = $('.attribute_data_len');
        let except_data_type = [
            "int",
            "money",
            "date"
        ];
        let data_type = input_attr_data_type.val();

        if (except_data_type.indexOf(data_type) !== -1) {
            input_len_data_type_group.css("display", "none");
            return false
        } else {
            input_len_data_type_group.css("display", "flex");
            return true
        }
    }

    function validate_attribute_name(edit_type, check_list) {
        /**
         * Валидация названия атрибута
         *
         * @param {string} edit_type - тип редактирования элемента
         * @param {object} check_list - список параметров значения названия атрибута, прошедших валидацию
         * @returns {boolean}
         */
        if (check_list['total_false'] > 0) {
            let error_list = Array();

            if (!check_list['check_not_free_value']) {
                error_list.push("Название не может быть пустой строкой");
            }

            if (!check_list['check_space']) {
                error_list.push("В названии сущности присутствуют пробельные символы");
            }

            if (!check_list['check_num_in_start_of_string']) {
                error_list.push("Название не может начинаться с цифры");
            }

            if (!check_list['check_uniq'] && edit_type === 'add') {
                error_list.push("Название не уникально");
            }

            let error_str = error_list.join("<br>");

            attribute_invalid_feedback.removeClass('valid-feedback');
            attribute_invalid_feedback.addClass('invalid-feedback');
            attribute_invalid_feedback.html(error_str);
            input_name_attribute.removeClass('is-valid');
            input_name_attribute.addClass('is-invalid');
            return false;

        } else {
            attribute_invalid_feedback.removeClass('invalid-feedback');
            attribute_invalid_feedback.addClass('valid-feedback');
            attribute_invalid_feedback.html("Название допустимо");
            input_name_attribute.removeClass('is-invalid');
            input_name_attribute.addClass('is-valid');
            return true;
        }
    }

    function check_uniq_PK() {
        let PK_invalid_feedback = $('#PK_invalid_feedback');
        let diagram_data = get_diagram_info();

        function check() {
            let _PK = null;
            jQuery.each(diagram_data['attributes'], function (index, elem) {
                if (elem['primary_key'] === 'true' && Number(index) !== edit_attr_id && Number(elem['parent']) === main_id) {
                    _PK = Number(index);
                    return false;
                }
            });
            if (_PK !== null && _PK !== edit_attr_id) {
                primary_key_checkbox.prop('disabled', true);
                PK_invalid_feedback.html("Для данной сущности уже существует атрибут с превичным ключом");
            } else {
                primary_key_checkbox.prop('disabled', false);
                PK_invalid_feedback.html("");
            }
        }

        check();
        primary_key_checkbox.off('change').on('change', check);
    }

    function send_form() {

        let attribute_name = input_name_attribute.val();
        let data_type = input_attr_data_type.val();
        let primary_key = primary_key_checkbox.prop("checked");

        let len_data;
        console.log(show_data_len_input(input_attr_data_type));
        if (show_data_len_input(input_attr_data_type)) {
            len_data = input_len_data_type.val();
        } else {
            len_data = null;
        }

        let check_list = validate_value(edit_type, 'attribute', attribute_name);
        if (validate_attribute_name(edit_type, check_list)) {
            new_attribute_window.modal("toggle");

            if ($('div').is(edited_attribute)) {

                let edited_attribute_text = edited_attribute.children(".attribute_text");
                edited_attribute_text.text(attribute_name);
                edited_attribute.attr("data_type", data_type);
                edited_attribute.attr("len_data", len_data);
                edited_attribute.attr("primary_key", primary_key);

                if (primary_key === true) {

                    edited_attribute_text.addClass("is_primary_key");

                } else {

                    edited_attribute_text.removeClass("is_primary_key");
                }
            } else {

                $(".work_zone_container").append(add_attribute_block(attribute_id, main_id, attribute_name, data_type, len_data, primary_key));
                let canvas = $(".canvas");
                canvas.append(add_link(main_id, attribute_id));
                // перерисовка svg
                canvas.html(canvas.html());
                draggable_box();
            }
        }
    }

    let attribute_id = randInt();
    let edited_attribute = $('.attribute[id="' + edit_attr_id + '"]');

    let new_attribute_window = $("#new_attribute");
    let new_attribute_title = $('#new_attribute_title');
    let attribute_name_label = $('.attribute_name_label');

    let input_name_attribute = $('input[name="attribute_name"]');
    let attribute_invalid_feedback = $('#attribute_name_invalid_feedback');
    let input_attr_data_type = $('select[name="attr_datatype"]');
    let input_len_data_type = $('input[name="attr_data_len"]');
    let primary_key_checkbox = $('input[name="primary_key"]');
    let button_new_attribute = $('#btn_new_attribute');

    new_attribute_window.modal("toggle");
    input_name_attribute.val("");
    input_name_attribute.removeClass('is-valid');
    input_name_attribute.removeClass('is-invalid');
    input_attr_data_type.empty();
    input_len_data_type.val(0);
    primary_key_checkbox.prop('checked', false);
    input_attr_data_type.append(
        '<option value="int">int</option>' +
        '<option value="char">char</option>' +
        '<option value="float">float</option>' +
        '<option value="money">money</option>' +
        '<option value="varchar">varchar</option>' +
        '<option value="date">date</option>'
    );

    let edit_type;
    if ($('div').is(edited_attribute)) {

        edit_type = "change";

        new_attribute_title.text("Изменение атрибута");
        attribute_name_label.text("Название атрибута:");
        button_new_attribute.text("Изменить");
        input_name_attribute.val(edited_attribute.children(".attribute_text").text());
        input_attr_data_type.val(edited_attribute.attr("data_type"));
        input_len_data_type.val(edited_attribute.attr("len_data"));

        let is_PK = (edited_attribute.attr("primary_key") === 'true');
        primary_key_checkbox.prop('checked', is_PK);

    } else {
        edit_type = "add";

        new_attribute_title.text("Добавление нового атрибута");
        attribute_name_label.text("Название нового атрибута:");
        button_new_attribute.text("Добавить");
    }

    input_name_attribute.off('change').on('change', function () {
        let attribute_name = input_name_attribute.val();
        let check_list = validate_value(edit_type, 'attribute', attribute_name);

        validate_attribute_name(edit_type, check_list);
    });

    show_data_len_input(input_attr_data_type);
    input_attr_data_type.off('change').on('change', function () {
        show_data_len_input(input_attr_data_type)
    });

    check_uniq_PK();

    button_new_attribute.off('click').on('click', send_form);
}


function add_relationship(edit_rel_id) {
    let new_relationship_window = $("#new_relationship");

    // инициализация и очистка форм
    let rel_first_main = $('select[name="rel_first_main"]');
    let rel_second_main = $('select[name="rel_second_main"]');
    let rel_type = $('select[name="rel_type"]');
    let rel_description = $('input[name="rel_description"]');

    rel_first_main.empty();
    rel_second_main.empty();
    rel_type.empty();
    rel_description.val("");

    set_error("");

    // Действия над формами модального окна
    let work_zone_container = $(".work_zone_container");
    let main = work_zone_container.children('.main');

    main.each(function (i, elem) {
        let main_name = $(elem).children(".main_text").text();
        let main_id = $(elem).attr("id");
        rel_first_main.append('<option value="' + main_id + '">' + main_name + '</option>');
        rel_second_main.append('<option value="' + main_id + '">' + main_name + '</option>');
    });

    rel_type.append(
        '<option value="1:1">1:1</option>' +
        '<option value="1:N">1:N</option>' +
        '<option value="N:N">N:N</option>'
    );

    let edited_relationship = $('.relationship[id="' + edit_rel_id + '"]');

    if ($('div').is(edited_relationship)) {
        $('#new_relationship_title').text("Изменение связи");
        $('#btn_new_relationship').text("Изменить");
        rel_description.val(edited_relationship.children(".desc_diamond").text());
        rel_first_main.val(edited_relationship.attr("first"));
        rel_second_main.val(edited_relationship.attr("second"));
        rel_type.val(edited_relationship.children('.diamond').children(".diamond_text").text());
        console.log(edited_relationship.children('.diamond').children(".diamond_text"));
    } else {
        $('#new_relationship_title').text("Добавление новой связи");
        $('#btn_new_relationship').text("Добавить");
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
        let relationship_id = randInt();
        let first_link = randInt();
        let second_link = randInt();

        let first_main_id = rel_first_main.val();
        let second_main_id = rel_second_main.val();
        let rel_type_val = rel_type.val();
        let rel_desc = rel_description.val();

        if (first_main_id !== "" && second_main_id !== "" && first_main_id[0] !== second_main_id[0]) {
            let edited_relationship = $('.relationship[id="' + edit_rel_id + '"]');

            if ($('div').is(edited_relationship)) {
                edited_relationship.attr('first', first_main_id);
                edited_relationship.attr('second', second_main_id);
                edited_relationship.children('.diamond').children(".diamond_text").text(rel_type_val);
                edited_relationship.children('.desc_diamond').text(rel_desc);
            } else {
                $(".work_zone_container").append(add_relationship_block(relationship_id, rel_type_val, rel_desc, first_main_id, second_main_id));
                let canvas = $(".canvas");
                canvas.append(add_link(relationship_id, first_link));
                canvas.append(add_link(relationship_id, second_link));
                // перерисовка svg
                canvas.html(canvas.html());
            }
            $(this).off(event);
            draggable_box();
            new_relationship_window.modal("toggle");
        } else {
            set_error("Не выбрана одна из сущностей, или выбраны одинаковые сущности");
        }
        return false;
    });
}


//REMOVE

function remove_main(main_id) {
    $('.main[id="' + main_id + '"]').remove();
    $('.relationship[parent="' + main_id + '"]').remove();

    let work_zone_container = $(".work_zone_container");
    let attributes = work_zone_container.children('[parent="' + main_id + '"]');

    let relationships = work_zone_container.children('.relationship');

    console.log(relationships);

    relationships.each(function (i, elem) {

        if (Number($(elem).attr('first')) === main_id || Number($(elem).attr('second')) === main_id) {
            remove_relationship($(elem).attr('id'));
        }
    });


    attributes.each(function (i, elem) {
        $('.attribute[parent="' + $(elem).attr("parent") + '"]').remove();
    });


    let canvas = $(".canvas");
    let links = canvas.children('[parent="' + main_id + '"]');

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
function get_diagram_info() {

    let Out_JSON = {};
    let mains = {};
    let attributes = {};
    let relationships = {};
    let links = {};

    let work_zone_container = $(".work_zone_container");
    let main = work_zone_container.children('.main');

    main.each(function (i, elem) {
        let id = $(elem).attr('id');
        mains[id] = {};
        mains[id]['position'] = $(elem).offset();
        mains[id]['name'] = $(elem).children('.main_text').text();
    });

    Out_JSON['mains'] = mains;

    let attribute = work_zone_container.children('.attribute');

    attribute.each(function (i, elem) {
        let id = $(elem).attr('id');
        attributes[id] = {};
        attributes[id]['parent'] = $(elem).attr('parent');
        attributes[id]['data_type'] = $(elem).attr('data_type');
        attributes[id]['len_data'] = $(elem).attr('len_data');
        attributes[id]['primary_key'] = $(elem).attr('primary_key');
        attributes[id]['name'] = $(elem).children('.attribute_text').text();
        attributes[id]['position'] = $(elem).offset();
    });

    Out_JSON['attributes'] = attributes;

    let relationship = work_zone_container.children('.relationship');

    relationship.each(function (i, elem) {
        let id = $(elem).attr('id');
        relationships[id] = {};
        relationships[id]['first'] = $(elem).attr('first');
        relationships[id]['second'] = $(elem).attr('second');
        relationships[id]['rel_type'] = $(elem).children('.diamond').children('.diamond_text').text();
        relationships[id]['rel_description'] = $(elem).children('.desc_diamond').text();
        relationships[id]['position'] = $(elem).offset();
    });

    Out_JSON['relationships'] = relationships;

    let link = $('.canvas').children('.link');

    link.each(function (i, elem) {
        let id = $(elem).attr('id');
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

    return Out_JSON;
}


function save_diagram() {
    let diagram_data = get_diagram_info();

    diagram_data['command'] = "save";
    
    $.ajax({
        type: "POST",
        url: "editor/save.php",
        data: diagram_data
    }).done(function (msg) {
        let notification_window = $('.toast');
        let notification_window_text = $('.toast-body');

        notification_window_text.html("Диаграмма успешно сохранена");
        notification_window.toast("show");
        console.log("Изменения в диаграмме id:'" + msg + "' сохранены");
    });

    return diagram_data;
}


function save_diagram_img() {

    setTimeout(function () {
        let img = html2canvas(document.getElementById('screenshots_zone')).then(function (canvas) {
            let REQUEST_DATA = {};
            img = canvas.toDataURL("image/png", 1);

            REQUEST_DATA['image'] = img;
            REQUEST_DATA['diagram_id'] = get_diagram_id();

            $.ajax({
                type: "POST",
                url: "editor/save_diagram_img.php",
                async: false,
                data: REQUEST_DATA,
                success: function () {
                    console.log("Снимок диаграммы сохранен");
                }
            }).done(function (img) {
                // console.log(img);
                let image_path = "user_data/" + img;

                let preview_image = $('#preview_image');
                preview_image.attr('src', image_path);

                let download_diagram_img = $('#download_diagram_img');
                download_diagram_img.attr('href', image_path);
            });
        });
    }, 300);
}


function open_screenshot_window() {
    save_diagram_img();

    let get_diagram_img = $("#get_diagram_img");
    get_diagram_img.modal('toggle');
}

//LOAD

function load_diagram(diagram_id) {
    let Out_JSON = {};

    if (typeof diagram_id === "number") {

        Out_JSON['diagram_id'] = diagram_id;

        let result = $.ajax({
            type: "POST",
            url: "editor/load.php",
            async: false,
            data: Out_JSON
        }).responseText;

        return JSON.parse(result);
    } else {
        Out_JSON['diagram_id'] = get_diagram_id();

        $.ajax({
            type: "POST",
            url: "editor/load.php",
            data: Out_JSON
        }).done(function (msg) {
            let JSON_answer = JSON.parse(msg);

            $('#diagram_name').text(JSON_answer['diagram_name']);

            let result = JSON.parse(msg);

            let mains = result['mains'];
            let attributes = result['attributes'];
            let relationships = result['relationships'];
            let links = result['links'];

            jQuery.each(mains, function (i, elem) {
                let position = JSON.parse(elem['position']);

                $(".work_zone_container").append(add_main_block(elem['main_id'], elem['name']));
                $(".main#" + elem['main_id']).offset(position);
            });

            jQuery.each(attributes, function (i, elem) {
                let position = JSON.parse(elem['position']);

                $(".work_zone_container").append(add_attribute_block(elem['attribute_id'], elem['parent_id'], elem['name'], elem['data_type'], elem['data_len'], Boolean(elem['is_PK'])));
                $(".attribute#" + elem['attribute_id']).offset(position);
            });

            jQuery.each(relationships, function (i, elem) {
                let position = JSON.parse(elem['position']);

                $(".work_zone_container").append(add_relationship_block(elem['relationship_id'], elem['rel_type'], elem['rel_description'], elem['first_main'], elem['second_main']));
                $(".relationship#" + elem['relationship_id']).offset(position);
            });

            jQuery.each(links, function (i, elem) {
                let canvas = $(".canvas");
                canvas.append(add_link(elem['parent_id'], elem['link_id']));
                canvas.html(canvas.html());
            });
            draggable_box();

            save_diagram_img();

            // console.log(result);
        });
    }
}


// MSSQL FUNCTIONS
function mssql_connect_check() {
    let REQUEST_DATA = {};

    REQUEST_DATA['type'] = 'check';

    let result = $.ajax({
        type: "POST",
        url: "editor/MSSQL_Connect.php",
        async: false,
        data: REQUEST_DATA
    }).responseText;

    return JSON.parse(result)
}


function mssql_connect(server_name, database, login, password) {
    let REQUEST_DATA = {};

    REQUEST_DATA['type'] = 'connect';
    REQUEST_DATA['server_name'] = server_name;
    REQUEST_DATA['database'] = database;
    REQUEST_DATA['login'] = login;
    REQUEST_DATA['password'] = password;

    let result = $.ajax({
        type: "POST",
        url: "editor/MSSQL_Connect.php",
        async: false,
        data: REQUEST_DATA
    }).responseText;

    return JSON.parse(result)
}


function mssql_disconnect() {
    let REQUEST_DATA = {};

    REQUEST_DATA['type'] = 'disconnect';

    let result = $.ajax({
        type: "POST",
        url: "editor/MSSQL_Connect.php",
        async: false,
        data: REQUEST_DATA
    }).responseText;

    return JSON.parse(result)
}


function mssql_query(sql_query) {
    let REQUEST_DATA = {};

    REQUEST_DATA['type'] = 'query';
    REQUEST_DATA['query'] = sql_query;

    let result = $.ajax({
        type: "POST",
        url: "editor/MSSQL_Connect.php",
        async: false,
        data: REQUEST_DATA
    }).responseText;

    return JSON.parse(result)
}


function open_server_connect_window() {

    function switch_connect_status() {

        let check = mssql_connect_check();
        let btn_disconnect = $('#btn_disconnect');

        if (check['connect'] === false) {
            mssql_connect_description.text("Подключение не установлено, пожалуйста пройдите авторизацию, чтобы продолжить создание физической модели.");
            btn_disconnect.css({"display": "none"});
        } else {
            mssql_connect_description.text('Установлено соединение! База данных: \"' + check['database'] + '\" на сервере: \"' + check['server'] + '\"');
            btn_disconnect.css({"display": "block"});
        }
        return check['connect'];
    }


    function disconnect() {
        $('#btn_disconnect').off('click').on('click', function () {
            mssql_disconnect();
            switch_connect_status();
        });

    }


    function format_server_result(server_result) {

        function get_attributes_list(server_result) {
            let columns = [];
            $.each(server_result[0], function (key) {
                columns.push({title: key});
            });
            return columns;
        }

        let columns = get_attributes_list(server_result);
        let dataset = [];

        $.each(server_result, function (index, dataline_obj) {
            let dataline = [];

            $.each(dataline_obj, function (key, value) {
                if (typeof value === "object") {
                    let blkstr = "";

                    $.each(value, function (idx2, val2) {
                        blkstr += idx2 + ":" + val2 + "\n";
                    });

                    dataline.push(blkstr);
                } else {
                    dataline.push(value);
                }
            });
            dataset.push(dataline);
        });
        return {columns: columns, dataset: dataset};
    }


    function connect_and_insert_to_server(editor, result_viewer) {
        $('#insert_sql_to_server').off('click').on('click', function () {

            if (mssql_connect_check()['connect'] === false) {
                get_sql_code_window.modal("toggle");
                mssql_connect_window.modal("toggle");

                $('#form_new_mssql_connect').off('submit').submit(function (event) {

                    event.preventDefault();

                    let server_name = $('#mssql_server');
                    let login = $('#mssql_login');
                    let password = $('#mssql_password');
                    let database = $('#database_name');

                    let server_name_value = server_name.val();
                    let login_value = login.val();
                    let password_value = password.val();
                    let database_value = database.val();

                    if (server_name_value !== "" && login_value !== "" && password_value !== "" && database_value !== "") {
                        try {
                            let connect = mssql_connect(server_name_value, database_value, login_value, password_value);
                            console.log(connect);

                            if (connect['code'] === 18456) {
                                login.addClass('is-invalid');
                                password.addClass('is-invalid');
                                database.addClass('is-invalid');
                                $('#form_new_mssql_connect').addClass('was-validated');

                            } else {
                                switch_connect_status();

                                get_sql_code_window.modal("toggle");
                                mssql_connect_window.modal("toggle");
                            }

                        } catch (e) {
                            console.log(e);
                        }
                    } else {
                        server_name.addClass('is-invalid');
                        $('#form_new_mssql_connect').addClass('was-validated');
                    }
                    return false;
                });

            } else {
                SQL_str = editor.getValue();

                switch_connect_status();

                try {
                    let result = mssql_query(SQL_str);
                    console.log(result);

                    if (result && result.length !== 0) {
                        result_viewer.insert(result['message'] + "\n");

                        if (typeof result['result'] !== "undefined" && result['result'].length !== 0) {
                            let formatted_server_result = format_server_result(result['result']);

                            $('#result_table_wrapper').remove();
                            $("#output_block").append("<table id=\"result_table\" class=\"table table-striped table-bordered\" style=\"width:80%\"></table>");

                            $('#result_table').dataTable({
                                'data': formatted_server_result['dataset'],
                                'columns': formatted_server_result['columns'],
                                "scrollX": true,
                                'language': {
                                    'url': "../lib/datatables/russian.json"
                                }
                            });
                        }
                    } else {
                        result_viewer.insert("Сервер вернул пустой ответ\n");
                    }
                } catch (err) {
                    console.log(err)
                }
            }
        });
    }


    function get_sql_code(data_diagram) {

        function get_main_PK(data_diagram, main_id) {
            let result;

            jQuery.each(data_diagram['attributes'], function (attr_index, attribute) {
                if (attribute['primary_key'] === 'true' && attribute['parent'] === String(main_id)) {
                    result = attribute;
                    return false;
                }
            });
            return result;
        }

        let RESULT_SQL_CODE = [];

        jQuery.each(data_diagram['mains'], function (main_index, main) {
            let SQL_str = "";
            let all_attributes = [];

            SQL_str += "CREATE TABLE " + main['name'] + " (\n";

            jQuery.each(data_diagram['attributes'], function (attr_index, attribute) {
                let PK_str = "";
                let attr_str = "";

                if (attribute['parent'] === main_index) {
                    let data_len;
                    if (attribute['data_type'] === "int") {
                        data_len = "";
                    } else {
                        data_len = "(" + attribute['len_data'] + ")";
                    }

                    if (attribute['primary_key'] === "true") {
                        PK_str += "  " + attribute['name'] + " " + attribute['data_type'] + data_len + " " + "NOT NULL CONSTRAINT PK_" + attribute['name'] + " PRIMARY KEY(" + attribute['name'] + ")";
                        all_attributes.push(PK_str);
                    } else {
                        attr_str += "  " + attribute['name'] + " " + attribute['data_type'] + data_len;
                        all_attributes.push(attr_str);
                    }
                }
            });

            jQuery.each(data_diagram['relationships'], function (rel_index, relationship) {
                let attr_str = "";

                if (relationship['second'] === main_index) {
                    let first_main_PK = get_main_PK(data_diagram, relationship['first']),
                        first_main_PK_name = first_main_PK['name'],
                        first_main_PK_type = first_main_PK['data_type'],
                        first_main_PK_len = first_main_PK['len_data'];

                    let first_main_name = data_diagram['mains'][relationship['first']]['name'],
                        second_main_name = data_diagram['mains'][relationship['second']]['name'];

                    attr_str += "  " + first_main_PK_name + "_FK " + first_main_PK_type + "(" + first_main_PK_len + "), \n  " +
                        "CONSTRAINT FK_" + first_main_name + "_" + second_main_name + " FOREIGN KEY (" + first_main_PK_name +
                        "_FK) REFERENCES " + first_main_name + "(" + first_main_PK_name + ")";

                    all_attributes.push(attr_str);
                }
            });

            SQL_str += all_attributes.join(',\n') + "\n);\n\n";

            RESULT_SQL_CODE.push(SQL_str);
        });
        return RESULT_SQL_CODE;
    }


    let data_diagram = save_diagram();

    let get_sql_code_window = $("#get_sql_code");
    let mssql_connect_window = $('#new_mssql_connect');
    get_sql_code_window.modal("toggle");

    let sql_code_viewer = $('#sql_code_viewer');
    sql_code_viewer.html('');

    let mssql_connect_description = $('#mssql_connect_description');

    switch_connect_status();

    disconnect();

    let SQL_str = get_sql_code(data_diagram).join('\n');

    let editor = ace.edit("sql_code_editor",
        {
            theme: "ace/theme/sqlserver",
            mode: "ace/mode/sqlserver",
            maxLines: 20,
            wrap: true,
            autoScrollEditorIntoView: true
        }
    );
    editor.session.setValue("");
    editor.insert(SQL_str);


    let result_viewer = ace.edit("result_viewer",
        {
            theme: "ace/theme/sqlserver",
            mode: "ace/mode/sqlserver",
            maxLines: 10,
            wrap: true,
            readOnly: true,
            autoScrollEditorIntoView: true
        }
    );
    result_viewer.session.setValue("");

    connect_and_insert_to_server(editor, result_viewer);
}

$(document).ready(function () {
    // console.log(mssql_query("SELECT * FROM INFORMATION_SCHEMA.TABLES"));
    // mssql_connect('msuniversity.ru,1450', "Polenok", "Polenok", 'koneloP');
});