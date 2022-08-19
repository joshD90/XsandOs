//set up express and require everything

const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
//link socket.io to sever
const io = new Server(server);
//set up static files middleware
app.use(express.static(__dirname + "/public"));

//send main html to client
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

//set up listener for connection
io.on("connection", (socket) => {
  console.log("a user has connected");
  //set up listener for disconnection
  socket.on("disconnect", () => {
    console.log("a user has disconnected");
  });
  //set up listener for events named chat message
  socket.on("chat message", (message) => {
    //when we get this we emit to all others connected
    socket.broadcast.emit("chat message", message);
  });
  //set up listener for change in player selection
  socket.on("selectionInfo", (info) => {
    socket.broadcast.emit("selectionInfo", info);
  });
});

//get server to listen on port 3000
server.listen(3000, () => {
  console.log("listening on port 3000");
});
