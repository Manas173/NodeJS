var socket = io();
socket.on('connect',function () {
    console.log('Connected to server !')
    var li= jQuery('<li> </li>');
    li.text('New user joined the chatroom !');
    jQuery(`#messages`).append(li);
})
socket.on('disconnect',function() {
    console.log('Disconnected from server !')
    var li= jQuery('<li> </li>');
    li.text('User disconnected from the chatroom !');
    jQuery(`#messages`).append(li);
})
socket.on('newMail',function(email) {
    console.log(email)
})

jQuery('#message-form').on('submit',function(e){
    e.preventDefault();
    socket.emit('createMessage',{
        from:'User',
        text:jQuery('[name=message]').val()
    },function(){

    })
})

socket.on('newMessage',function(message){
    console.log(message);
    var li= jQuery('<li> </li>');
    li.text(`${message.from}:${message.text}`);
    jQuery(`#messages`).append(li);
})