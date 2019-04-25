const users = $('.user');
const chatContainer = $('#chat-container');
const socket = io();
users.click(function(e){
  e.preventDefault();
  let name = $(this).attr('chat-name').replace(' ','_');
  let id = $(this).attr('href');
  chatContainer.load(`/single-view?receiver=${id}`,()=>{
    $('#message-container').scrollTop(99999999999999999)
  });
})
$('#message-container').attr('active','#{user.receiver}');
socket.on('connect',()=>{
  let me = [userID, socket.id];
  socket.emit('sockets',me)
  console.log('connected');
  socket.on('message', (data)=>{
    console.log(data);
    if($('#message-container').attr('active')==data){
      chatContainer.load(`/single-view?receiver=${data}`,()=>{
        $('#message-container').scrollTop(99999999999999999)
      });
    }
  })
});
socket.on('disconnect',()=>{
  socket.emit('socket disconnect', userID);
})
