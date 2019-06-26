function randInt() {
    let min = 0;
    let max = 999;
    return Math.floor(Math.random() * (max - min + 1)) + min + String(Date.now());
}

function get_diagram_id() {
    var url_string = window.location.href;
    var url = new URL(url_string);
    return url.searchParams.get("edit");
}


function create_new_diagram() {

    var diagram_name_input = $('input[name="diagram_name"]');
    diagram_name_input.val("");

    var create_new_diagram_window = $("#craete_new_diagram");
    create_new_diagram_window.modal("toggle");

    $("#form_new_diagram").submit(function (event) {
        event.preventDefault();
        var Out_JSON = {};
        var name_new_diagram = diagram_name_input.val();

        if (name_new_diagram !== "") {

            Out_JSON['diagram_id'] = randInt();
            Out_JSON['diagram_name'] = name_new_diagram;

            $.ajax({
                type: "POST",
                url: "editor/save.php",
                data: Out_JSON
            }).done(function (msg) {
                window.location.href = "?edit=" + Out_JSON['diagram_id'];
            });
            create_new_diagram_window.modal("toggle");
        }
        diagram_name_input.val("");
        return false;
    });

}


// todo : дописать удаление диаграмм
function delete_diagram(diagram_id) {

    $.ajax({
        type: "POST",
        url: "editor/save.php",
        data: Out_JSON
    }).done(function (msg) {
        window.location.href = "?edit=" + Out_JSON['diagram_id'];
    });

}
