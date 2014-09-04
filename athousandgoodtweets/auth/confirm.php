<?php
include 'php/EpiCurl.php';
include 'php/EpiOAuth.php';
include 'php/EpiTwitter.php';
include 'secret.php';

$twitterObj = new EpiTwitter(TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET); //, $userToken, $userSecret);

$twitterObj->setToken($_GET['oauth_token']);
$token = $twitterObj->getAccessToken();
$twitterObj->setToken($token->oauth_token, $token->oauth_token_secret);
$twitterInfo= $twitterObj->get_accountVerify_credentials();
// $twitterInfo->response;

setcookie('token', $token->oauth_token, time()+60*60*24*30, '/'); // 1 month

$tok = file_put_contents('oauth/' . $token->oauth_token, $twitterInfo->screen_name);
$sec = file_put_contents('oauth/' . $twitterInfo->screen_name . '-sec', $token->oauth_token_secret);
header("Location: /");
?>
