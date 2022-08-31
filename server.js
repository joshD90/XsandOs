//set up express and require everything

const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const {
  assignRooms,
  checkWhichRoom,
  getUserRoom,
  setTurn,
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
  //this will help trace any memory leaks associated with assigning our listeners
  process.on("warning", (e) => {
    console.log(e.stack);
  });
  console.log("a user has connected");
  //set up users
  let users = [];
  //run through a loop of sockets and push them into users
  //unfortunately this will only create a local user array unique to each
  //socket and only socket id information from other users will be passed over
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
  //we assign all users as they connect 2 to a room
  assignRooms(socket, rooms, newRoomList, users);
  //send the new user back their id
  io.to(socket.id).emit("my-id", socket.id);

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
    //once the user has sent over the username, this function will
    //check whether both users are connected and have sent over their
    //name and then emit a signal to start the turn again
    setTurn(socket, io, playername);
  });

  //set up listener for the winner
  socket.on("player-wins", (winningInfo) => {
    const myRoom = getUserRoom(users, socket);
    //broadcast the winning playername and the winning array associated
    socket.to(myRoom).emit("other-player-wins", winningInfo);
  });

  //set up listener for events named chat message
  socket.on("chat message", (message) => {
    //when we get this we emit to all others connected
    socket.broadcast.emit("chat message", message);
  });
  //set up listener for change in player selection
  socket.on("selectionInfo", (info) => {
    const myRoom = getUserRoom(users, socket);
    socket.to(myRoom).emit("selectionInfo", info);
  });
});

//get server to listen on port 3000
server.listen(3000, () => {
  console.log("listening on port 3000");
});
