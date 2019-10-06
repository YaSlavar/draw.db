function randInt() {
    let min = 0;
    let max = 999;
    return Math.floor(Math.random() * (max - min + 1)) + min + String(Date.now());
}


function create_and_rename_diagram(diagramm_id = NaN) {

    let diagram_name_input = $('input[name="diagram_name"]');
    diagram_name_input.val("");
    let btn_new_diagram = $('#btn_new_diagram');

    let create_and_rename_diagramm_title = $('#create_and_rename_diagramm_title');
    if (!isNaN(diagramm_id)) {
        create_and_rename_diagramm_title.text("Переименование диаграммы");
        btn_new_diagram.text('Переименовать');
    } else {
        create_and_rename_diagramm_title.text("Создание новой диаграммы");
        btn_new_diagram.text('Создать');
    }


    let create_new_diagram_window = $("#craete_new_diagram");
    create_new_diagram_window.modal("toggle");

    $("#form_new_diagram").submit(function (event) {
        event.preventDefault();
        let Out_JSON = {};
        let new_diagramm_name = diagram_name_input.val();

        if (new_diagramm_name !== "") {

            Out_JSON['diagram_name'] = new_diagramm_name;

            if (!isNaN(diagramm_id)) {
                Out_JSON['command'] = "rename";
                Out_JSON['diagram_id'] = diagramm_id;
            } else {
                Out_JSON['command'] = "create";
                Out_JSON['diagram_id'] = randInt();
            }

            $.ajax({
                type: "POST",
                url: "editor/save.php",
                data: Out_JSON
            }).done(function () {
                if (!isNaN(diagramm_id)){
                    let diagramm_block = $('.diagram_block[diagram_id="' + diagramm_id + '"]');
                    let diagramm_block_title = diagramm_block.find('.diagram_title');

                    diagramm_block_title.text(new_diagramm_name);
                    create_new_diagram_window.modal("toggle");
                } else {
                    window.location.href = "?edit=" + Out_JSON['diagram_id'];
                    create_new_diagram_window.modal("toggle");
                }

            });

        }
        diagram_name_input.val("");
        return false;
    });

}


function delete_diagram(diagram_id) {

    let Out_JSON = {
        "diagram_id": diagram_id,
        "command": "delete"
    };



    let diagram_info = load_diagram(diagram_id);

    let check_delete_modal_window = $('#check_for_deletion');
    let btn_delete_diagram = $('#btn_delete_diagram');
    let delete_message = $('#delete_message');

    delete_message.text("Вы действительно хотите удалить диграмму: \"" + diagram_info['diagram_name'] + "\"?");

    check_delete_modal_window.modal("toggle");


    btn_delete_diagram.off('click').on('click', function (event) {
        $.ajax({
            type: "POST",
            url: "editor/save.php",
            data: Out_JSON
        }).done(function (msg) {

            let status = JSON.parse(msg);

            if (status['error'] === 'none') {
                let diagram_block = $('.diagram_block[diagram_id=' + diagram_id + ']');
                diagram_block.remove();

                check_delete_modal_window.modal("toggle");
            } else {
                console.log("При удалении диаграммы произошла ошибка: " + status['error']);
            }

        });
    });


}
