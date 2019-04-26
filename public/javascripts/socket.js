const socket = io();
let styles = [
    'background: linear-gradient(#007bff, #0854a7)'
    , 'border: 1px solid #3E0E02'
    , 'color: white'
    , 'display: block'
    , 'text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3)'
    , 'box-shadow: 0 1px 0 rgba(255, 255, 255, 0.4) inset, 0 5px 3px -5px rgba(0, 0, 0, 0.5), 0 -13px 5px -10px rgba(255, 255, 255, 0.4) inset'
    , 'line-height: 40px'
    , 'text-align: center'
    , 'font-weight: bold'
    , 'font-size: 20px;'
].join(';');

  let con = Number.isInteger(parseInt(document.cookie.substr(document.cookie.indexOf('userID')+7)));
  if(con){
    let userID = document.cookie.substr(document.cookie.indexOf('userID')+7);
    socket.on('connect',()=>{
      let me = [userID, socket.id];
      socket.emit('sockets',me)
      console.log('%c WELCOME BACK! YOU ARE NOW CONNECTED TO THE SERVER.', styles);
      socket.on('message', (data)=>{
        console.log(data);
        if($('#message-container').attr('active')==data){
          chatContainer.load(`/single-view/${data}`,()=>{
            $('#message-container').scrollTop(99999999999999999)
          });
        }
      })
      socket.on('disconnect',()=>{
        socket.emit('sockets',me)
      })
      socket.on('online users',(data)=>{
        $('a[chat-name]').css('color','#999999');
          $('a[chat-name]').each(function(){
            for(let i in data[0]){
              if($(this).attr('href')==i)
                $(this).css('color','#fff');
            }
        })
        if($('.active').children(0).css('color')=="rgb(255, 255, 255)" && data[1][0]==$('.active').children(0).attr('href')){
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
      })
    });
  }
