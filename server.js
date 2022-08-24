//set up express and require everything

const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const {
  assignRooms,
  checkWhichRoom,
} = require("./public/modules/serverModules/socketFunctions");
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
  process.on("warning", (e) => {
    console.log(e.stack);
  });
  console.log("a user has connected");
  //set up users
  let users = [];
  //run through a loop of sockets and push them into users
  for (let [id, socket] of io.of("/").sockets) {
    users.push({
      userID: id,
      username: socket.username,
      roomName: null,
    });
  }
  //this searchs for all the room attached to this adapter
  const rooms = io.of("/").adapter.rooms;
  //we will push the 'real' rooms onto this array so we can access and use them
  //at a later point
  let newRoomList = [];
  assignRooms(socket, rooms, newRoomList, users);
  checkWhichRoom(socket, rooms);

  //set up listener for disconnection
  socket.on("disconnect", () => {
    console.log(`User with id of ${socket.id} has disconnected`);
    users.filter((user) => user.userID !== socket.id);
    socket.broadcast.emit(
      "user-disconnected",
      `User with id of ${socket.id} has disconnected`
    );
  });
  // //set up listener for player sending over their username
  socket.on("send-username", (playername) => {
    //find the index of the user in the user array
    const userToChange = users.find((user) => user.userID === socket.id);
    const indexOfUser = users.indexOf(userToChange);
    users[indexOfUser].username = playername;

    //see what room and username have been assigned
    console.log(users, "USERS ON SEND MESSAGE");
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
server.listen(3002, () => {
  console.log("listening on port 3001");
});
