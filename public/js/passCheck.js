$(document).ready(function(){
  $('[name="register"]').click(function(e){
    e.preventDefault();
    if($('[name="password"]').val() == $('[name="repassword"]').val() && $('[name="username"]').val() != '' && $('[name="password"]').val() != ''){
      $('#register').submit();
    } else {
      $('.alert').text("Proverite da li ste lepo uneli username i password").show();
    }
  });
})
