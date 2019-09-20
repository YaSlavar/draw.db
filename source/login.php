<?php
/**
 * Created by PhpStorm.
 * User: yasla
 * Date: 04.01.2019
 * Time: 14:45
 */


require_once('config.php');


if (isset($_POST['log'])) {
    $email = htmlspecialchars(stripslashes($_POST['login']));
    $password = htmlspecialchars(stripslashes($_POST['password']));

    if (preg_match("/^[0-9a-z_\.]+@[0-9a-z_^\.]+\.[a-z]{2,6}$/i", $email)) {

        $stmt = $db->prepare('SELECT * FROM  users WHERE email = :email');
        $stmt->bindValue(':email', $email);
        $res = $stmt->execute();
        $user = $res->fetchArray();

        if (password_verify($password, $user['password'])) {
            $_SESSION['user'] = $user;
            $db->close();
            echo('{"error": "none"}');
            exit;
        } else {
            echo('{"error": "bad_password"}');
            exit;
        }

    } else {
        echo('{"error": "bad_login"}');
        exit;
    }
}


?>


<div class="background container-fluid h-100">
    <div class="row h-100 justify-content-center align-items-center">
        <div class="col-xl-4 col-lg-5 col-md-6 col-sm-8 col-11">
            <div class="main_block">
                <a href="index.php">
                    <div class="logo">
                        <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 218.7 40.7" style="enable-background:new 0 0 218.7 40.7;" xml:space="preserve">
                        <g>
                            <path d="M0,31.7L4.2,5.4h5.1l6.6,15.8l6.6-15.8h5.1l4.2,26.3h-6.1L23.5,16l-6.6,15.7h-2.1L8.2,16L6.1,31.7H0z"></path>
                            <path d="M48.2,11.8c-2-1.8-3.7-1.9-4.4-1.9c-0.8,0-1.9,0.1-2.6,0.9c-0.4,0.4-0.7,1-0.7,1.7c0,0.6,0.2,1.1,0.6,1.5
                                c0.6,0.6,1.5,0.8,3.3,1.5l2,0.8c1.1,0.4,2.6,1,3.6,2c1.5,1.5,1.9,3.4,1.9,4.9c0,2.7-0.9,5.1-2.3,6.5c-2.3,2.4-5.7,2.7-7.5,2.7
                                c-1.9,0-3.6-0.3-5.2-1.1c-1.3-0.7-2.9-1.9-3.9-2.9l3.2-4.3c0.7,0.7,1.7,1.6,2.4,2c1,0.6,2.1,0.9,3.3,0.9c0.8,0,1.9-0.2,2.8-0.9
                                c0.5-0.4,0.9-1.1,0.9-2.1c0-0.9-0.4-1.4-0.9-1.9c-0.7-0.6-2.3-1.2-3.1-1.5l-2.2-0.8c-1.2-0.4-2.6-1-3.7-2.1
                                c-1.4-1.5-1.6-3.3-1.6-4.6c0-2.3,0.7-4.3,2.3-5.9c1.9-1.9,4.1-2.4,6.5-2.4c1.8,0,4.7,0.3,7.8,2.6L48.2,11.8z"></path>
                            <path d="M77,21c0,2.5-0.3,5.6-2.9,8.3c-2.5,2.6-5.4,3-8.2,3c-2.8,0-5.7-0.4-8.2-3c-2.6-2.7-2.9-5.8-2.9-8.3V5.4h6.1v15.4
                                c0,1.1,0.1,3.1,1.4,4.4c1.1,1.1,2.5,1.4,3.7,1.4c1.1,0,2.6-0.2,3.7-1.4c1.3-1.3,1.4-3.3,1.4-4.4V5.4H77V21z"></path>
                        </g>
                        <g>
                            <path d="M80.6,14.1h5.7v2.1c1.7-2.2,3.8-2.6,5.4-2.6c1.5,0,3.6,0.3,5.1,1.8c1.7,1.7,1.8,3.8,1.8,5.2v11.1h-5.7v-9
                                c0-1.1,0-2.6-0.9-3.5c-0.4-0.4-1.1-0.8-2.2-0.8c-1.2,0-1.9,0.5-2.4,0.9c-0.9,0.9-1.1,2.2-1.1,3.4v9h-5.7
                                C80.6,31.7,80.6,14.1,80.6,14.1z"></path>
                            <path d="M104.6,3.3c1.9,0,3.3,1.5,3.3,3.3c0,1.9-1.5,3.3-3.3,3.3c-1.9,0-3.3-1.5-3.3-3.3C101.3,4.7,102.8,3.3,104.6,3.3z
                                 M107.5,14.1v17.6h-5.7V14.1H107.5z"></path>
                            <path d="M114.8,14.1l4.5,9.4l4.5-9.4h6.2l-9,17.6h-3.6l-8.9-17.6H114.8z"></path>
                            <path d="M147.3,23.9h-13.1c0,0.9,0.4,2.2,1.1,3c0.9,0.9,2.1,1.1,2.9,1.1c0.8,0,1.7-0.2,2.3-0.5c0.1,0,0.8-0.5,1.2-1.5l5.4,0.6
                                c-0.8,2.5-2.4,3.8-3.4,4.4c-1.7,1-3.6,1.3-5.6,1.3c-2.6,0-5-0.5-7-2.5c-1.5-1.5-2.6-3.9-2.6-6.8c0-2.5,0.9-5.1,2.7-7
                                c2.1-2.1,4.8-2.5,6.8-2.5s4.8,0.4,7,2.6c2.1,2.2,2.5,5,2.5,7.1v0.7H147.3z M142.1,20.5c0-0.2-0.3-1.3-1.1-2.1c-0.6-0.6-1.5-1-2.7-1
                                c-1.5,0-2.3,0.6-2.9,1.1c-0.4,0.5-0.8,1.1-1,1.9h7.7V20.5z"></path>
                            <path d="M148.5,14.1h5.7v2.8c0.5-1,1.3-1.9,2.2-2.4c0.9-0.6,1.9-0.8,3-0.8c0.7,0,1.2,0.1,1.9,0.3l-0.3,5.3
                                c-0.8-0.4-1.6-0.6-2.6-0.6c-1.2,0-2.1,0.4-2.8,1.2c-1.3,1.3-1.4,3.2-1.4,4.7v7.1h-5.7L148.5,14.1L148.5,14.1z"></path>
                            <path d="M172.9,18.6c-0.9-0.5-2-1-3.1-1c-0.6,0-1.3,0.2-1.6,0.5c-0.2,0.2-0.4,0.5-0.4,0.8c0,0.4,0.3,0.6,0.6,0.8
                                c0.4,0.2,1,0.4,1.7,0.6l1.5,0.5c1,0.3,2,0.7,2.9,1.5c1,0.9,1.4,2,1.4,3.4c0,2.3-1,3.8-1.8,4.6c-1.7,1.7-3.9,2-5.7,2
                                c-2.4,0-4.9-0.5-7.2-2.5l2.4-3.8c0.6,0.5,1.3,1,1.9,1.3c0.8,0.4,1.6,0.6,2.4,0.6c0.4,0,1.3,0,1.8-0.4c0.4-0.3,0.6-0.7,0.6-1.1
                                c0-0.3-0.1-0.7-0.6-1c-0.4-0.2-0.9-0.4-1.7-0.6l-1.4-0.4c-1-0.3-2.1-0.9-2.8-1.6c-0.8-0.9-1.3-1.9-1.3-3.2c0-1.7,0.7-3.1,1.7-4.1
                                c1.6-1.5,3.7-1.8,5.3-1.8c2.6,0,4.4,0.7,5.8,1.5L172.9,18.6z"></path>
                            <path d="M180.1,3.3c1.9,0,3.3,1.5,3.3,3.3c0,1.9-1.5,3.3-3.3,3.3c-1.9,0-3.3-1.5-3.3-3.3C176.8,4.7,178.3,3.3,180.1,3.3z M183,14.1
                                v17.6h-5.7V14.1H183z"></path>
                            <path d="M192,18.7v13h-5.7v-13h-2v-4.6h2V8.4h5.7v5.7h3.5v4.6C195.5,18.7,192,18.7,192,18.7z"></path>
                            <path d="M204.3,29.5l-8.4-15.4h6.6l5,9.6l4.9-9.6h6.4l-14.2,26.7h-6.4L204.3,29.5z"></path>
                        </g>
                        </svg>
                    </div>
                </a>
                <form id="login_form" class="login_form" novalidate>
                    <div class="form-group">
                        <label for="login">Логин (E-mail)</label>
                        <input name="login" type="email" class="form-control" id="login" placeholder="Введите Email"
                               required>
                        <div id="invalid_login" class="invalid-feedback">
                            Необходимо заполнить поле.
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="password">Пароль</label>
                        <input name="password" type="password" class="form-control" id="password"
                               placeholder="Введите пароль" required>
                        <div id="invalid_password" class="invalid-feedback">
                            Необходимо заполнить поле.
                        </div>
                    </div>
                    <button id="login_submit" type="submit" class="login_btn btn btn-primary btn-block">Войти</button>
                </form>
				<!--
                <div class="login_social_lable">
                    Войти с помощью социальных сетей
                </div>
                <div class="social_login_block d-flex justify-content-center">
                    <a href="<? #echo($adapters["vk"]->getAuthUrl()) ?>">
                        <div class="login_round_btn vk"></div>
                    </a>
                    <a href="<? #echo($adapters["google"]->getAuthUrl()) ?>">
                        <div class="login_round_btn google"></div>
                    </a>
                    <a href="<? #echo($adapters["yandex"]->getAuthUrl()) ?>">
                        <div class="login_round_btn yandex"></div>
                    </a>
                    <a href="<? #echo($adapters["mailru"]->getAuthUrl()) ?>">
                        <div class="login_round_btn mailru"></div>
                    </a>
                </div>
				-->
                <div class="registration">
                    <a href="?registration=true">Регистрация</a>
                </div>
				
            </div>
        </div>
    </div>
</div>

<script>
    $(document).ready(function () {
        $("#login_form").submit(function (event) {
            var LogJSON = {};

            var email = $('input[name="login"]').val();
            var password = $('input[name="password"]').val();

            if (email !== '' && password !== '') {

                LogJSON['login'] = email;
                LogJSON['password'] = password;
                LogJSON['log'] = true;

                $.ajax({
                    type: "POST",
                    url: "login.php",
                    data: LogJSON
                }).done(function (msg) {
                    var status = JSON.parse(msg);
                    if (status["error"] === "bad_login") {
                        $('#invalid_login').html('Некорректно введен адрес электронной почты.')
                        $('input#login').addClass('is-invalid');
                    } else if (status["error"] === "bad_password") {
                        $('#invalid_password').html('Введен неверный пароль.')
                        $('input#password').addClass('is-invalid');
                    } else if (status["error"] === "none") {
                        window.location.href = 'index.php';
                    }
                });
            }
            $('#login_form').addClass('was-validated');
            return false;
        });
    })

</script>