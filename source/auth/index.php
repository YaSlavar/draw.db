<?php
/**
 * A simple example that shows how to use multiple providers.
 */

include '../lib/hybridauth/autoload.php';
require_once('../config.php');

use Hybridauth\Exception\Exception;
use Hybridauth\Hybridauth;
use Hybridauth\HttpClient;
use Hybridauth\Storage\Session;

try {
    /**
     * Feed configuration array to Hybridauth.
     */
    $hybridauth = new Hybridauth($auth_config);

    /**
     * Initialize session storage.
     */
    $storage = new Session();

    /**
     * Hold information about provider when user clicks on Sign In.
     */
    if (isset($_GET['provider'])) {
        $storage->set('provider', $_GET['provider']);
    }

    /**
     * When provider exists in the storage, try to authenticate user and clear storage.
     *
     * When invoked, `authenticate()` will redirect users to provider login page where they
     * will be asked to grant access to your application. If they do, provider will redirect
     * the users back to Authorization callback URL (i.e., this script).
     */
    if ($provider = $storage->get('provider')) {
        $hybridauth->authenticate($provider);
        $storage->set('provider', null);
    }

    /**
     * Redirects user to home page (i.e., index.php in our case)
     */
    HttpClient\Util::redirect('http://localhost');
} catch (Exception $e) {
    echo $e->getMessage();
}