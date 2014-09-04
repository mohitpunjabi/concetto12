<?php
include('auth/secret.php');
include('auth/php/EpiCurl.php');
include('auth/php/EpiOAuth.php');
include('auth/php/EpiTwitter.php');

$twitterObj = new EpiTwitter(TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET);
$twitterInfo = null;

if ($_COOKIE['token'] && file_exists('auth/oauth/' . $_COOKIE['token'])) {
 $username = file_get_contents('auth/oauth/' . $_COOKIE['token']);
 $userToken = $_COOKIE['token'];
 $userSecret = file_get_contents('auth/oauth/' . $username . '-sec');

 $twitterObj->setToken($userToken, $userSecret);
 $twitterInfo = $twitterObj->get_accountVerify_credentials();
 
 if (!$twitterInfo->screen_name) {
      // reset 
      $twitterObj = new EpiTwitter(TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET);
      $twitterInfo = null;
  }  
}

$screen_name = isset($_GET['screen_name']) ? $_GET['screen_name'] : '';
$search = isset($_GET['search']) ? $_GET['search'] : '';
$rawtype = isset($_GET['type']) ? $_GET['type'] : 'timeline';

$type = array(
  'timeline' => $rawtype == 'timeline' ? 'selected' : '',
  'favs' => $rawtype == 'favs' ? 'selected' : '',
  'mentions' => $rawtype == 'mentions' ? 'selected' : '',
  'withfriends' => $rawtype == 'withfriends' ? 'selected' : '',
  'dm_sent' => $rawtype == 'dm_sent' ? 'selected' : '',
  'dm' => $rawtype == 'dm' ? 'selected' : ''
);

if ($type == 'list') {
  $type = 'timeline';
}

?>
<!DOCTYPE html>
<!--
  I wrote this app because the search on Twitter sucks (7 days history). 
  I knew that there something I needed to find in my timeline but couldn't 
  find it. Or it might be favourited but again I couldn't find it - so 
  this app does it for me :-)
  
  - Remy @rem
-->
<html lang="en">
<head>
<title>Snap Bird - search twitter's history</title>
<meta charset="utf-8" />
<link rel="shortcut icon" href="/images/snapbird-icon.png" />
<link rel="apple-touch-icon" href="/images/snapbird-icon.png" />
<!--[if IE]>
  <script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
<![endif]-->
<link rel="stylesheet" href="/snapbird.css" type="text/css" />
</head>
<body class="intro">
  <div id="content">
  <header>
    <h1><a href="/">Snap Bird</a></h1>
    <h2>Search beyond Twitter&rsquo;s history</h2>
  </header>
  <form>
    <article id="controls">
      <fieldset>
        <div>
          <label for="type">Search</label>
          <select name="type" id="type">
            <option <?=$type['timeline']?> value="timeline">Someone&rsquo;s timeline</option>
            <option <?=$type['favs']?> value="favs">Someone&rsquo;s favourites</option>
            <option <?=$type['withfriends']?> value="withfriends">Your friends&rsquo; tweets</option>
            <option <?=$type['mentions']?> value="mentions">Tweets mentioning you</option>
            <option <?=$type['dm_sent']?> value="dm_sent">Your sent direct messages</option>
            <option <?=$type['dm']?> value="dm">Your received direct messages</option>
          </select>
        </div>
        <div>
          <label for="screen_name" id="screen_name_label">Who</label>
          <?php if ($twitterInfo != null) : ?>
          <span id="auth_screen_name"><?= $twitterInfo->screen_name ?></span>
          <?php endif ?>
          <input class="screen_name" type="text" id="screen_name" name="screen_name" placeholder="username" value="<?=$screen_name?>" />
        </div>
        <div>
          <label for="search">For</label>
          <input type="text" id="search" name="search" placeholder="search term" value="<?=$search?>" />
        </div>
      </fieldset>
    </article>
    <div id="worm-and-bird" class="showinfo">
      <input type="submit" value="find it" id="findit-btn" />
        <?php if ($twitterInfo == null) : ?>
        <a id="logininfo" href="<?=$twitterObj->getAuthorizationUrl()?>">
          <span id="info"></span>
          <div id="authenticate-info">
            <p>Twitter allows only <em><strong>you</strong></em> to search within your direct messages, friends&rsquo; tweets, etc.</p>
            <p>Click here to let Twitter know we&rsquo;re authentically searching on your behalf.</p>
          </div>
          <span id="authenticate-button" class="button">Authenticate with <span class="twitter-logo">Twitter</span></span>
        </a>
        <?php else : ?>
        <span id="authenticate-button" class="button"><strong>@<?= $twitterInfo->screen_name ?></strong> authenticated</span>
        <?php endif ?>
      <div id="bird"></div>
    </div>
  </form>
  <article id="results">
    <div id="intro">
      <aside id="tweets_about_snapbird">
        <h2>Tweets about Snap Bird</h2>
        <ul>
          <?php $tweets = json_decode(file_get_contents('snapbird-favs.json'));
          for ($i = 0; $i < count($tweets) && $i < 5; $i++) :
            $tweet = $tweets[$i];
          ?>
          <li>
            <a title="By @<?=$tweet->user->screen_name?>" href="http://twitter.com/<?=$tweet->user->screen_name?>/statuses/<?=$tweet->id?>">
              <img alt="By @<?=$tweet->user->screen_name?>" src="<?=preg_replace("/_normal/", '_mini', $tweet->user->profile_image_url)?>" />
              <?=$tweet->text?>
            </a>
          </li>
          <?php endfor ?>
        </ul>
      </aside>
      <h2>Where can you search?</h2>
      <table>
        <thead>
          <tr>
            <th class="no where">Where</th>
            <th class="twitter">Twitter Search</th>
            <th class="snapbird">Snap Bird</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>The public timeline</td>
            <td class="yes"></td>
            <td class="no"></td>
          </tr>
          <tr>
            <td>Further back than 10 days</td>
            <td class="no"></td>
            <td class="yes"></td>
          </tr>
          <tr>
            <td>Within only your friends&rsquo; tweets</td>
            <td class="no"></td>
            <td class="yes"></td>
          </tr>
          <tr>
            <td>Within your Direct Messages</td>
            <td class="no"></td>
            <td class="yes"></td>
          </tr>
          <tr>
            <td>Within any user&rsquo;s favourites</td>
            <td class="no"></td>
            <td class="yes"></td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <th></th>
            <th class="twitter"></th>
            <th class="snapbird"></th>
          </tr>
        </tfoot>
      </table>
    </div>
    
    <div id="tweets">
      <aside>
        <h3>Snap Bird has matched</h3>
        <p id="matchtweet">none yet</p>
        <h3>out of</h3>
        <p id="outof">200 searched</p>
        <h3>dating back to the <strong id="time">morning</strong> of</h3>
        <p id="datingbackto"></p>
        <a href="/" id="permalink" class="button">Permalink</a>
      </aside>
      
      <ul></ul>
    
      <div id="loading">
        <p>Searching through<br />older tweets</p>
        <p class="num">0-200</p>
        <p>Hit <em>escape</em> to cancel</p>
      </div>
    
      <div id="more">
        <p class="searched">200 tweets searched.</p>
        <p>Haven&rsquo;t found what you&rsquo;re looking for?</p>
        <a class="button light" href="#more">Search next 1,000 tweets</a>
      </div>
    </div>
  
    <div class="clear"></div>
  </article>
  <footer>
    <nav>
      <ul id="navlinks">
        <li><a href="http://snapbird.org">Search Twitter&rsquo;s history</a></li>
        <!-- <li><a href="/about">About</a></li> --> <!-- Coming soon -->
        <li><a href="http://github.com/remy/snapbird">Fork on Github</a></li>
        <?php if ($twitterInfo != null) : ?>
        <li><a id="logout" href="/">Logout</a></li>
        <?php endif ?>
      </ul>
    </nav>
    <ul id="credit">
      <li><a href="http://twitter.com/rem">Built by @rem</a></li>
      <li><a href="http://twitter.com/nicepaul">Designed by @nicepaul</a></li>
      <li><a href="http://twitter.com/stompfrog">Artwork by @stompfrog</a></li>
    </ul>
  </footer>
  <div id="auth">
    <div id="overlay"></div>
    <!-- nasty triple nesting, but necessary for what I'm trying to achieve...I think -->
    <div id="login">
      <div>
        <div>
          <p>To search within your own friends&rsquo; tweets and other personal streams to you, you need to tell Twitter it&rsquo;s OK for us to search.</p>
          <p>Log in with Twitter and on the next screen press &ldquo;allow&rdquo;.</p>
          <p><a class="button" href="<?=$twitterObj->getAuthorizationUrl()?>">Log in using <span class="twitter-logo">Twitter.com</span></a> <a class="button cancel" href="#">Cancel</a></p>
        </div>
      </div>
    </div>    
  </div>
</div>
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>
<script src="/twitterlib/twitterlib.min.js?2011-02-21"></script>
<script src="/snapbird.js?2009-12-31"></script>
<script>
  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-1656750-19']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(ga);
  })();
</script>
</body>
</html>
