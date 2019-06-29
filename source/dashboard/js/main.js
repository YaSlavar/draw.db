function randInt() {
    let min = 0;
    let max = 999;
    return Math.floor(Math.random() * (max - min + 1)) + min + String(Date.now());
}


function create_new_diagram() {

    let diagram_name_input = $('input[name="diagram_name"]');
    diagram_name_input.val("");

    let create_new_diagram_window = $("#craete_new_diagram");
    create_new_diagram_window.modal("toggle");

    $("#form_new_diagram").submit(function (event) {
        event.preventDefault();
        let Out_JSON = {};
        let name_new_diagram = diagram_name_input.val();

        if (name_new_diagram !== "") {

            Out_JSON['diagram_id'] = randInt();
            Out_JSON['diagram_name'] = name_new_diagram;

            $.ajax({
                type: "POST",
                url: "editor/save.php",
                data: Out_JSON
            }).done(function () {
                window.location.href = "?edit=" + Out_JSON['diagram_id'];
            });
            create_new_diagram_window.modal("toggle");
        }
        diagram_name_input.val("");
        return false;
    });

}


// TODO: дописать удаление
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
            // TODO: ТУТ!!!!
            data: Out_JSON
        }).done(function (msg) {
            let diagram_block = $('.diagram_block[diagram_id=' + diagram_id + ']');
            diagram_block.remove();

            check_delete_modal_window.modal("toggle");
        });
    });


}
