<?php
/**
 * Created by PhpStorm.
 * User: yasla
 * Date: 04.01.2019
 * Time: 14:45
 */

include 'lib/hybridauth/autoload.php';

use Hybridauth\Hybridauth;

require_once('config.php');

try {
    $hybridauth = new Hybridauth($auth_config);
    $adapters = $hybridauth->getConnectedAdapters();
} catch (\Hybridauth\Exception\InvalidArgumentException $e) {
    print_r($e);
} catch (\Hybridauth\Exception\UnexpectedValueException $e) {
    print_r($e);
}


if (isset($_POST['log']) and $_POST['log'] === "login") {

    $email = htmlspecialchars(stripslashes($_POST['login']));
    $password = htmlspecialchars(stripslashes($_POST['password']));

    if (preg_match("/^[0-9a-z_\.]+@[0-9a-z_^\.]+\.[a-z]{2,6}$/i", $email)) {

        $stmt = $db->prepare('SELECT * FROM  users WHERE email = :email');
        $stmt->bindValue(':email', $email);
        $res = $stmt->execute();
        $user = $res->fetchArray();

        $salt = hash("sha256", $email);
        $password = str_replace($salt, "", $password);

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

} elseif (isset($_POST['log']) and $_POST['log'] === "get_salt") {

    $email = htmlspecialchars(stripslashes($_POST['login']));
    $salt = hash("sha256", $email);
    echo('{"salt" : "' . $salt . '"}');
    exit;
}

if ($adapters) {
    foreach ($adapters as $provider_name => $adapter) :
        $adapter_info = $adapter->getUserProfile();


        $user = new stdClass();
        $user->provider = $provider_name;
        $user->social_id = $adapter_info->identifier;
        $user->name = $adapter_info->firstName . " " . $adapter_info->lastName;
        $user->email = $adapter_info->email;
        $user->social_page = $adapter_info->profileURL;
        $user->gender = $adapter_info->gender;
        $user->birthday = $adapter_info->birthDay . "." . $adapter_info->birthMonth . "." . $adapter_info->birthYear;
        $user->avatar = $adapter_info->photoURL;

        $stmt = $db->prepare('SELECT * FROM users WHERE social_id = :social_id');
        $stmt->bindValue(':social_id', $user->social_id);
        $res = $stmt->execute();
        $res = $res->fetchArray();

        // регистрация
        if (!$res['user_id']) {
            $stmt = $db->prepare('INSERT INTO users(provider, social_id, name, email, social_page, gender, birthday, avatar) VALUES (:provider, :social_id, :name, :email, :social_page, :gender, :birthday, :avatar)');
        } else {
            $stmt = $db->prepare('UPDATE users SET provider = :provider, name = :name, email = :email, social_page = :social_page, gender = :gender, birthday = :birthday, avatar = :avatar WHERE social_id = :social_id');
        }
        $stmt->bindValue(':provider', $user->provider);
        $stmt->bindValue(':social_id', $user->social_id);
        $stmt->bindValue(':name', $user->name);
        $stmt->bindValue(':email', $user->email);
        $stmt->bindValue(':social_page', $user->social_page);
        $stmt->bindValue(':gender', $user->gender);
        $stmt->bindValue(':birthday', $user->birthday);
        $stmt->bindValue(':avatar', $user->avatar);
        $res = $stmt->execute();
        // получаем данные пользователя в сессию
        $stmt = $db->prepare('SELECT * FROM  users WHERE social_id = :social_id');
        $stmt->bindValue(':social_id', $user->social_id);
        $res = $stmt->execute();
        $user = $res->fetchArray();
        $db->close();
        $_SESSION['user'] = $user;
        header("Location:index.php");
        exit;
    endforeach;
}
?>


<div class="background container-fluid h-100">
    <div class="row h-100 justify-content-center align-items-center">
        <div class="col-xl-4 col-lg-5 col-md-6 col-sm-8 col-11">
            <div class="main_block">
                <a href="index.php">
                    <div class="logo">
                        <img class="logo_img" src="dashboard/img/logo.svg" alt="">
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

                <div class="login_social_lable">
                    Войти с помощью социальных сетей
                </div>
                <div class="social_login_block d-flex justify-content-center">
                    <a href="<? echo($auth_config['callback'] . "?provider=Vkontakte") ?>">
                        <div class="login_round_btn vk"></div>
                    </a>
                    <a href="<? echo($auth_config['callback'] . "?provider=Google") ?>">
                        <div class="login_round_btn google"></div>
                    </a>
                    <a href="<? echo($auth_config['callback'] . "?provider=Yandex") ?>">
                        <div class="login_round_btn yandex"></div>
                    </a>
                </div>

                <div class="registration">
                    <a href="?registration=true">Регистрация</a>
                </div>

            </div>
            <div class="footer row justify-content-center align-item-bottom">
                <div class="footer_description mt-auto">
                    draw.db ©
                    <a href="">О проекте</a>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
    $(document).ready(function () {
        $("#login_form").submit(function () {

            let Get_salt = {};
            let LogJSON = {};

            let email = $('input[name="login"]').val();
            let password = $('input[name="password"]').val();

            if (email !== '' && password !== '') {

                Get_salt['login'] = email;
                Get_salt['log'] = "get_salt";

                $.ajax({
                    type: "POST",
                    url: "login.php",
                    data: Get_salt
                }).done(function (msg) {

                    let salt = JSON.parse(msg)['salt'];

                    LogJSON['login'] = email;
                    LogJSON['password'] = salt + CryptoJS.SHA256(password).toString() + salt;
                    LogJSON['log'] = "login";

                    $.ajax({
                        type: "POST",
                        url: "login.php",
                        data: LogJSON
                    }).done(function (msg) {
                        let status = JSON.parse(msg);
                        if (status["error"] === "bad_login") {
                            $('#invalid_login').html('Некорректно введен адрес электронной почты.');
                            $('input#login').addClass('is-invalid');
                        } else if (status["error"] === "bad_password") {
                            $('#invalid_password').html('Введен неверный пароль.');
                            $('input#password').addClass('is-invalid');
                        } else if (status["error"] === "none") {
                            window.location.href = 'index.php';
                        }
                    });

                });

            }
            $('#login_form').addClass('was-validated');
            return false;
        });
    })

</script>