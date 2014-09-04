var store = (function () {
  var useStorage = !!window.localStorage;
  
  return {
    get: function (key) {
      var value, ca, c, i;

      if (useStorage) {
        value = window.localStorage.getItem(key);
      } else {
        ca = document.cookie.split(';');
        for (i=0; i < ca.length; i++) {
          c = ca[i];
          while (c.charAt(0)==' ') {
            c = c.substring(1, c.length);
          }
          if (c && c.indexOf(key) == 0) {
            value = c.substring(key.length,c.length);
            break;
          }
        }
      }

      if (value == null) {
        value == "";
      }

      return value;
    },
    set: function (key, value) {
      if (useStorage) {
        try {
          window.localStorage.setItem(key, value);
        } catch (e) {
          // could be a QUOTA_EXCEEDED_ERR (for some reason Webkit is giving me this, just needs a restart and it goes away...)
        }
      } else {
        document.cookie = key + "=" + value + "; path=/";
      }      
    }
  };
})();

$('body').keyup(function (event) {
  if (event.which == 27) {
    clearTimeout(timer);
    $('body').removeClass('auth').removeClass('loading');
    twitterlib.cancel();
  }
});

// very hacky code - sorry!
var $tweets = $('#tweets ul'), 
    screen_name = url = state = '', 
    page = 1, 
    limit = 100, // performs better and avoids 502!
    pageMax = null,
    total_tweets = 0, 
    timer = null,
    total_searched = 0,
    statusTop = null, 
    type_string = { 
      timeline : 'tweets', 
      favs: 'favourites', 
      withfriends: 'friends&rsquo; tweets', 
      mentions: 'mentions',
      list: 'member tweets',
      dm: 'received direct messages',
      dm_sent: 'sent direct messages'
    };

twitterlib.cache(true);
twitterlib.custom('withfriends', '/proxy.php?page=%page%');
twitterlib.custom('dm', '/proxy.php?page=%page%&type=direct_messages');
twitterlib.custom('dm_sent', '/proxy.php?page=%page%&type=direct_messagesSent');
twitterlib.custom('mentions', '/proxy.php?page=%page%&type=statusesMentions');

$('#more a').live('click', function () {
  pageMax = 5;
  $('form').submit();
  return false;
});

$(function () {  
  var msie6 = $.browser == 'msie' && $.browser.version < 7;
  if (!msie6) {
    $(window).scroll(function (event) {
      var y;
      // what the y position of the scroll is
      if (statusTop != null) {
        y = $(this).scrollTop();

        // whether that's below the form
        if (y >= statusTop) {
          // if so, ad the fixed class
          $('#tweets aside').addClass('fixed');
        } else {
          // otherwise remove it
          $('#tweets aside').removeClass('fixed');
        }        
      }
    });
  }  
});

var $status = $('#tweets aside p');
function setStatus(matched, searched, oldest) {
  var date = new Date(Date.parse(oldest)),
      hour = date.getHours(),
      niceSearched = (searched+'').replace(/([0-9]+)([0-9]{3})/, "$1,$2");
  
  $status.eq(0).text(matched + (matched == 1 ? ' tweet' : ' tweets'));
  // cheap thousand separator
  $status.eq(1).text(niceSearched + ' searched');
  
  if (oldest != undefined) {
    $status.eq(2).text(twitterlib.time.date(date));

    if (hour > 6 && hour < 12) {
      $('#time').text('morning');
    } else if (hour < 18) {
      $('#time').text('afternoon');
    } else if (hour < 22) {
      $('#time').text('evening');
    } else {
      $('#time').text('night');
    }    
  }
  
  $('#more p.searched').text(niceSearched + ' tweets searched.');
}

function updateLoading(type, currentTotal) {
  var inc = limit;
  if (type == 'favs') inc = 20;
  $('#loading .num').text(total_searched + '-' + (total_searched+inc));
}

var $screen_name_label = $('#screen_name_label'),
    $auth = $('#auth_screen_name'),
    $screen_name = $('#screen_name');

$('#type').bind('change keyup', function () {
  var authRequired = !(this.value == 'timeline' || this.value == 'favs');
  $screen_name_label.text(authRequired ? 'You' : 'Who?');
  if (authRequired && !$auth.length) {
    // show lightbox
    $('body').addClass('auth');
  } else if (authRequired && $auth.is(':hidden')) {
    $screen_name.attr('disabled', true).data('old', $screen_name.val()).val(' '); // space forces the placeholder to hide
    $auth.show();
  } else if (!authRequired && $auth.is(':visible')) { // not checked
    $auth.hide();
    $screen_name.removeAttr('disabled').val( $screen_name.data('old') );
  }
  
  $('#more a').text('Search next ' + (this.value == 'favs' ? 100 : '1,000') + ' tweets');
  
}).trigger('change');

$('form').submit(function (e) {
  e.preventDefault();

  var newstate = $(this).serialize(),
      type = $(this).find('#type').val(),
      search = $('#search').val(),
      filter = twitterlib.filter.format(search);

  screen_name = $.trim(type == 'timeline' || type == 'favs' ? $('#screen_name').val() : $auth.text());


  $('body').removeClass('intro').addClass('results loading');

  if (state != newstate) {
    state = newstate;
    store.set('screen_name', screen_name);
    
    if (screen_name.match(/\//)) {
      type = 'list';
    }

    total_tweets = 0;
    total_searched = 0;
    updateLoading(type);
    $tweets.empty();
    
    var permalink = '/' + screen_name + '/' + type + '/' + encodeURIComponent(search);
    $('#permalink').attr('href', permalink);
    _gaq.push(['_trackPageview', permalink]);

    
    $tweets.append('<li class="searchterm">Searching <em><strong>' + escapeTags(screen_name) + '</strong>&rsquo;s ' + type_string[type] + '</em> for <strong>' + escapeTags(search) + '</strong></li>');
    $('body').addClass('results');
    
    // cancel any outstanding request, and kick off a new one
    twitterlib.cancel()[type](screen_name, { filter: search, rts: true, limit: limit }, function (data, options) {
      total_searched += options.originalTweets.length;
      
      setStatus(total_tweets + data.length, total_searched, options.originalTweets.length ? options.originalTweets[options.originalTweets.length - 1].created_at : null);
      
      // if there's no matched results, but there are raw Tweets, do another call - and keep going until we hit something
      if (data.length == 0 && total_tweets == 0 && options.originalTweets.length > 0) {
        // check if we're doing a page max
        updateLoading(type);
        clearTimeout(timer);
        timer = setTimeout(function () {
          twitterlib.next();
        }, 500);          
        return;
      } else if (total_tweets > 0 && data.length == 0 && options.originalTweets.length > 0 && pageMax > 0) {
        pageMax--;
        updateLoading(type);
        clearTimeout(timer);
        timer = setTimeout(function () {
          twitterlib.next();
        }, 500);
        return;
      }
      
      if (total_tweets) {
        $tweets.find('li:last').addClass('more'); // hard split line
      }
                    
      var i = 0, j = 0, t, r, scrollPos = null, searches = filter.and.concat(filter.or).join('|');
      
      for (i = 0; i < data.length; i++) {
        t = twitterlib.render(data[i], i);
        $tweets.append(t);
        
        if (total_tweets == 0 && i == 0) {
          $tweets.find('li:first').addClass('first');
        } 

        // really tricky code here, we're finding *this* and all nested text nodes
        // then replacing them with our new <strong>text</strong> elements
        $tweets.find('.entry-content:last, .entry-content:last *').contents().filter(function () {
          return this.nodeName == '#text';
        }).each(function () {
          // ignore blank lines
          // make matches bold
          var change = '';
          if (/[^\s]/.test(this.nodeValue)) {
            // encoding of entities happens here, so we need to reverse back out
            change = this.nodeValue.replace(/[<>&]/g, function (m) {
              var r = '&amp;';
              if (m == '<') {
                r = '&lt;';
              } else if (m == '>') {
                r = '&gt;';
              }
              return r;
            }).replace(new RegExp('(' + searches + ')', "gi"), "<strong>$1</strong>");
            // need to convert this textNode to tags and text
            $(this).replaceWith(change);
          }
        });
      }
      
      scrollPos = $tweets.find('li:last').offset().top;
      if (scrollPos != null) {
        setTimeout(function () {
          $('html,body').animate({ scrollTop: scrollPos }, 500, function () {
          });
        }, 100);
      }
      
      total_tweets += data.length;
      pageMax = null;
      
      $('body').removeClass('loading');
      
      if (statusTop == null) {
        statusTop = $('#tweets aside').offset().top - parseFloat($('#tweets aside').css('margin-top').replace(/auto/, 0));            
      }
      
    });

  } else {
    updateLoading(type);
    clearTimeout(timer);
    timer = setTimeout(function () { twitterlib.cancel().next(); }, 250);
  } 
});

function escapeTags(s) {
  return (s||'').replace(/[<>]/g, function (m) { return {'<':'&lt;'}[m]||'&gt;'; });
}

function two(s) {
  return (s+'').length == 1 ? '0' + s : s;
}

function updateRequestStatus() {
  $.getJSON('http://twitter.com/account/rate_limit_status.json?callback=?', function (data) {
    var date = new Date(Date.parse(data.reset_time));
    if (! $('#status p.rate').length) $('#status').append('<p class="rate" />');
    $('#status p.rate').html('Requests left: ' + data.remaining_hits + '<br />Next reset: ' + two(date.getHours()) + ':' + two(date.getMinutes()));
  });
}

function getQuery(s) {
  var query = {};
  
  s.replace(/\b([^&=]*)=([^&=]*)\b/g, function (m, a, d) {
    if (typeof query[a] != 'undefined') {
      query[a] += ',' + d;
    } else {
      query[a] = d;
    }
  });
  
  return query;
}

$('input[type=reset]').click(function () {
  $tweets.empty();
});

if ( !$('#screen_name').val() ) {
  $('#screen_name').val(store.get('screen_name'));
}

// check location.search to see if we need to prepopulate
if (window.location.search) {
  var query = getQuery(window.location.search.substr(1));
  if (query.screen_name) {
    $('#screen_name').val(decodeURIComponent(query.screen_name));
  }
  if (query.search) {
    $('#search').val(decodeURIComponent(query.search));
  }
  if (query.favs) {
    $('#favs').attr('checked', 'checked');
  }
}

var $ref = $('<div>M</div>').css({
  'visibility' : 'hidden', 
  'font-size': '10px', 
  'line-height': '10px',
  'margin': 0,
  padding: 0,
  overflow: 'hidden'
}).appendTo('body'), oh = 10;

var timer = setInterval(function () {
  var h = $ref.height();
  if (h != oh && !$('#bang').length) {
    // show exploded page
    $('<div id="bang" />').appendTo('body');
  } else if (h == oh && $('#bang').length) {
    $('#bang').remove();
  }
}, 500);

$('#auth .cancel').click(function () {
  $('input[type=radio]:first').click();
  $('body').removeClass('auth');
});

$('#logout').click(function () {
  document.cookie = 'token=; path=/';
});

if ($('#screen_name').val() && $('#search').val()) {
  try {
    $('form').submit();
  } catch (e) {
    // why is this throwing in FF?
  }
}
