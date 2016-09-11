function toast(message){
  $('.toast').text(message).fadeIn();
  setTimeout(function(){
    $('.toast').fadeOut();
  }, 3000);
}
