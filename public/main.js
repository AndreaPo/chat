const socket = io();

//get data from DOM
var msg = document.getElementById('message');
var nkn = document.getElementById('nickname');
var btn = document.getElementById('btn');
var boxMsg = document.getElementById('box-messages');
var boxUsr = document.getElementById('users');
var boxType = document.getElementById('box-type');

btn.addEventListener('click', function(){
    //1*(message) send a chat request to server and pass 2 fields
    socket.emit('chat', {
         message: msg.value,
         nickname: nkn.value,
         id: socket.id
         
        });
        document.getElementById('message').value= '';
});
//1*(typing)send a chat request to server and pass nickname
message.addEventListener('keypress', function(){
    socket.emit('typing', nkn.value);
})

//3*(message) take responde from server and put the result in html
socket.on('chat', function(data, nicknames){

    boxMsg.innerHTML += '<div id="box-mess"><p id="p-message"><strong>'+ data.nickname.toUpperCase() + '</strong> ' + data.message + '</p></div>';
    
    boxUsr.innerHTML = '';

    var showArr = '';

    for (let index = 0; index < nicknames.length; index++) {
        
        showArr += ' ' + nicknames[index];
        
    }
    boxUsr.innerHTML += '<p>' + showArr.toUpperCase() + '</p>';
    boxType.innerHTML = '';


});

//3*(typing) take responde from server and put the result in html
socket.on('typing', function (data) {
    boxType.innerHTML = '';
    boxType.innerHTML = '<p>'+ data + ' is typing</p>';
})

//2*(disconnect)take responde from server and add msg chat and delete a nick connected  
socket.on("user disconnected", function(userDisc, nicknames){
    boxMsg.innerHTML += '<p><strong>'+ userDisc + ' leaves the chat!</strong></p>';

    boxUsr.innerHTML = '';

    var showArr = '';

    for (let index = 0; index < nicknames.length; index++) {
        
        showArr += ' ' + nicknames[index];
        
    }
    boxUsr.innerHTML += '<p>' + showArr.toUpperCase() + '</p>';
})