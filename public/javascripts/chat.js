const users = $('.user');
const chatContainer = $('#chat-container');
users.click(function(e){
  e.preventDefault();
  let name = $(this).attr('chat-name').replace(' ','_');
  let id = $(this).attr('href');
  chatContainer.load(`/single-view/${id}`,()=>{
    var that = $(this);
    $('#message-container').scrollTop(99999999999999999)
    setTimeout(function(){
      if(that.css('color')=='rgb(255, 255, 255)'){
        $('#online').parent().hide().slideDown();
        $('#online').html(`
        <div class="alert alert-success" role="alert">
        <strong>Connected</strong>
        </div>`);
        $('#online').parent().delay(2500).slideUp();
      } else {
        $('#online').html(`
        <div class="alert alert-info" role="alert">
        <strong>Offline!</strong>
        </div>`);
      }
    },1000);
    if($('.active').children(0).css('color')!='rgb(255, 255, 255)'){
      timeInterval();
    } else {
      $('#isactive').text('');
    }
  });
})
$('#message-container').attr('active','#{user.receiver}');
