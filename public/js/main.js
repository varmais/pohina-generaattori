
$(function () {
  var $name = $('#name');
  var $nameTempl = $('#name-template');
  var $textTempl = $('#text-template');

  $('#submit').click(function () {
    $.ajax({
      url: '/generator/random'
    }).then(function (data) {
      var name = $name.val().trim();
      var text = data.text.split('##NAME##').join(name);
      $nameTempl.text(name);
      $textTempl.text(text);
    })
  });
});
