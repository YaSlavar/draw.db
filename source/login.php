<?php
/**
 * Created by PhpStorm.
 * User: yasla
 * Date: 04.01.2019
 * Time: 14:45
 */
require_once 'lib/SocialAuther/autoload.php';
require_once 'config.php';


if(isset($_POST['log'])){
    $email = htmlspecialchars(stripslashes($_POST['login']));
    $password = htmlspecialchars(stripslashes($_POST['password']));

    if (preg_match("/^[0-9a-z_\.]+@[0-9a-z_^\.]+\.[a-z]{2,6}$/i", $email)){

        $stmt = $db->prepare('SELECT * FROM  users WHERE email = :email');
        $stmt->bindValue(':email', $email);
        $res = $stmt->execute();
        $user = $res->fetchArray();

        if (password_verify($password, $user['password'])){
            $_SESSION['user'] = $user;
            $db->close();
            echo('{"error": "none"}');
            exit;
        }else{
            echo('{"error": "bad_password"}');
            exit;
        }

    }else{
        echo('{"error": "bad_login"}');
        exit;
    }
}



?>


<div class="background container-fluid h-100">
    <div class="row h-100 justify-content-center align-items-center">
        <div class="col-xl-4 col-lg-5 col-md-6 col-sm-8 col-11">
            <div class="main_block">
                <a href="index.php"><div class="logo">LOGO</div></a>
                <form id="login_form" class="login_form" novalidate>
                    <div class="form-group">
                        <label for="login">Логин</label>
                        <input name="login" type="email" class="form-control" id="login" placeholder="Введите Email" required>
                        <div id="invalid_login" class="invalid-feedback">
                          Необходимо заполнить поле.
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="password">Пароль</label>
                        <input name="password" type="password" class="form-control" id="password" placeholder="Введите пароль" required>
                        <div id="invalid_password" class="invalid-feedback">
                          Необходимо заполнить поле.
                        </div>
                    </div>
                    <button id="login_submit" type="submit" class="login_btn btn btn-primary btn-block">Войти</button>
                </form>
                <div class="login_social_lable">
                    Войти с помощью социальных сетей
                </div>
                <div class="social_login_block d-flex justify-content-center">
                    <a href="<? echo($adapters["vk"]->getAuthUrl())?>"><div class="login_round_btn vk"></div></a>
                    <a href="<? echo($adapters["google"]->getAuthUrl())?>"><div class="login_round_btn google"></div></a>
                    <a href="<? echo($adapters["yandex"]->getAuthUrl())?>"><div class="login_round_btn yandex"></div></a>
                    <a href="<? echo($adapters["mailru"]->getAuthUrl())?>"><div class="login_round_btn mailru"></div></a>
                </div>
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

            if (email !== '' && password !== ''){

                LogJSON['login'] = email;
                LogJSON['password'] = password;
                LogJSON['log'] = true;

                $.ajax({
                  type: "POST",
                  url: "login.php",
                  data: LogJSON
                }).done(function( msg ) {
                    var status = JSON.parse(msg);
                    if (status["error"] === "bad_login") {
                        $('#invalid_login').html('Некорректно введен адрес электронной почты.')
                        $('input#login').addClass('is-invalid');
                    }else if(status["error"] === "bad_password"){
                        $('#invalid_password').html('Введен неверный пароль.')
                        $('input#password').addClass('is-invalid');
                    }else if(status["error"] === "none"){
                        window.location.href = 'index.php';
                    }
                });
            }
        $('#login_form').addClass('was-validated');
        return false;
        });
    })

</script>