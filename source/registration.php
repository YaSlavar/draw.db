<?php

require_once 'config.php';

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
        $("#registration").submit(function () {

            let RegJSON = {};
            let name_new_user = $('input[name="name"]').val();
            let email_new_user = $('input[name="login"]').val();
            let password_new_user = $('input[name="password"]').val();

            if (name_new_user !== '' && email_new_user !== '' && password_new_user !== '') {

                RegJSON['name'] = name_new_user;
                RegJSON['login'] = email_new_user;
                RegJSON['password'] = CryptoJS.SHA256(password_new_user).toString();
                RegJSON['registration'] = true;

                $.ajax({
                    type: "POST",
                    url: "registration.php",
                    data: RegJSON
                }).done(function (msg) {
                    let status = JSON.parse(msg);
                    if (status["error"] === "user_registred") {
                        $('#email_invalid_feedback').html('Пользователь с таким адресом электронной почты уже зарегистрирован!');
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