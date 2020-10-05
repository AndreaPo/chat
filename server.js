//set server and static files
const express = require("express");
const app = express();
const socket = require("socket.io");

const port = 5000;

const server = app.listen(port, function () {
  console.log(`Listening on port ${port}`);
  console.log(`http://localhost:${port}`);
});


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.use(express.static(__dirname + '/public'));

const io = socket(server);

//************************************************* */
// use set() to collect data object
var users = new Set();

io.on('connection', function (socket) {

    //2* get data from client and pass values to client 
    socket.on('chat',  function (data) {
      
      //if there are no users
      if (users.size == 0) {
        
        var obj = {
          nick: data.nickname,
          id: data.id
        }

        users.add(obj);

        var nicknames = [];

        var u =  [...users];

        for (let index = 0; index < u.length; index++) {

          nicknames[index] = u[index].nick;
        }

        io.sockets.emit('chat', data, nicknames);

        
        //if user db size > 0
      }else if(users.size > 0 ){
  
        condition1 = false;
        condition2 = false;
        //iterate set obj
        for (let item of users.values()){

          if(item.id == data.id && item.nick != data.nickname){

            item.nick = data.nickname; 
            condition1= true;

          }else if(item.id == data.id && item.nick == data.nickname){

            condition1 = true;

          }else if(item.id != data.id && item.nick != data.nickname){
            
              condition2 = true;
          }
          
        }

          if (condition1 == true  ||  (condition2 == true && condition1 == true)) {
            var nicknames = [];

            var u =  [...users];
            
            for (let index = 0; index < u.length; index++) {
              
              nicknames[index] = u[index].nick;
            }
            
            io.sockets.emit('chat', data, nicknames);
            condition1 = false;
            condition3 = false;
            condition2 = false;
          }
            
        if (condition2 == true && condition1 == false) {
          var obj = {
            nick: data.nickname,
            id: data.id
          }
    
          users.add(obj);
    
          var nicknames = [];
    
          var u =  [...users];
    
          for (let index = 0; index < u.length; index++) {
    
            nicknames[index] = u[index].nick;
          }
    
          io.sockets.emit('chat', data, nicknames);
          condition2 = false;
        }
        
      }
        });
        //2*(typing)take data from client and send datas
        socket.on('typing', function (data) {
            socket.broadcast.emit('typing', data);
        });
       //1*(disconnect)take user disc. event and send a data to client
        socket.on("disconnect", () => {

          var idDisc = socket.id
          var userDisc;

          users.forEach(function(obj){
            if (obj.id == socket.id){
              userDisc = obj.nick;
              users.delete(obj)
            }
          })

          var nicknames = [];
    
          var u =  [...users];
    
          for (let index = 0; index < u.length; index++) {
    
            nicknames[index] = u[index].nick;
          }
          socket.broadcast.emit("user disconnected", userDisc, nicknames);
        });
  });