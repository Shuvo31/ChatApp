const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");
let cors = require("cors");
let bodyParser = require("body-parser");



//? cors and bodyparser for raw data
app.use(bodyParser.json());
app.use(cors());

//*form data parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

//* stting up public folder
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  let USERAGENT = req.get("User-Agent");
  console.log(USERAGENT);
  console.log("Working Fine");
  res.status(200).sendFile(__dirname +'/pages/index.html');
});

// *server listen
 const serverWithSocket = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
 
 });
  const io = require('./util/socket').intit(serverWithSocket); 
  io.on('connection', (socket) => {
    let newUser = {};
    
    io.emit('connection',newUser);  
    socket.broadcast.emit('hi');
    console.log('a user connected');
    socket.on('chat msg', function (chatObj) {
      newUser = {userID: socket.id, username:chatObj?.chatSender,}
      console.log('msg: ' + chatObj);
       io.emit('chat msg', chatObj);
    });
    socket.on('disconnect', function (cnnSocket) {
      console.log('A user disconnected');
      io.emit('disconnectedUser',cnnSocket)
    });
  });
