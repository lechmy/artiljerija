$(document).ready(function(){
  $('form').submit(function(e){
    e.preventDefault();
    var obj = {
      'username': $(this)[0][0].value,
      'password': $(this)[0][1].value
    }
    $.post($(this).attr('action'), obj, function(data, status){
      if(data.status && data.status == 'fail'){
        toast(data.message);
      } else {
        document.write(data);
      }
    });
  });

  // $('a').click(function(e){
  //   e.preventDefault();
  //   $.get($(this).attr('href'), function(data, status){
  //     $('#container').html(data);
  //   })
  // });
});
