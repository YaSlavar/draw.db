//SYSTEM
let ZOOM_DELTA = 1;
let DIAGRAM_TYPE = 'chen';

let EXCEPT_DATA_TYPE_LENGTH = [
    "int",
    "money",
    "date",
    "time"
];

function get_diagram_id() {
    let url_string = window.location.href;
    let url = new URL(url_string);
    return url.searchParams.get("edit");
}

function get_diagram_info() {

    let Out_JSON = {};
    let mains = {};
    let attributes = {};
    let relationships = {};
    let links = {};

    let work_zone_container = $(".work_zone_container");
    let work_zone_position = work_zone_container.offset();

    let main = work_zone_container.find('.main');

    main.each(function (i, elem) {
        let id = $(elem).attr('id');
        mains[id] = {};
        mains[id]['position'] = {
            "top": $(elem).offset().top - work_zone_position.top,
            "left": $(elem).offset().left - work_zone_position.left,
        };
        // $(elem).offset();
        mains[id]['name'] = $(elem).children('.main_name').text();
    });

    Out_JSON['mains'] = mains;

    let attribute = work_zone_container.find('.attribute');

    attribute.each(function (i, elem) {
        let id = $(elem).attr('id');
        attributes[id] = {};
        attributes[id]['parent'] = $(elem).attr('parent');
        attributes[id]['data_type'] = $(elem).attr('data_type');
        attributes[id]['len_data'] = $(elem).attr('len_data');
        attributes[id]['key'] = $(elem).attr('key');
        attributes[id]['name'] = $(elem).attr('text');
        attributes[id]['position'] = {
            "top": $(elem).offset().top - work_zone_position.top,
            "left": $(elem).offset().left - work_zone_position.left,
        };
    });

    Out_JSON['attributes'] = attributes;

    let relationship = work_zone_container.find('.relationship');

    relationship.each(function (i, elem) {
        let id = $(elem).attr('id');
        relationships[id] = {};
        relationships[id]['first'] = $(elem).attr('first');
        relationships[id]['second'] = $(elem).attr('second');
        relationships[id]['rel_type'] = $(elem).attr("rel_type");
        relationships[id]['rel_identity'] = $(elem).attr("rel_identity");
        relationships[id]['rel_description'] = $(elem).children('.desc_diamond').text();
        relationships[id]['position'] = {
            "top": $(elem).offset().top - work_zone_position.top,
            "left": $(elem).offset().left - work_zone_position.left,
        };
    });

    Out_JSON['relationships'] = relationships;

    let link = $('.canvas').find('.link');

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
        links[id]['position_num'] = $(elem).attr('position_num');
    });
    Out_JSON['links'] = links;
    Out_JSON['diagram_id'] = get_diagram_id();
    Out_JSON['diagram_name'] = $('div#diagram_name').text();

    return Out_JSON;
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
        // TODO: Переписать источник данных, а то уникальность проверяется только после сохранения
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

function get_center_window_position() {
    let body = $('body');
    let work_zone_container = $('.work_zone_container');
    let work_zone_container_position = work_zone_container.position();
    return {
        'y': body.height() / 2 - work_zone_container_position['top'] - 50,
        'x': body.width() / 2 - work_zone_container_position['left']
    };
}

function raise_notification(message) {

    let toast_block = $('.toast_tail');
    toast_block.css({"display": "block"});

    let notification_window = $('.toast');
    let notification_window_text = $('.toast-body');

    notification_window_text.html(message);
    notification_window.toast("show");

    notification_window.on('hidden.bs.toast', function () {
        toast_block.css({"display": "none"});
    })
}

function set_error(text) {
    $(".error").text(text);
    return false;
}

//DRAGGABLE

function setting_link(main_id_import = NaN) {

    function set_relation_sign_position(relation_sign, top, left, relationship_position) {
        let width = relation_sign.css('width');
        let height = relation_sign.css('height');

        let sign_description = relation_sign.children(".sign_description");

        let sign_description_position_list = {
            "center": {
                "top": "-45px",
                "left": "15px"
            },
            "up": {
                "top": "-15px",
                "left": "15px"
            },
            "down": {
                "top": "15px",
                "left": "15px"
            },
            "right": {
                "top": "15px",
                "left": "15px"
            },
            "right-up": {
                "top": "15px",
                "left": "15px"
            },
            "right-down": {
                "top": "15px",
                "left": "15px"
            },
            "left": {
                "top": "15px",
                "left": -sign_description.width() - 15 + "px"
            },
            "left-up": {
                "top": "15px",
                "left": -sign_description.width() - 15 + "px"
            },
            "left-down": {
                "top": "15px",
                "left": -sign_description.width() - 15 + "px"
            }
        };

        let sign_description_position = sign_description_position_list[relationship_position];
        sign_description.css(sign_description_position);

        relation_sign.css({
            "left": left - (width.substring(0, width.length - 2) / 2),
            "top": top - (height.substring(0, height.length - 2) / 2)
        });
    }

    let work_zone_container = $(".work_zone_container");
    let main;

    if (!isNaN(main_id_import)) {
        main = work_zone_container.children('#' + main_id_import);
    } else {
        main = work_zone_container.children('.main');
    }

    main.each(function (i, elem) {
        let main_id = $(elem).attr("id");
        let main = $("#" + main_id);

        let attribute = work_zone_container.children('[parent="' + main_id + '"]');
        let first_relationship = work_zone_container.children('.relationship[first=' + main_id + ']');
        let second_relationship = work_zone_container.children('.relationship[second=' + main_id + ']');
        let relationship = $.extend(first_relationship, second_relationship);

        if (DIAGRAM_TYPE === "chen") {
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
        }

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
                    if (DIAGRAM_TYPE === 'chen') {
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
                    } else if (DIAGRAM_TYPE === 'idef1x') {

                        let main_pos_top_start, main_pos_top_end,
                            main_pos_left_start, main_pos_left_end,
                            main_left, main_top;

                        let link_position_num = Number($(elem).attr('position_num'));

                        if (link_position_num === 2) {
                            main_pos_top_start = main_pos["top"];
                            main_pos_top_end = main_pos["top"] + main.innerHeight();
                            main_pos_left_start = main_pos["left"];
                            main_pos_left_end = main_pos["left"] + main.innerWidth();

                            main_left = main_pos["left"] + Number(main.innerWidth() / 2);
                            main_top = main_pos["top"] + Number(main.innerHeight() / 2);

                        } else if (link_position_num === 1) {
                            main_pos_top_start = second_main_pos["top"];
                            main_pos_top_end = second_main_pos["top"] + second_main.innerHeight();
                            main_pos_left_start = second_main_pos["left"];
                            main_pos_left_end = second_main_pos["left"] + second_main.innerWidth();

                            main_left = second_main_pos["left"] + Number(main.innerWidth() / 2);
                            main_top = second_main_pos["top"] + Number(main.innerHeight() / 2);
                        }

                        let relationship_center_left = relationship_pos["left"] + Number(relationship.innerWidth() / 2);
                        let relationship_center_top = relationship_pos["top"] + Number(relationship.innerHeight() / 2);

                        let relationship_position = "center";

                        // СВЯЗЬ ВВЕРХУ
                        if (relationship_center_top < main_pos_top_start && relationship_center_left > main_pos_left_start && relationship_center_left < main_pos_left_end) {
                            relationship_position = "up";
                            main_left = relationship_center_left;
                            main_top = main_pos_top_start;
                        }
                        // СВЯЗЬ ВНИЗУ
                        if (relationship_center_top > main_pos_top_end && relationship_center_left > main_pos_left_start && relationship_center_left < main_pos_left_end) {
                            relationship_position = "down";
                            main_left = relationship_center_left;
                            main_top = main_pos_top_end;
                        }
                        // СВЯЗЬ СЛЕВА
                        if (relationship_center_left < main_pos_left_start && relationship_center_top > main_pos_top_start && relationship_center_top < main_pos_top_end) {
                            relationship_position = "left";
                            main_left = main_pos_left_start;
                            main_top = relationship_center_top;
                        }
                        // СВЯЗЬ СПРАВА
                        if (relationship_center_left > main_pos_left_end && relationship_center_top > main_pos_top_start && relationship_center_top < main_pos_top_end) {
                            relationship_position = "right";
                            main_left = main_pos_left_end;
                            main_top = relationship_center_top;
                        }

                        let border_radius = 10;

                        // СЛЕВА ВВЕРХ
                        if (relationship_center_top < main_pos_top_start && relationship_center_left < main_pos_left_start) {
                            let cat1 = (main_pos_top_start - relationship_center_top);
                            let cat2 = (main_pos_left_start - relationship_center_left);
                            let hip = Math.sqrt(Math.pow(cat1, 2) + Math.pow(cat2, 2));
                            let fi = Math.sin(cat1 / hip);

                            relationship_position = "left-up";

                            main_left = main_pos_left_start + (border_radius * Math.sin(fi));
                            main_top = main_pos_top_start + (border_radius * Math.cos(fi)) - 6;
                        }
                        // СЛЕВА НИЗ
                        if (relationship_center_top > main_pos_top_end && relationship_center_left < main_pos_left_start) {
                            let cat1 = (main_pos_top_end - relationship_center_top);
                            let cat2 = (relationship_center_left - main_pos_left_start);
                            let hip = Math.sqrt(Math.pow(cat1, 2) + Math.pow(cat2, 2));
                            let fi = Math.sin(cat2 / hip);

                            relationship_position = "left-down";

                            main_left = main_pos_left_start + (border_radius * Math.cos(fi)) - 6;
                            main_top = main_pos_top_end + (border_radius * Math.sin(fi));
                        }
                        // СПРАВА ВЕРХ
                        if (relationship_center_top < main_pos_top_start && relationship_center_left > main_pos_left_end) {
                            let cat1 = (relationship_center_top - main_pos_top_start);
                            let cat2 = (relationship_center_left - main_pos_left_end);
                            let hip = Math.sqrt(Math.pow(cat1, 2) + Math.pow(cat2, 2));
                            let fi = Math.sin(cat1 / hip);

                            relationship_position = "right-up";

                            main_left = main_pos_left_end + (border_radius * Math.sin(fi));
                            main_top = main_pos_top_start + (border_radius * Math.cos(fi)) - 6;
                        }
                        // СПРАВА НИЗ
                        if (relationship_center_top > main_pos_top_end && relationship_center_left > main_pos_left_end) {
                            let cat1 = (relationship_center_top - main_pos_top_end);
                            let cat2 = (relationship_center_left - main_pos_left_end);
                            let hip = Math.sqrt(Math.pow(cat1, 2) + Math.pow(cat2, 2));
                            let fi = Math.sin(cat2 / hip);

                            relationship_position = "right-down";

                            main_left = main_pos_left_end + (border_radius * Math.sin(fi)) - 9; // смещение по тени
                            main_top = main_pos_top_end + (border_radius * Math.cos(fi)) - 9;
                        }

                        $(elem).attr({
                            "x1": relationship_center_left,
                            "y1": relationship_center_top,
                            "x2": main_left,
                            "y2": main_top
                        });

                        let relation_sign = $('.sign_block[parent="' + elem.id + '"]');
                        if (relation_sign.length > 0) {
                            set_relation_sign_position(relation_sign, main_top, main_left, relationship_position);
                        }
                    }

                });

            }
        )
        ;
    })
    ;
}

function draggable_box() {

    let work_zone_container = $(".work_zone_container");
    let main = work_zone_container.children('.main');
    let relationship = work_zone_container.children('.relationship');

    main.each(function (i, elem) {
        let main_start_position = {'left': 0, "top": 0};
        let attribute_position_list = {};
        let main_id = $(elem).attr("id");
        let attribute = work_zone_container.children('[parent="' + main_id + '"]');

        $('.main[id="' + main_id + '"]').draggable({
            cursor: "move",
            start: function (event, ui) {
                main_start_position.top = ui.offset.top;
                main_start_position.left = ui.offset.left;

                attribute.each(function (i, elem) {
                    let attribute_id = $(elem).attr('id');
                    attribute_position_list[attribute_id] = $(elem).offset();

                });
            },
            stop: function () {
                if ($(this).offset().left < 0) {
                    $(this).css("left", 0);
                }

            },
            drag: function (event, ui) {
                let delta = {
                    "top": main_start_position.top - ui.offset.top,
                    "left": main_start_position.left - ui.offset.left
                };

                attribute.each(function (attr_i, attr_elem) {
                    $(attr_elem).offset({'top': attribute_position_list[$(attr_elem).attr('id')].top - delta.top});
                    $(attr_elem).offset({'left': attribute_position_list[$(attr_elem).attr('id')].left - delta.left});
                });

                setting_link();
            }
        });

        attribute.each(function (i, elem) {
            $('.attribute[id="' + $(elem).attr("id") + '"]').draggable({
                cursor: "move",
                drag: function () {
                    setting_link();
                }
            });
        });

        relationship.each(function (i, elem) {
            $('.relationship[id="' + $(elem).attr("id") + '"]').draggable({
                cursor: "move",
                drag: function () {
                    setting_link();
                }
            });
        });

    });

    let box = work_zone_container.children(".box");
    box.hover(
        function () {
            setting_link();
        },
        function () {
            setting_link();
        });

    setting_link();
}

//ZOOM

function zoom_element(element, delta, zoom_delta = 0.05, animate_speed = 1) {
    let undo_zoom_button = $('#undo_zoom');

    if (typeof (delta) !== "number") {
        delta = delta.deltaY * delta.deltaFactor;
    }

    if (Number(delta) >= 1) {
        ZOOM_DELTA += zoom_delta;
    } else if (Number(delta) < 0 && ZOOM_DELTA > 0.15) {
        ZOOM_DELTA -= zoom_delta;
    }
    element.animate({'zoom': ZOOM_DELTA}, animate_speed);

    if (ZOOM_DELTA !== 1) {
        undo_zoom_button.css({'display': 'block'});
    } else {
        undo_zoom_button.css({'display': 'none'});
    }

}

function undo_zoom(element, animate_speed = 400) {
    ZOOM_DELTA = 1;
    element.animate({'zoom': ZOOM_DELTA}, animate_speed);

    let undo_zoom_button = $('#undo_zoom');
    undo_zoom_button.css({'display': 'none'});

    // let position = get_center_window_position();
    // // console.log(position);
    // element.css({'left': -position['x'], 'top': -position['x']});
    element.css({'left': 0, 'top': 0});
    // TODO: Доделать возврат масштаба, работает странно
}


// Оппа, посхалочка)))0)

//ADD BLOCK
function add_main_block(main_id, name_new_main) {
    let result;

    let block = $('<div>', {
        class: 'box main box_shadow',
        id: main_id
    });

    let main_name = $('<div>', {
        class: 'main_name',
        text: name_new_main
    });

    let main_options = $('<div>', {
        'class': 'options'
    }).append(
        $('<div>', {
            class: 'box_option_bottom btn_text',
        }).append([
            $('<div>', {
                class: 'edit_main light_bottom',
                id: main_id,
                click: function () {
                    add_main(main_id)
                },
                text: 'Изменить сущность'
            }),
            $('<div>', {
                class: 'add_attribute light_bottom',
                id: main_id,
                click: function () {
                    add_attribute(main_id)
                },
                text: 'Добавить атрибут'
            }),
            $('<div>', {
                class: 'add_relationships light_bottom',
                id: main_id,
                click: function () {
                    add_relationship(main_id)
                },
                text: 'Создать связь'
            }),
            $('<div>', {
                class: 'remove_main light_bottom red_bottom',
                id: main_id,
                click: function () {
                    remove_main(main_id)
                },
                text: 'Удалить сущность'
            })
        ])
    );

    if (DIAGRAM_TYPE === 'chen') {
        result = block.append(main_name, main_options);
    } else if (DIAGRAM_TYPE === 'idef1x') {
        main_name.addClass('main_name_idef1x');

        let PK_block = $('<div>', {class: "main_PK_block"});

        result = block.append(main_name, main_options, PK_block);
    }
    return result;
}

function add_attribute_block(attribute_id, main_id, name_new_attribute, data_type, len_data, primary_key, foreign_key = false) {
    let result;

    let is_key = "";
    let key = "";

    if (primary_key === true) {
        is_key = "is_primary_key";
        key = "PK";
    } else if (foreign_key === true) {
        is_key = "is_foreign_key";
        key = "FK";
    }

    let block = $('<div>', {
        class: 'box attribute box_shadow',
        id: attribute_id,
        data_type: data_type,
        len_data: len_data,
        key: key
    }).attr({
        'parent': main_id,
        'text': name_new_attribute
    });

    let attribute_text = $('<div>', {
        class: 'attribute_text',
        text: name_new_attribute
    }).addClass(is_key);


    let attribute_option = $('<div>', {
        class: 'options'
    });

    if (DIAGRAM_TYPE === 'chen') {

        let edit_button = $('<div>', {
            class: 'edit_attribute light_bottom',
            id: attribute_id,
            click: function () {
                add_attribute(main_id, attribute_id)
            },
            text: 'Изменить атрибут'
        });

        let remove_button = $('<div>', {
            class: 'remove_attribute light_bottom red_bottom',
            id: attribute_id,
            click: function () {
                remove_attr(attribute_id)
            },
            text: 'Удалить атрибут'
        });

        result = block.append(
            attribute_text,
            attribute_option.append(
                $('<div>', {
                    class: 'box_option_bottom btn_text'
                }).append(
                    edit_button,
                    remove_button
                )
            )
        );

    } else if (DIAGRAM_TYPE === 'idef1x') {

        let edit_button_idef1x = $('<div>', {
            class: 'edit_attribute edit_attribute_idef1x',
            id: attribute_id,
            click: function () {
                add_attribute(main_id, attribute_id)
            }
        });

        let remove_button_idef1x = $('<div>', {
            class: 'remove_attribute remove_attribute_idef1x',
            id: attribute_id,
            click: function () {
                remove_attr(attribute_id)
            }
        });

        if (len_data !== null) {
            len_data = "(" + len_data + ")";
        } else {
            len_data = "";
        }

        if ((Boolean(primary_key) === true)) {
            primary_key = "(PK)";
        } else if (((Boolean(foreign_key) === true))) {
            primary_key = "(FK)";
        } else {
            primary_key = "";
        }

        attribute_text.html(name_new_attribute + ": " + data_type + " " + len_data + " " + primary_key);

        result = block.removeClass("box box_shadow").addClass("attribute_idef1x")
            .append(
                attribute_text.addClass("attribute_text_idef1x"),
                attribute_option
                    .removeClass('options')
                    .addClass("attribute_option")
                    .append(
                        $('<div>', {
                            class: 'box_option_bottom_attribute btn_text'
                        }).append(
                            edit_button_idef1x.addClass("option_bottom_attribute"),
                            remove_button_idef1x.addClass("option_bottom_attribute")
                        )
                    )
            );
    }

    return result;
}

function add_relationship_block(relationship_id, rel_type, rel_identity = "true", rel_desc, first_main, second_main) {
    let result;

    let relationship = $('<div>', {
        class: 'relationship',
        id: relationship_id
    }).attr({
        'first': first_main,
        'second': second_main,
        'rel_type': rel_type,
        'rel_identity': rel_identity,
        "rel_desc": rel_desc
    });

    let diamond_block = $('<div>', {
        class: 'box diamond box_shadow'
    }).append(
        $('<div>', {
            class: 'diamond_text',
            text: rel_type
        })
    );

    let diamond_description = $('<div>', {
        class: 'desc_diamond',
        text: rel_desc
    });

    let diamond_options = $('<div>', {
        class: 'options'
    }).append(
        $('<div>', {
            class: 'box_option_bottom btn_text'
        }).append(
            $('<div>', {
                class: 'edit_relationship light_bottom',
                click: function () {
                    add_relationship(relationship_id)
                },
                text: 'Изменить связь'
            }),
            $('<div>', {
                class: 'remove_attribute light_bottom red_bottom',
                click: function () {
                    remove_relationship(relationship_id)
                },
                text: 'Удалить связь'
            })
        ));

    if (DIAGRAM_TYPE === 'chen') {
        result = relationship.append(diamond_block, diamond_description, diamond_options);
    } else if (DIAGRAM_TYPE === 'idef1x') {
        result = relationship.append(
            diamond_block.addClass("diamond_idef1x").removeClass("box_shadow").text(""),
            diamond_description, diamond_options
        ).addClass("relationship_idef1x");
    }

    return result;
}

function add_link(parent_id, link_id, position_num, dasharray = "0") {

    return $('<line>', {
        class: 'link',
        id: link_id
    }).attr({
        'parent': parent_id,
        'position_num': position_num,
        'x1': "10",
        'y1': "10",
        'x2': "200",
        'y2': "100",
        'stroke': "black",
        'stroke-dasharray': dasharray
    });
}

function add_relation_sign_block(parent_id, type = "point", w = 10, h = 10, fill = "black", stroke = "black", description = "") {

    let w_block = w;
    let h_block = h;

    if (type === "point") {
        w_block += 2;
        h_block += 2;
    }

    let svg_block_svg = $('<svg>', {class: 'sign_block_svg'}).css({
        "width": w_block,
        "height": h_block
    });
    let sign_description = $('<div>', {class: 'sign_description'}).attr({
        'parent': parent_id
    }).text(description);

    let sign_block = $('<div>', {class: 'sign_block'}).attr({
        'parent': parent_id
    }).css({
        "width": w_block,
        "height": h_block
    }).append(svg_block_svg, sign_description);

    let sign;
    if (type === "point") {
        let radius = Math.max(w, h) / 2;

        sign = $('<circle>', {
            class: 'relation_sign point',
        }).attr({
            'type': type,
            'parent': parent_id,
            'r': radius,
            'cx': radius + 1,
            'cy': radius + 1,
            'fill': fill,
            'stroke': stroke
        });

        sign_block.children('svg').html(sign);

    } else if (type === "diamond") {
        let points = "0," + (h / 2) + " " + (w / 2) + ",0 " + w + "," + (h / 2) + " " + (w / 2) + "," + h;

        sign = $('<polygon>', {
            class: 'relation_sign point',
        }).attr({
            'type': type,
            'parent': parent_id,
            'points': points,
            'fill': fill,
            'stroke': stroke
        });

        sign_block.children('svg').html(sign);
    }

    return sign_block;
}

// ADD HANDLERS
function add_main(edit_main_id = NaN) {
    let toggle_options_bottom_case = $('.toggle_options_bottom_case');
    toggle_options_bottom_case.slideUp();

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
        name_new_main_input.val(edited_main.children(".main_name").text());
    } else {
        new_diagramm_title.text("Создание новой сущности");
        main_name_label.text("Название новой сущности:");
        btn_new_main.text("Создать");
    }

    let main_edit_window = $("#new_main");
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
                    let position = get_center_window_position();
                    $("#" + main_id).css({"top": position['y'] + 'px', "left": position['x'] + 'px'});
                } else {
                    $("#" + edit_main_id).children(".main_name").text(name_new_main);
                }
                draggable_box();
            });
        }
    });
}

function add_attribute(main_id, edit_attr_id = NaN) {

    function show_data_len_input(input_attr_data_type) {

        let input_len_data_type_group = $('.attribute_data_len');

        let data_type = input_attr_data_type.val();

        if (EXCEPT_DATA_TYPE_LENGTH.indexOf(data_type) !== -1) {
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
                if (elem['key'] === 'PK' && Number(index) !== edit_attr_id && Number(elem['parent']) === main_id) {
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

    function check_data_len(data_len_value) {
        let attribute_data_len_invalid_feedback = $('#attribute_data_len_invalid_feedback');

        if (data_len_value === null || data_len_value > 0) {

            attribute_data_len_invalid_feedback.removeClass('invalid-feedback');
            attribute_data_len_invalid_feedback.addClass('valid-feedback');
            attribute_data_len_invalid_feedback.html("");
            input_len_data_type.removeClass('is-invalid');
            input_len_data_type.addClass('is-valid');
            return true;

        } else if (data_len_value <= 0) {

            attribute_data_len_invalid_feedback.removeClass('valid-feedback');
            attribute_data_len_invalid_feedback.addClass('invalid-feedback');
            attribute_data_len_invalid_feedback.html("Длина атрибута должна быть > 0!");
            input_len_data_type.removeClass('is-valid');
            input_len_data_type.addClass('is-invalid');
            return false;
        }
    }

    function send_form() {

        let attribute_name = input_name_attribute.val();
        let data_type = input_attr_data_type.val();
        let primary_key = primary_key_checkbox.prop("checked");

        let len_data;

        if (show_data_len_input(input_attr_data_type)) {
            len_data = input_len_data_type.val();
        } else {
            len_data = null;
        }

        let check_list = validate_value(edit_type, 'attribute', attribute_name);
        if (validate_attribute_name(edit_type, check_list) && check_data_len(len_data)) {
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

                if (DIAGRAM_TYPE === 'idef1x') {
                    if (len_data !== null) {
                        len_data = "(" + len_data + ")";
                    } else {
                        len_data = "";
                    }

                    if (Boolean(primary_key) === true) {
                        primary_key = "(PK)";
                    } else {
                        primary_key = "";
                    }

                    edited_attribute_text.text(attribute_name + ": " + data_type +
                        " " + len_data + " " + primary_key);
                }

            } else {

                let canvas = $(".canvas");

                if (DIAGRAM_TYPE === 'chen') {

                    $(".work_zone_container").append(add_attribute_block(attribute_id, main_id, attribute_name, data_type, len_data, Boolean(primary_key), false));

                    let position = get_center_window_position();
                    $("#" + attribute_id).css({"top": position['y'] + 'px', "left": position['x'] + 'px'});

                    canvas.append(add_link(main_id, attribute_id, 1));

                } else if (DIAGRAM_TYPE === 'idef1x') {

                    let attribute_block_result = add_attribute_block(attribute_id, main_id, attribute_name, data_type, len_data, Boolean(primary_key), false);
                    let main = $(".main#" + main_id);
                    let PK_block = main.children(".main_PK_block");
                    if (primary_key === true) {
                        PK_block.append(attribute_block_result);
                    } else {
                        main.append(attribute_block_result);
                    }
                }

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
    input_len_data_type.val(1);
    primary_key_checkbox.prop('checked', false);
    input_attr_data_type.append(
        '<option value="int">int</option>' +
        '<option value="char">char</option>' +
        '<option value="float">float</option>' +
        '<option value="money">money</option>' +
        '<option value="varchar">varchar</option>' +
        '<option value="date">date</option>' +
        '<option value="time">time</option>'
    );

    set_error("");

    let edit_type;
    if ($("div").is(edited_attribute)) {

        edit_type = "change";

        new_attribute_title.text("Изменение атрибута");
        attribute_name_label.text("Название атрибута:");
        button_new_attribute.text("Изменить");
        input_name_attribute.val(edited_attribute.attr("text")); ///////////////////////////////////////////////////////
        input_attr_data_type.val(edited_attribute.attr("data_type"));
        input_len_data_type.val(edited_attribute.attr("len_data"));

        let is_PK = (edited_attribute.attr("key") === 'PK');
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
    let rel_identity = $('select[name="rel_identity"]');

    rel_first_main.empty();
    rel_second_main.empty();
    rel_type.empty();
    rel_identity.empty();
    rel_description.val("");

    set_error("");

    // Действия над формами модального окна
    let work_zone_container = $(".work_zone_container");
    let main = work_zone_container.children('.main');

    main.each(function (i, elem) {
        let main_name = $(elem).children(".main_name").text();
        let main_id = $(elem).attr("id");
        rel_first_main.append('<option value="' + main_id + '">' + main_name + '</option>');
        rel_second_main.append('<option value="' + main_id + '">' + main_name + '</option>');
    });

    if (DIAGRAM_TYPE === "chen") {
        rel_type.append(
            '<option value="1:1">1:1</option>' +
            '<option value="1:N">1:N</option>' +
            '<option value="N:N">N:N</option>'
        );
    } else if (DIAGRAM_TYPE === "idef1x") {
        rel_type.append(
            '<option value="1:1">1:1</option>' + // empty:empty
            '<option value="1:[0..1..N]">1:[0..N]</option>' + // empty:.
            '<option value="1:[0 or 1]">1:[0 or 1]</option>' + // empty:.Z
            '<option value="1:[1..N]">1:[1..N]</option>' + // empty:.P
            '<option value="[0..1]:[0..1..N]">[0..1]:[0..1..N]</option>' + // diamond:.
            '<option value="[0..1]:[0 or 1]">[0..1]:[0 or 1]</option>'  // diamond: .Z
        );

        $(".rel_identity").css({"display": "block"});
        rel_identity.append(
            '<option value="true">Идентифицирующая связь</option>' +
            '<option value="false">Неидентифицирующая связь</option>'
        );
    }


    let edited_relationship = $('.relationship[id="' + edit_rel_id + '"]');

    if ($('div').is(edited_relationship)) {
        $('#new_relationship_title').text("Изменение связи");
        $('#btn_new_relationship').text("Изменить");
        rel_description.val(edited_relationship.children(".desc_diamond").text());
        rel_first_main.val(edited_relationship.attr("first"));
        rel_second_main.val(edited_relationship.attr("second"));
        rel_type.val(edited_relationship.attr("rel_type"));
        rel_identity.val(edited_relationship.attr("rel_identity"));
        console.log(edited_relationship.attr("rel_desc"));
    } else {
        $('#new_relationship_title').text("Добавление новой связи");
        $('#btn_new_relationship').text("Добавить");
    }

    new_relationship_window.modal("toggle");

    rel_first_main.change(function () {
        rel_first_main.children().css("display", "block");
        rel_second_main.children().css("display", "block");
        let first_main_val = rel_first_main.val();
        rel_second_main.children('[value=' + first_main_val + ']').css("display", "none");
    });
    rel_second_main.change(function () {
        rel_first_main.children().css("display", "block");
        rel_second_main.children().css("display", "block");
        let second_main_val = rel_second_main.val();
        rel_first_main.children('[value=' + second_main_val + ']').css("display", "none");
    });

    // --- Действия над формами модального окна ---

    $("#form_new_relationship").submit(function (event) {
        let work_zone = $(".work_zone_container");

        let relationship_id = randInt();
        let first_link_id = randInt();
        let second_link_id = randInt();

        let first_main_id = rel_first_main.val();
        let second_main_id = rel_second_main.val();
        let rel_type_val = rel_type.val();
        let rel_identity_val = rel_identity.val();
        let rel_desc = rel_description.val();

        if (first_main_id !== "" && second_main_id !== "" && first_main_id[0] !== second_main_id[0]) {

            let is_PK_first_main = $('.attribute[parent="' + first_main_id[0] + '"][key="PK"]');
            let is_PK_second_main = $('.attribute[parent="' + second_main_id[0] + '"][key="PK"]');

            if (is_PK_first_main.length > 0 && is_PK_second_main.length > 0) {

                let edited_relationship = $('.relationship[id="' + edit_rel_id + '"]');

                if ($('div').is(edited_relationship)) {
                    edited_relationship.attr('first', first_main_id);
                    edited_relationship.attr('second', second_main_id);
                    edited_relationship.attr('rel_type', rel_type_val);
                    edited_relationship.attr('rel_identity', rel_identity_val);
                    edited_relationship.attr('rel_desc', rel_desc);
                    edited_relationship.children('.desc_diamond').text(rel_desc);

                    if (DIAGRAM_TYPE === "chen") {
                        edited_relationship.children('.diamond').children(".diamond_text").text(rel_type_val);
                    } else if (DIAGRAM_TYPE === "idef1x") {
                        add_relation_sign(edit_rel_id);
                    }

                } else {
                    work_zone.append(add_relationship_block(relationship_id, rel_type_val, rel_identity_val, rel_desc, first_main_id, second_main_id));

                    let first_main_position = $("#" + first_main_id).position();
                    let second_main_position = $("#" + second_main_id).position();

                    let center_position = {
                        "top": (first_main_position['top'] + second_main_position['top']) / 2,
                        "left": (first_main_position['left'] + second_main_position['left']) / 2
                    };

                    $("#" + relationship_id).css(center_position);

                    let canvas = $(".canvas");
                    canvas.append(add_link(relationship_id, first_link_id, 1));
                    canvas.append(add_link(relationship_id, second_link_id, 2));

                    if (DIAGRAM_TYPE === "idef1x") {

                        try {
                            let first_main = $('.main[id="' + first_main_id + '"]');
                            let first_main_name = first_main.children(".main_name").text();
                            let first_main_PK = first_main.find('.attribute[key="PK"]');
                            let first_main_PK_name = first_main_PK.attr("text");
                            let first_main_PK_data_type = first_main_PK.attr("data_type");
                            let first_main_PK_len_data = first_main_PK.attr("len_data");

                            if (first_main_PK_len_data === undefined) {
                                first_main_PK_len_data = null;
                            }

                            let second_main = $('.main[id="' + second_main_id + '"]');
                            let PK_block = second_main.children(".main_PK_block");

                            let FK_attribute_id = randInt();
                            let name_new_FK_attribute = first_main_name + "_" + first_main_PK_name;

                            PK_block.append(add_attribute_block(FK_attribute_id, second_main_id, name_new_FK_attribute, first_main_PK_data_type, first_main_PK_len_data, false, true));

                        } catch (e) {
                            console.log(e);
                        }

                        add_relation_sign(relationship_id);
                    }

                    // перерисовка svg
                    canvas.html(canvas.html());

                }
                $(this).off(event);
                draggable_box();
                new_relationship_window.modal("toggle");

            } else {
                set_error("У какой-то из сущностей нет первичного ключа");
            }
            $(this).off(event);
            return false;
        } else {
            set_error("Не выбрана одна из сущностей, или выбраны одинаковые сущности");
        }
        $(this).off(event);
        return false;
    });
}

function add_relation_sign(relationship_id) {
    let work_zone = $(".work_zone_container");

    let relationship = $('.relationship[id="' + relationship_id + '"]');
    let rel_type = relationship.attr('rel_type');
    let rel_identity = relationship.attr('rel_identity');

    let first_link = $('.link[parent="' + relationship_id + '"][position_num=1]');
    let second_link = $('.link[parent="' + relationship_id + '"][position_num=2]');

    let first_link_id = first_link.attr('id');
    let second_link_id = second_link.attr('id');

    let first_relation_sign = $('.sign_block[parent="' + first_link_id + '"]');
    let second_relation_sign = $('.sign_block[parent="' + second_link_id + '"]');

    if (first_relation_sign.length > 0) {
        first_relation_sign.remove();
    }
    if (second_relation_sign.length > 0) {
        second_relation_sign.remove();
    }

    if (rel_identity === "true") {
        first_link.attr({"stroke-dasharray": "0"});
        second_link.attr({"stroke-dasharray": "0"});
    } else if (rel_identity === "false") {
        first_link.attr({"stroke-dasharray": "3"});
        second_link.attr({"stroke-dasharray": "3"});
    }

    let point_width = 10;
    let point_height = 10;
    let diamond_width = 15;
    let diamond_height = 15;

    let first_sign_block, second_sign_block;

    if (rel_type === "1:1") {
        first_sign_block = add_relation_sign_block(first_link_id, "empty", diamond_width, diamond_height, "black", "black", "1");
        second_sign_block = add_relation_sign_block(second_link_id, "empty", point_width, point_height, "black", "black", "1");

    } else if (rel_type === "1:[0..1..N]") {
        first_sign_block = add_relation_sign_block(first_link_id, "empty", point_width, point_height, "black", "black", "1");
        second_sign_block = add_relation_sign_block(second_link_id, "point", point_width, point_height, "black", "black", "");

    } else if (rel_type === "1:[0 or 1]") {
        first_sign_block = add_relation_sign_block(first_link_id, "empty", point_width, point_height, "black", "black", "1");
        second_sign_block = add_relation_sign_block(second_link_id, "point", point_width, point_height, "black", "black", "Z");

    } else if (rel_type === "1:[1..N]") {
        first_sign_block = add_relation_sign_block(first_link_id, "empty", point_width, point_height, "black", "black", "1");
        second_sign_block = add_relation_sign_block(second_link_id, "point", point_width, point_height, "black", "black", "P");

    } else if (rel_type === "[0..1]:[0..1..N]") {
        first_sign_block = add_relation_sign_block(first_link_id, "diamond", diamond_width, diamond_height, "white", "black", "");
        second_sign_block = add_relation_sign_block(second_link_id, "point", point_width, point_height, "black", "black", "");

    } else if (rel_type === "[0..1]:[0 or 1]") {
        first_sign_block = add_relation_sign_block(first_link_id, "diamond", diamond_width, diamond_height, "white", "black", "");
        second_sign_block = add_relation_sign_block(second_link_id, "point", point_width, point_height, "black", "black", "Z");
    }

    work_zone.append(first_sign_block);
    first_sign_block.html(first_sign_block.html());
    work_zone.append(second_sign_block);
    second_sign_block.html(second_sign_block.html());

}

//REMOVE HANDLERS

function remove_main(main_id) {
    $('.main[id="' + main_id + '"]').remove();
    $('.relationship[parent="' + main_id + '"]').remove();

    let work_zone_container = $(".work_zone_container");
    let attributes = work_zone_container.children('[parent="' + main_id + '"]');

    let relationships = work_zone_container.children('.relationship');

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
    $('.link[parent="' + rel_id + '"]').each(function (i, elem) {
        $('.sign_block[parent="' + $(elem).attr("id") + '"]').remove();
        $(elem).remove();
    });


    draggable_box();
}


// SAVE
function save_diagram() {
    let diagram_data = get_diagram_info();

    diagram_data['command'] = "save";

    console.log(diagram_data);

    $.ajax({
        type: "POST",
        url: "editor/save.php",
        data: diagram_data
    }).done(function (msg) {
        raise_notification("Диаграмма успешно сохранена");
        console.log("Изменения в диаграмме id:'" + msg + "' сохранены");
    });

    save_diagram_img();

    return diagram_data;
}

function save_diagram_img() {

    let preview_image = $('#preview_image');

    preview_image.removeAttr('src');

    setTimeout(function () {

        $(".box_shadow").css({"box-shadow": "none"});

        let img = html2canvas(document.getElementById('screenshots_zone')).then(function (canvas) {
            let REQUEST_DATA = {};
            img = canvas.toDataURL("image/png", 0);

            REQUEST_DATA['image'] = img;
            REQUEST_DATA['diagram_id'] = get_diagram_id();

            $.ajax({
                type: "POST",
                url: "editor/save_diagram_img.php",
                async: false,
                data: REQUEST_DATA,
                success: function () {
                    $(".box_shadow").css({"box-shadow": "0 3px 6px 1px #bdbdbd59"});
                    console.log("Снимок диаграммы сохранен");
                }
            }).done(function (img) {
                // console.log(img);
                let image_path = "user_data/" + img;

                preview_image.attr('src', image_path);
                preview_image.html(preview_image.html());

                let download_diagram_img = $('#download_diagram_img');
                download_diagram_img.attr('href', image_path);
            });
        });
    }, 300);
}


// SAVE HANDLER
function open_screenshot_window() {

    let get_diagram_img = $("#get_diagram_img");
    get_diagram_img.modal('toggle');

    save_diagram_img();

}

//LOAD

function diagram_constructor(result_json) {
    let work_zone = $(".work_zone_container");
    let canvas = $(".canvas");

    let mains = result_json['mains'];
    let attributes = result_json['attributes'];
    let relationships = result_json['relationships'];
    let links = result_json['links'];

    let top_delta = $('.header').height();

    jQuery.each(mains, function (i, elem) {
        let position = JSON.parse(elem['position']);
        position.top = Number(position.top) + top_delta;

        work_zone.append(add_main_block(elem['main_id'], elem['name']));
        $(".main#" + elem['main_id']).offset(position);
    });

    jQuery.each(attributes, function (i, elem) {
        let position = JSON.parse(elem['position']);
        position.top = Number(position.top) + top_delta;

        let PK, FK = false;
        if (elem['key'] === 'PK') {
            PK = true;
        } else if (elem['key'] === 'FK') {
            FK = true;
        }

        if (DIAGRAM_TYPE === 'chen') {

            work_zone.append(add_attribute_block(elem['attribute_id'], elem['parent_id'], elem['name'], elem['data_type'], elem['data_len'], PK, FK));
            $(".attribute#" + elem['attribute_id']).offset(position);

        } else if (DIAGRAM_TYPE === 'idef1x') {

            let main = $(".main#" + elem['parent_id']);

            if (['PK', 'FK'].indexOf(elem['key']) !== -1) {

                let PK_block = main.children(".main_PK_block");
                PK_block.append(add_attribute_block(elem['attribute_id'], elem['parent_id'], elem['name'], elem['data_type'], elem['data_len'], PK, FK));

            } else {

                main.append(add_attribute_block(elem['attribute_id'], elem['parent_id'], elem['name'], elem['data_type'], elem['data_len'], PK, FK));
            }
        }
    });

    jQuery.each(links, function (i, elem) {
        canvas.append(add_link(elem['parent_id'], elem['link_id'], elem['position_num']));
        canvas.html(canvas.html());
    });

    jQuery.each(relationships, function (i, elem) {
        let position = JSON.parse(elem['position']);
        position.top = Number(position.top) + top_delta;

        work_zone.append(add_relationship_block(elem['relationship_id'], elem['rel_type'], elem['rel_identity'], elem['rel_description'], elem['first_main'], elem['second_main']));
        $(".relationship#" + elem['relationship_id']).offset(position);

        if (DIAGRAM_TYPE === "idef1x") {

            add_relation_sign(elem['relationship_id']);
        }
    });

    draggable_box();
    save_diagram_img();
}

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
            DIAGRAM_TYPE = result['diagram_type'];

            diagram_constructor(result);
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


// DATABASE HANDLER
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
                    let mssql_connect_description = $(".mssql_connect_description");

                    let server_name_value = server_name.val();
                    let login_value = login.val();
                    let password_value = password.val();
                    let database_value = database.val();

                    if (server_name_value !== "" && login_value !== "" && password_value !== "" && database_value !== "") {
                        try {
                            let connect = mssql_connect(server_name_value, database_value, login_value, password_value);
                            console.log(connect);

                            if ([18456, 0].indexOf(connect['code']) !== -1) {

                                mssql_connect_description.text(connect['description']);
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
                            console.log("err", e);
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
                                "autoWidth": true,
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

            let result = NaN;

            jQuery.each(data_diagram['attributes'], function (attr_index, attribute) {
                if (attribute['key'] === 'PK' && attribute['parent'] === String(main_id)) {
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
                    if (EXCEPT_DATA_TYPE_LENGTH.indexOf(attribute['data_type']) !== -1) {
                        data_len = "";
                    } else {
                        data_len = "(" + attribute['len_data'] + ")";
                    }

                    if (attribute['key'] === "PK") {
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


                    if (EXCEPT_DATA_TYPE_LENGTH.indexOf(first_main_PK['data_type']) !== -1) {
                        first_main_PK_len = "";
                    } else {
                        first_main_PK_len = "(" + first_main_PK['len_data'] + ")";
                    }

                    attr_str += "  " + first_main_PK_name + "_FK " + first_main_PK_type + first_main_PK_len + ", \n  " +
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