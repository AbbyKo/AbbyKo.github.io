/*
	Dimension by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {
  var $window = $(window),
    $body = $('body'),
    $wrapper = $('#wrapper'),
		$footer = $('#footer'),
		$home = $('#home'),
    $main = $('#main'),
    $main_articles = $main.children('article');

  // Breakpoints.
  breakpoints({
    xlarge: ['1281px', '1680px'],
    large: ['981px', '1280px'],
    medium: ['737px', '980px'],
    small: ['481px', '736px'],
    xsmall: ['361px', '480px'],
    xxsmall: [null, '360px']
  });

  // Fix: Flexbox min-height bug on IE.
  if (browser.name == 'ie') {
    var flexboxFixTimeoutId;

    $window
      .on('resize.flexbox-fix', function() {
        clearTimeout(flexboxFixTimeoutId);

        flexboxFixTimeoutId = setTimeout(function() {
          if ($wrapper.prop('scrollHeight') > $window.height())
            $wrapper.css('height', 'auto');
          else $wrapper.css('height', '100vh');
        }, 250);
      })
      .triggerHandler('resize.flexbox-fix');
  }
  // Main.
  var delay = 325,
    locked = false;

  // Methods.
  $main._show = function(id, initial) {
    var $article = $main_articles.filter('#' + id);

    // No such article? Bail.
    if ($article.length == 0) return;

    // Handle lock.

    // Already locked? Speed through "show" steps w/o delays.
    if (locked || (typeof initial != 'undefined' && initial === true)) {
			var $currentArticle = $main_articles.filter('.active');

			$currentArticle.removeClass('active');
			
			$currentArticle.hide();
      // Mark as switching.
      $body.addClass('is-switching');

      // Mark as visible.
      $body.addClass('is-article-visible');

      // Deactivate all articles (just in case one's already active).
      $main_articles.removeClass('active');

      // Show main, article.
      $main.show();
      $article.show();

      // Activate article.
      $article.addClass('active');

      // Unlock.
      locked = false;

      // Unmark as switching.
      setTimeout(
        function() {
          $body.removeClass('is-switching');
        },
        initial ? 1000 : 0
      );

      return;
    }

    // Lock.
    locked = true;

    // Article already visible? Just swap articles.
    if ($body.hasClass('is-article-visible')) {
      // Deactivate current article.
      var $currentArticle = $main_articles.filter('.active');

      $currentArticle.removeClass('active');

      // Show article.
      setTimeout(function() {
        // Hide current article.
        $currentArticle.hide();

        // Show article.
        $article.show();

        // Activate article.
        setTimeout(function() {
          $article.addClass('active');

          // Window stuff.
          $window.scrollTop(0).triggerHandler('resize.flexbox-fix');

          // Unlock.
          setTimeout(function() {
            locked = false;
          }, delay);
        }, 25);
      }, delay);
    }

    // Otherwise, handle as normal.
    else {
      // Mark as visible.
      $body.addClass('is-article-visible');

      // Show article.
      setTimeout(function() {
        // Show main, article.
        $main.show();
        $article.show();

        // Activate article.
        setTimeout(function() {
          $article.addClass('active');

          // Window stuff.
          $window.scrollTop(0).triggerHandler('resize.flexbox-fix');

          // Unlock.
          setTimeout(function() {
            locked = false;
          }, delay);
        }, 25);
      }, delay);
    }
  };

  $main._hide = function(addState) {
    var $article = $main_articles.filter('.active');

    // Article not visible? Bail.
    if (!$body.hasClass('is-article-visible') && $article.length === 0) return;

    // Add state?
    if (typeof addState != 'undefined' && addState === true)
      history.pushState(null, null, '#');

    // Handle lock.

    // Already locked? Speed through "hide" steps w/o delays.
    if (locked) {
      // Mark as switching.
      $body.addClass('is-switching');

      // Deactivate article.
      $article.removeClass('active');

      // Hide article, main.
      $article.hide();
      // Show footer, header.
      $home.hide();

      // Unmark as visible.
      $body.removeClass('is-article-visible');

      // Unlock.
      locked = false;

      // Unmark as switching.
      $body.removeClass('is-switching');

      // Window stuff.
      $window.scrollTop(0).triggerHandler('resize.flexbox-fix');

      return;
    }

    // Lock.
    locked = true;

    // Deactivate article.
    $article.removeClass('active');

    // Hide article.
    setTimeout(function() {
      // Hide article, main.
      $article.hide();

      // Show footer, header.
      $home.hide();

      // Unmark as visible.
      setTimeout(function() {
        $body.removeClass('is-article-visible');

        // Window stuff.
        $window.scrollTop(0).triggerHandler('resize.flexbox-fix');

        // Unlock.
        setTimeout(function() {
          locked = false;
        }, delay);
      }, 25);
    }, delay);
  };

  $window.on('keyup', function(event) {
    switch (event.keyCode) {
      case 27:
        // Article visible? Hide.
        if ($body.hasClass('is-article-visible')) $main._hide(true);

        break;

      default:
        break;
    }
  });

  $window.on('hashchange', function(event) {
    // Empty hash?
    if (location.hash == '' || location.hash == '#') {
      // Prevent default.
      event.preventDefault();
      event.stopPropagation();

      // Hide.
				$main._show('home');
    }

    // Otherwise, check for a matching article.
    else if ($main_articles.filter(location.hash).length > 0) {
      // Prevent default.
      event.preventDefault();
      event.stopPropagation();

			// Show article.
			//$main._hide();
			$main._show(location.hash.substr(1));
		}
  });

  // Scroll restoration.
  // This prevents the page from scrolling back to the top on a hashchange.
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  else {
    var oldScrollPos = 0,
      scrollPos = 0,
      $htmlbody = $('html,body');

    $window
      .on('scroll', function() {
        oldScrollPos = scrollPos;
        scrollPos = $htmlbody.scrollTop();
      })
      .on('hashchange', function() {
        $window.scrollTop(oldScrollPos);
      });
  }

  // Initialize.

  // Hide main, articles.
  $main_articles.hide();

  // Initial article.
  if (location.hash === '' || location.hash === '#') {
    $window.on('load', function() {
			$body.addClass('fullscreen-main');
			$main._show('home', true);
    });
  } else if (location.hash != '#') {
    $window.on('load', function() {
			$main._show(location.hash.substr(1), true);
			$body.removeClass('fullscreen-main');
    });
	}
	$window.on('popstate', function(event, state) {
		if (location.hash === '') {
			$body.addClass('fullscreen-main');
		} else {
			$body.removeClass('fullscreen-main');
		}
	});
})(jQuery);
