
$(function () {
  var $name = $('#name');
  var $nameTempl = $('#name-template');
  var $textTempl = $('#text-template');
  var $saveContainer = $('.save-button');
  var $twitterContainer = $('.twitter');
  var $fbBtn = $('.fb-share-button');
  var $modal = $('#share');
  var $modalInput = $('#modal-input');

  var SHARE_URL = window.location.origin + '/##ID##';
  var TWITTER_URL = 'https://twitter.com/intent/tweet?text=Digitalist kuvaukseni:&url=' + SHARE_URL + '&hashtags=digitalist,pöhinä';

  $('a').click(function () {
    if (window.ga) {
      ga('send', 'event', 'Link', 'Click', $(this).text());
    }
  });

  $('#submit').click(function () {
    if (window.ga) {
      ga('send', 'event', 'Generate-button', 'Click');
    }

    $.ajax({
      url: '/generator/random'
    }).then(function (data) {
      var name = $name.val().trim();
      var text = data.text.split('##NAME##').join(name);
      $nameTempl.text(name);
      $textTempl.text(text);
      $saveContainer.show();
    }).fail(handleError);
  });

  $('#save').click(function () {
    var data = {
      name: $nameTempl.text().trim(),
      text: $textTempl.text().trim()
    };

    if (!data.name || !data.text) {
      return;
    }

    if (window.ga) {
      ga('send', 'event', 'Save-button', 'Click');
    }

    $.ajax({
      url: '/save',
      type: 'POST',
      data: data
    }).then(function (data) {
      openModal(data.id);
    }).fail(handleError);
  });

  $modal.on('shown.bs.modal', function () {
    $modalInput.focus();
  });

  $('#share-button').click(function () {
    var id = window.location.pathname.replace('/', '');
    openModal(id);
  });

  function openModal (id) {
    var shareUrl = SHARE_URL.replace('##ID##', id);
    var twitterUrl = TWITTER_URL.replace('##ID##', id);
    reCreateTwitterButton(twitterUrl);
    reCreateFBButton(shareUrl);
    $modalInput.val(shareUrl);
    $modal.modal('show');
    $modalInput.select();
  }

  function reCreateFBButton (shareUrl) {
    if (window.FB) {
      $fbBtn.attr('data-href', shareUrl);
      FB.XFBML.parse();
    }
  }

  function reCreateTwitterButton (twitterUrl) {
    if (window.twttr) {
      var $link = $('<a>').attr('href', twitterUrl).addClass('twitter-share-button');
      $twitterContainer.empty().append($link);
      twttr.widgets.load();
    }
  }

  function handleError (error) {
    console.error(error);
  }
});
