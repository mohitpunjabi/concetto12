<?php

include('secret.php');
include('php/EpiCurl.php');
include('php/EpiOAuth.php');
include('php/EpiTwitter.php');

$twitterObj = new EpiTwitter(TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET);
$twitterInfo = null;
$mentions = null;
$timeline = null;

if ($_COOKIE['token'] && file_exists('oauth/' . $_COOKIE['token'])) {
    $username = file_get_contents('oauth/' . $_COOKIE['token']);
    $userToken = $_COOKIE['token'];
    $userSecret = file_get_contents('oauth/' . $username . '-sec');
    
    $twitterObj->setToken($userToken, $userSecret);
    $twitterInfo = $twitterObj->get_accountVerify_credentials();
    // access keys directly
    
    if (!$twitterInfo->screen_name) {
        // reset 
        $twitterObj = new EpiTwitter(TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET);
        $twitterInfo = null;
    }
    
    if ($twitterInfo && isset($_GET['status']) && $_GET['status']) {
        $status_id = $_GET['status'];
        if (preg_match('/status\/(\d+)/', $status_id, $matches)) {
            $status_id = $matches[1];
        }

        $method = "get_statusesShow" . $status_id;
        $raw_status = $twitterObj->$method();
        $status = $linkify->run($raw_status->response['text']);
        
        $method = "get_statusesMentions";
        $mentions = $twitterObj->$method(array('count' => 200));
    }
}

if ($twitterInfo == null) {
	echo '<a href="' . $twitterObj->getAuthorizationUrl() . '">auth required</a>';
} else {
	echo "You're already authenticated, go back to <a href=\"/\">Snap Bird</a> to search with friends";
}
?>
