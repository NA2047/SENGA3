var socket = io();
var clients = {};
// var clientColors = {}
var displayMessages = document.getElementById('messages'),
    sendMessage = document.getElementById('m'),
    regexmessage = document.getElementById('m'),
    userChat = document.getElementById('displayUser');
    whoIsOnline = [],
    user = '',
    online2 = document.getElementById('online'),
    userColor = '',
    onlineHtmlStrings = '',
    cellOne = document.getElementsByClassName('cell one'),
    socketID = '';

    // window.onload = function what(){
    // document.getElementById('hello').innerHTML = 'hi';
    // };


sendMessage.addEventListener("keyup", function(event){

  if (event.key !== "Enter" ) {
    return;
    }
if(changeName()||changeColor()){
  return;
}

  socket.emit('chat message',{
    displayMessages: displayMessages.value,
    sendMessage: sendMessage.value,
    // timeStamp: timeStamp[1],
    user: user,
    color: userColor
  });
  $('#m').val('');
  // return false;
});

function changeName() {
 var oldUser = user;

  // console.log(temp);
    // console.log(newName);
  var testPat = new RegExp("/nick: <([a-zA-Z0-9éèêëùüàâöïç\"\/\%\(\).'?!,@$#-_ \n\r]+)>", "gi");
  if (testPat.test(sendMessage.value)){
      // console.log(temp);
      var pat2 = new RegExp("/nick: <([a-zA-Z0-9éèêëùüàâöïç\"\/\%\(\).'?!,@$#-_ \n\r]+)>", "gi");
      var newName = pat2.exec(sendMessage.value);
      // console.log(newName);
      for (u in clients){
        if(u === newName[1]){
          $('#m').val('');
          return true;
        }
      }
      $('#m').val('');
      socket.emit('nameChangeColor',{
        newName: newName[1],
        color: userColor,
        oldUser: oldUser,
        flag: 0,
        socketID:socketID,
        name: newName[1]
      });
      user = newName[1];
      document.cookie = "username=" + newName[1];
      userChat.innerHTML ='<p> you are User  '+ user+'</p>';
    return true;
  }


  return false;
  }

function changeColor(){
  var oldColor = userColor;
  var testPat = new RegExp("/nickcolor: ([a-f0-9]{6})", "gi");
  if (testPat.test(sendMessage.value)){
      // console.log(temp);
      var pat2 = new RegExp("/nickcolor: ([a-f0-9]{6})", "gi");
      var newColor = pat2.exec(sendMessage.value);
      // console.log(newColor);
      $('#m').val('');
      socket.emit('nameChangeColor',{
        name: user,
        newColor: newColor[1],
        oldColor: oldColor,
        flag : 1,
        socketID:socketID

      });
        userColor = "#"+ newColor[1];
        document.cookie = "usercolor=" + newColor[1];

    return true
  }


return false;

}


// socket.on('nameChange', function(name){
//   // var i = clients.indexOf(name..user);
//   // clients.splice(i, 1);
//
// for (item in clients){
//   online2.innerHTML += '<li>'+'<span style=\"color:' + name.color + '\">' + name.user +'</li>';
//
// }
//
// // console.log(clients);
//
// });

socket.on("users", function(users) {
    // todo: add the tweet as a DOM node
    // console.log("tweet from", tweet[0]);
   // window.onload = function what(){
   // console.log("changing online users");
   // console.log(users);
   clients = users
   onlineHtmlStrings = '';
   for(human in users){
     // console.log(users[human]);
     onlineHtmlStrings += '<li>'+'<span style=\"color:' + '#'+users[human] + '\">' + human +'</li>';
  /* use key/value for intended purpose */
}
   // clients = users;
   // user = tweet[tweet.length -1];
    online2.innerHTML = onlineHtmlStrings;
    // };

    // console.log("contents:", tweet.text);
});
socket.on("nameChangeColor", function(users){
  for (human in clients){
    if (users.flag === 0){
      if(human === users.oldUser){
      var tempColor =  clients[human];
      clients[users.newName] = tempColor;
      delete clients[human];
      }
    }
    else{
      if(human === users.name){
      // var tempColor =  clients[human];
      clients[users.name] = users.newColor;


      // delete clients[human];
      }

    }



  }
  // console.log(clients);

  socket.emit('updateOnline', clients);



});


// socket.on('disconnect', function() {
//   console.log('Got disconnect!');
//   // socket.emit('removeUser',{
//   //   user:user
//   //   color:userColor
//   // });
// });

// socket.on("dis", function(userInfo) {
//     // todo: add the tweet as a DOM node
//     // console.log("tweet from", tweet[0]);
//    // window.onload = function what(){
//    // clients = tweet;
//    if( user === ''){
//      // console.log("made it");
//      userChat.innerHTML ='<p> you are User  '+ userInfo.user +'</p>';
//      user = userInfo.user;
//      userColor = '#'+ userInfo.color;
//      return;
//    }
//
// });
socket.on("startingUserColor", function(userInfo) {
  var checkUser = (document.cookie.match(/^(?:.*;)?\s*username\s*=\s*([^;]+)(?:.*)?$/)||[,null])[1];
  var checkColor = (document.cookie.match(/^(?:.*;)?\s*usercolor\s*=\s*([^;]+)(?:.*)?$/)||[,null])[1];
// console.log(checkUser);
// console.log(checkColor);
  if(checkUser){
    userChat.innerHTML ='<p> you are User  '+ checkUser +'</p>';
    userChat.scrollTo(0,document.body.scrollHeight);
    user = checkUser;
    userColor = '#'+ checkColor;
    socketID = userInfo.user;
    socket.emit('cookiesFound',{
      cookieUser:checkUser,
      cookieColor:checkColor,
      serverUser: userInfo.user,
      serverColor:userInfo.color
    });
  }
  else{
    userChat.innerHTML ='<p> you are User  '+ userInfo.user +'</p>';
    userChat.scrollTo(0,document.body.scrollHeight);
    user = userInfo.user;
    userColor = '#'+ userInfo.color;
    document.cookie = "username=" + userInfo.user;
    document.cookie = "usercolor=" + userInfo.color;
    socketID = userInfo.user;

    // return;

  }
   // if( user === ''){
   //   // console.log("made it");
   //
   // }

});

// displayMessages.addEventListener('keypress', function(){
//   socket.emit('typing', user);
//
// });

socket.on('chat message', function(msg){

if(msg.user === user){
  displayMessages.innerHTML += '<strong> <p>'+msg.timeStamp+" "+'<span style=\"color:' + msg.color + '\">' + msg.user + '</span>' +" "+ msg.sendMessage + '</p></strong>';
}
else{
  displayMessages.innerHTML += '<p>'+msg.timeStamp+" "+'<span style=\"color:' + msg.color + '\">' + msg.user + '</span>' +" "+ msg.sendMessage + '</p>';
}

displayMessages.scrollTo(0,document.body.scrollHeight);
// displayMessages.scrollTo(displayMessages[0].scrollHeight - displayMessages.clientHeight);

  // console.log(clients);
  // online2.innerHTML +=
  // window.scrollTo(0, document.body.scrollHeight);
});
