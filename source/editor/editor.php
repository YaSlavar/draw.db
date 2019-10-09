<header class="header fixed-top">
    <div class="container-fluid">
        <div class="row">
            <div class="col-sm-auto col-auto">
                <a href="?diagram_list=true" class="d-flex back_to_diagram_list_box">
                    <div class="back_to_diagram_list"></div>
                    <div class="header_text d-none d-sm-block">К списку диаграмм</div>
                </a>
            </div>
            <div id="logo" class="col-sm-auto col d-none d-sm-block">
                DB Logic Assistant
            </div>
            <div class="col d-none d-sm-block"></div>
            <div id="diagram_name" class="col-sm-auto col-4 header_text"></div>
            <div id="author_name"
                 class="col-sm-auto d-none d-sm-block header_text"><? echo($_SESSION['user']['name']); ?></div>
        </div>
    </div>
</header>

<div class="container-fluid work_zone">
    <div class="work_zone_container" id="screenshots_zone">
        <svg class="canvas">
            <pattern id="grid" patternUnits="userSpaceOnUse" width="10" height="10" patternTransform="scale(1)">
                <line x1="5" y1="0" x2="5" y2="10" style="stroke: #cccccc3d;"></line>
                <line x1="0" y1="5" x2="10" y2="5" style="stroke: #cccccc3d;"></line>
            </pattern>
            <rect fill="url(#grid)" width="100%" height="100%" style="stroke-width:1;stroke:#e7e7e7"></rect>
        </svg>
    </div>
</div>

<div class="option_bottoms fix-bottom-left padding-20">
    <div class="toggle_options_bottom_case">
        <div class="save_diagram_img light_bottom">
            <svg class="btn_icon" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24">
                <path d="M19 7v2.99s-1.99.01-2 0V7h-3s.01-1.99 0-2h3V2h2v3h3v2h-3zm-3 4V8h-3V5H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8h-3zM5 19l3-4 2 3 3-4 4 5H5z"
                      fill="#3f51b5"></path>
                <path d="M0 0h24v24H0z" fill="none"></path>
            </svg>
            <div class="btn_text">
                Экспорт диаграммы
            </div>
        </div>
        <div class="generate_sql light_bottom">
            <svg class="btn_icon" xmlns="http://www.w3.org/2000/svg" fill="#3F51B4" width="40" viewBox="0 0 24 24">
                <path fill="none" d="M0 0h24v24H0V0z"></path>
                <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"></path>
            </svg>
            <div class="btn_text">
                Сгенерировать SQL запрос
            </div>
        </div>
        <div class="save_diagram light_bottom">
            <svg class="btn_icon" xmlns="http://www.w3.org/2000/svg" fill="#3F51B4" width="40" viewBox="0 0 24 24">
                <path d="M0 0h24v24H0z" fill="none"></path>
                <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"></path>
            </svg>
            <div class="btn_text">
                Сохранить диаграмму
            </div>
        </div>
    </div>
    <div class="btn-primary dark_bottom round_bottom d-inline-block" id="toggle_options">
        <svg class="btn_icon_blue" xmlns="http://www.w3.org/2000/svg" fill="white" width="40" height="40"
             viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none"></path>
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
        </svg>
    </div>
    <div class="btn-primary dark_bottom round_bottom d-inline-block" id="add_new_main" onclick="add_main();">
        <svg class="btn_icon_blue" xmlns="http://www.w3.org/2000/svg" fill="white" width="40" height="40"
             viewBox="0 0 24 24">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>
            <path d="M0 0h24v24H0z" fill="none"></path>
        </svg>
    </div>
</div>

<div class="zoom_bottoms fix-middle-right padding-right-20">
    <button id="zoom_plus" class="btn-light light_bottom round_bottom-50">
        <svg class="btn_icon_blue" xmlns="http://www.w3.org/2000/svg" fill="white" width="30" height="30"
             viewBox="0 0 24 24">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="#3f51b5"></path>
            <path d="M0 0h24v24H0z" fill="none"></path>
        </svg>
    </button>
    <button id="zoom_minus" class="btn-light light_bottom round_bottom-50">
        <svg class="btn_icon_blue" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 8 24 24">
            <path d="M6 19h12v2H6z" fill="#3f51b5"></path>
            <path fill="none" d="M0 0h24v24H0V0z"></path>
        </svg>
    </button>
    <button id="undo_zoom" class="btn-light light_bottom round_bottom-50">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z" fill="#3f51b5"></path>
            <path d="M0 0h24v24H0z" fill="none"></path>
        </svg>
    </button>
</div>

<div class="notification_tail fix-bottom-right padding-20">
    <div class="toast toast_tail" role="alert" aria-live="assertive" aria-atomic="true" data-delay="2000">
        <div class="toast-header">
            <strong class="mr-auto">Уведомление</strong>
            <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="toast-body">
            Диаграмма успешно сохранена!
        </div>
    </div>
</div>


<? include('modal_window.php'); ?>


<script type="text/javascript">
    $(document).ready(function () {

        let work_zone_container = $('.work_zone_container');

        work_zone_container.draggable();

        load_diagram();

        let toggle_options_bottom_case = $('.toggle_options_bottom_case');

        $("#toggle_options").click(function () {
            toggle_options_bottom_case.slideToggle();
        });

        $('.save_diagram').click(function () {
                save_diagram();
                toggle_options_bottom_case.slideToggle();
        });

        $('.generate_sql').click(function () {
                open_server_connect_window();
                toggle_options_bottom_case.slideToggle();
        });

        $('.save_diagram_img').click(function () {
                open_screenshot_window();
                toggle_options_bottom_case.slideToggle();
        });

        $('#zoom_plus').click(function () {
            zoom_element(work_zone_container, 1, 0.1, 200);
        });

        $('#zoom_minus').click(function () {
            zoom_element(work_zone_container, -1, 0.1, 200);
        });

        $('#undo_zoom').click(function () {
            undo_zoom(work_zone_container);
        });

        $(work_zone_container).mousewheel(function(event) {
            zoom_element($(this), event);
        });

        let menu = new BootstrapMenu('#screenshots_zone', {
            actions: [{
                name: 'Создать новую сущность',
                onClick: add_main
            },{
                name: 'Сохранить диаграмму',
                onClick: save_diagram
            },{
                name: 'Экспортировать диаграмму',
                onClick: open_screenshot_window
            }
            ]
        });

    });
</script>



