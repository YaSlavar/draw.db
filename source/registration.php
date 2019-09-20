<?php

require_once 'config.php';
require_once 'lib/SocialAuther/autoload.php';

if (isset($_POST['registration'])) {
    $name = htmlspecialchars(stripslashes($_POST['name']));
    $email = htmlspecialchars(stripslashes($_POST['login']));
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
    if (empty($_POST['name'])) {
        $status = '{"error": "name"}';
    } elseif (!preg_match("/^[0-9a-z_\.]+@[0-9a-z_^\.]+\.[a-z]{2,6}$/i", $email)) {
        $status = '{"error": "email"}';
    } elseif (empty($_POST['password'])) {
        $status = '{"error": "password"}';
    }
    $stmt = $db->prepare('SELECT * FROM  users WHERE email = :email');
    $stmt->bindValue(':email', $email);
    $res = $stmt->execute();
    $res = $res->fetchArray();
    if ($res['email']) {
        $status = '{"error": "user_registred"}';
    }
    if ($status) {
        echo($status);
        exit;
    } else {
        $stmt = $db->prepare('INSERT INTO users(name, email, password) VALUES(:name, :email, :password)');
        $stmt->bindValue(':name', $name);
        $stmt->bindValue(':email', $email);
        $stmt->bindValue(':password', $password);
        $res = $stmt->execute();
        // получаем данные пользователя в сессию
        $stmt = $db->prepare('SELECT * FROM  users WHERE email = :email');
        $stmt->bindValue(':email', $email);
        $res = $stmt->execute();
        $user = $res->fetchArray();
        $_SESSION['user'] = $user;
        $db->close();
        echo('{"error": "none"}');
        exit;
    }
} elseif ($_GET['code']) {
    $adapters = array();
    foreach ($adapterConfigs as $adapter => $settings) {
        $class = 'SocialAuther\Adapter\\' . ucfirst($adapter);
        $adapters[$adapter] = new $class($settings);
    }
    if (isset($_GET['provider']) && array_key_exists($_GET['provider'], $adapters)) {
        $auther = new SocialAuther\SocialAuther($adapters[$_GET['provider']]);
    }
    if ($auther->authenticate()) {
        $user = new stdClass();
        $user->provider = $auther->getProvider();
        $user->social_id = $auther->getSocialId();
        $user->name = $auther->getName();
        $user->email = $auther->getEmail();
        $user->social_page = $auther->getSocialPage();
        $user->sex = $auther->getSex();
        $user->birthday = $auther->getBirthday();
        $user->avatar = $auther->getAvatar();
    }
    $stmt = $db->prepare('SELECT * FROM users WHERE social_id = :social_id');
    $stmt->bindValue(':social_id', $user->social_id);
    $res = $stmt->execute();
    $res = $res->fetchArray();
    // регистрация
    if (!$res['user_id']) {
        $stmt = $db->prepare('INSERT INTO users(provider, social_id, name, email, social_page, sex, birthday, avatar) VALUES (:provider, :social_id, :name, :email, :social_page, :sex, :birthday, :avatar)');
    } else {
        $stmt = $db->prepare('UPDATE users SET provider = :provider, name = :name, email = :email, social_page = :social_page, sex = :sex, birthday = :birthday, avatar = :avatar WHERE social_id = :social_id');
    }
    $stmt->bindValue(':provider', $_GET['provider']);
    $stmt->bindValue(':social_id', $user->social_id);
    $stmt->bindValue(':name', $user->name);
    $stmt->bindValue(':email', $user->email);
    $stmt->bindValue(':social_page', $user->social_page);
    $stmt->bindValue(':sex', $user->sex);
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
} ?>


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
                <form id="registration" action="registration.php" method="post" class="login_form needs-validation"
                      novalidate>
                    <div class="form-group">
                        <label for="name">Имя</label>
                        <input name="name" type="text" class="form-control" id="name" placeholder="Введите имя"
                               required>
                        <div class="invalid-feedback">
                            Необходимо заполнить поле.
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="login">Логин</label>
                        <input name="login" type="email" class="form-control" id="login" placeholder="Введите Email"
                               required>
                        <div class="invalid-feedback" id="email_invalid_feedback">
                            Необходимо корректно заполнить поле.
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="password">Пароль</label>
                        <input name="password" type="password" class="form-control" id="password"
                               placeholder="Введите пароль" required>
                        <div class="invalid-feedback">
                            Необходимо заполнить поле.
                        </div>
                    </div>
                    <button id="registration_submit" type="submit" class="login_btn btn btn-primary btn-block">
                        Зарегистрироваться
                    </button>
                    <br>
                    <a href="index.php" class="login_btn">
                        <div class="login_btn btn btn-light btn-block">Назад</div>
                    </a>
                </form>
            </div>
        </div>
    </div>
</div>


<script>
    $(document).ready(function () {
        $("#registration").submit(function (event) {

            var RegJSON = {};
            var name_new_user = $('input[name="name"]').val();
            var email_new_user = $('input[name="login"]').val();
            var password_new_user = $('input[name="password"]').val();

            if (name_new_user !== '' && email_new_user !== '' && password_new_user !== '') {

                RegJSON['name'] = name_new_user;
                RegJSON['login'] = email_new_user;
                RegJSON['password'] = password_new_user;
                RegJSON['registration'] = true;

                $.ajax({
                    type: "POST",
                    url: "registration.php",
                    data: RegJSON
                }).done(function (msg) {
                    let status = JSON.parse(msg);
                    if (status["error"] === "user_registred") {
                        $('#email_invalid_feedback').html('Пользователь с таким адресом электронной почты уже зарегистрирован!')
                        $('input#login').addClass('is-invalid');
                    } else if (status["error"] === "none") {
                        window.location.href = 'index.php';
                    }
                });
            }

            $('#registration').addClass('was-validated');
            return false;
        });
    })
</script>