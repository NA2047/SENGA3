

var express = require('express');
var app = express();
var clientsNames = [];
var allClients =[];
var dictionaryClients_Colors = {};
var chatHistory = [];
var socketNameUserName = {};
// maps to
// var express = require('express');
// var app = express();
// var online1 = document.getElementById('online');
var http = require('http').Server(app);
// maps to
// var http = require('http');
// var server = http.Server(app)
app.use(express.static('client'));


var io = require('socket.io')(http);
var port = process.env.PORT || 3000;



io.on('connection', function(socket){

  chatHistory.forEach(function(item){

    socket.emit('chat message', item)
  });


  allClients.push(socket);
  var ClientCol = (Math.random()*0xFFFFFF<<0).toString(16);
  socket.emit('startingUserColor',{
    user: socket.id,
    color: ClientCol
  });
  // console.log(socket.id);
  // clientsNames.push(socket.id);
  dictionaryClients_Colors[socket.id] = ClientCol;
  socketNameUserName[socket.id] = socket.id

  socket.on('disconnect', function() {
     console.log('Got disconnect!');
     // console.log(socket.id);
     // log
     // console.log(dictionaryClients_Colors);
     // console.log(socketNameUserName);
     for (d in socketNameUserName){
       for(g in dictionaryClients_Colors){
         if((g === d && socketNameUserName[d] === d && socket.id === d)||( socketNameUserName[d] === g && socket.id === d)){

           var t = socketNameUserName[d];
           // console.log(t);
            delete dictionaryClients_Colors[t];
            delete socketNameUserName[d];
            return;
          }
         }
       }
       delete dictionaryClients_Colors[socket.id];
       delete socketNameUserName[socket.id];
       // return;


       // console.log(allClients);
     // var i = allClients.indexOf(socket);
     // allClients.splice(i, 1);
  });
  // console.log(dictionaryClients_Colors+ " line 66");
  var interval = setInterval(function () {
    // console.log("sent with inervals " + dictionaryClients_Colors);
    socket.emit("users", dictionaryClients_Colors);
  }, 500);


  // console.log(allClients);

// var cont = io.sockets.connected;
// var newClient = socket.client.sockets
// newClient = Object.keys(newClient)[0];
// console.log(newClient);
//  for (item in cont) {
//    if(!clients.contains(item))
//    clients.push(item);
//  }

 // var interval = setInterval(function () {

    // }, 1000);
  // console.log(io.sockets.connected);
 // console.log(clients);
 // client.on('disconnect', function() {
 //        clients.splice(clients.indexOf(socket.connected[0]), 1);
    // });

  socket.on('chat message', function(msg){
    var patt = new RegExp("([0-9]{2}:[0-9]{2})?:[0-9]{2}", "g");
    var date = new Date();
    var timeStamp = patt.exec(date.toString());
    msg["timeStamp"] = timeStamp[1];
    // console.log(msg);
    chatHistory.push(msg);
    io.emit('chat message', msg);
  });

  socket.on('nameChangeColor', function(userInfo){
    // console.log("Change name called from server"+ userInfo)
    // console.log(userInfo);
    socketNameUserName[userInfo.socketID] = userInfo.name;
    // socketNameUserName[]
    // console.log(socketNameUserName);
    io.emit('nameChangeColor', userInfo);
  });


  socket.on('updateOnline', function(clients){
    // console.log("dppd");
    dictionaryClients_Colors = clients;


    // io.emit('users', userInfo);
  });

  // socket.on('removeUser', function(user){
  //   delete dictionaryClients_Colors[user./user];
  //
  // });

  socket.on('cookiesFound', function(user){
    for(d in dictionaryClients_Colors){
      if (d === user.serverUser){
        delete dictionaryClients_Colors[d];
        dictionaryClients_Colors[user.cookieUser] = user.cookieColor;
      }
    }
    for (f in  socketNameUserName){
      if (f === user.serverUser){
        delete socketNameUserName[f];
        socketNameUserName[user.cookieUser] = user.cookieUser;
      }
    }
    console.log(dictionaryClients_Colors);
    console.log(socketNameUserName+ " line 45 ");


    // io.emit('users', userInfo);
  });



});


http.listen(port, function(){
  console.log('listening on *:' + port);
});


// Array.prototype.contains = function(obj) {
//     var i = this.length;
//     while (i--) {
//         if (this[i] === obj) {
//             return true;
//         }
//     }
//     return false;
// }
