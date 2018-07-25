var express = require('express')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var cors = require('cors')
app.use(cors())

app.get('/',(req,res)=>{
    res.send('HELLO WORLD')
})
var userList = []
io.on('connection', function(socket){    

    socket.on('user', function(userName){
        console.log(userName +" has connected");
        userList.push({userName:userName,status:'online'})
        console.log(userList)
        socket.broadcast.emit('statusMessage',{msg:userName+" is connected",usersOnline:userList});
        socket.on('disconnect', () => {
        console.log(userName+' disconnected')
        const  index=userList.indexOf(userName)
        userList.splice(index,1)
        console.log(userList)
        socket.broadcast.emit('statusMessage',{msg:userName+" is disconnected",usersOnline:userList});
        
        })
    });

    socket.on('message', data=>{
        console.log(data.userName+" says : " + data.message);
        socket.broadcast.emit('chatMessage',{msg:data.userName+" says : " + data.message});
      });  

      socket.on('message-typing', data=>{
          arr = []
        userList.map(data=>{
            arr.push(data.userName)
        })
        const index = arr.indexOf(data.userName)
        userList[index] = {userName:data.userName,status:'typing...'}
        console.log(userList)
        socket.broadcast.emit('messageTyping',{usersOnline:userList});
      });
      
      socket.on('message-typingStop', data=>{
        arr = []
      userList.map(data=>{
          arr.push(data.userName)
      })
      const index = arr.indexOf(data.userName)
      userList[index] = {userName:data.userName,status:'online'}
      console.log(userList)
      socket.broadcast.emit('messageTyping',{usersOnline:userList});
    });  
  });




http.listen(3030,console.log('express listen on port 3030') )