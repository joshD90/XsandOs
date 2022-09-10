//set up express and require everything
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const { assignRoom } = require("./public/modules/serverModules/assignRoom");
const { setTurn } = require("./public/modules/serverModules/setTurn");
//link socket.io to sever
const io = new Server(server);
//set up static files middleware
app.use(express.static(__dirname + "/public"));

//send main html to client
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

//this will help trace any memory leaks associated with assigning our listeners
process.on("warning", (e) => {
  console.log(e.stack);
});

//set up listener for connection
io.on("connection", (socket) => {
  console.log("a user has connected");

  //this searchs for all the room attached to this adapter
  const rooms = io.of("/").adapter.rooms;

  //we assign all users as they connect 2 to a room
  assignRoom(socket, rooms);

  //send the new user back their id
  io.to(socket.id).emit("my-id", socket.id);

  //set up listener for disconnection. If we use disconnecting rather than
  //disconnection we can still access rooms that socket was part of
  socket.on("disconnecting", () => {
    const myRoom = [...socket.rooms][1];
    console.log(myRoom, "socketondisconnect");
    console.log(`User with id of ${socket.id} has disconnected`);
    console.log(socket.data.username);
    socket.to(myRoom).emit("user-disconnected", socket.data.username);
  });

  socket.on("switchRooms", () => {
    const myRoom = [...socket.rooms][1];
    const numInRoom = rooms.get(myRoom).size;
    console.log(numInRoom);
    if (numInRoom < 2) {
      //leave the room
      socket.leave(myRoom);
      assignRoom(socket, rooms);
      const myNewRoom = [...socket.rooms][1];
      myNewRoom && setTurn(socket, io, socket.data.username);
    }
  });
  //set up listener for player sending over their username
  socket.on("send-username", (playername) => {
    //once the user has sent over the username, this function will
    //check whether both users are connected and have sent over their
    //name and then emit a signal to start the turn again
    setTurn(socket, io, playername);
  });

  socket.on("restart-game", async (playername) => {
    //globally show that this player is ready to play again
    socket.data.restart = true;
    const myRoom = [...socket.rooms][1];

    const sockets = await io.in(myRoom).fetchSockets();
    //see whether both sockets are ready to play again
    const socketsRestartTrue = sockets.filter(
      (elem) => elem.data.restart === true
    );

    if (socketsRestartTrue.length === 2) return setTurn(socket, io, playername);
  });

  //set up listener for the winner
  socket.on("player-wins", (winningInfo) => {
    const myRoom = [...socket.rooms][1];
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
    const myRoom = [...socket.rooms][1];
    socket.to(myRoom).emit("selectionInfo", info);
  });
});

//get server to listen on port 3000
server.listen(3000, () => {
  console.log("listening on port 3000");
});
