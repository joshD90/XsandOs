function assignRooms(socket, rooms, roomArray, users) {
  //we seperate each object element into a single array
  const arrayOfRoomObj = Array.from(rooms.entries());
  //as each individual socket gets its own room, we want to seperate out these
  //from our named rooms - we do this by only pushing room names into our new list
  //that have less than 10 characters
  arrayOfRoomObj.forEach((elem) => {
    elem[0].length < 10 && roomArray.push(elem[0]);
  });
  //We want to check the end element of our room array and if this contains two
  //users we join a new room
  //If no rooms have been created start by joining Room 1
  if (roomArray.length === 0) {
    socket.join("Room1");
    const thisUser = users.find((user) => user.userID === socket.id);
    const indexOfUser = users.indexOf(thisUser);
    users[indexOfUser].roomName = "Room1";
    //if the end element .size(amount of users) = 2 then we join a new group, we ensure
    //a logical naming order by numbering the room according array length
  } else if (rooms.get(roomArray[roomArray.length - 1]).size === 2) {
    socket.join(`Room${roomArray.length + 1}`);
    const thisUser = users.find((user) => user.userID === socket.id);
    const indexOfUser = users.indexOf(thisUser);
    users[indexOfUser].roomName = `Room${roomArray.length + 1}`;

    //if it's not full we simply join the last element of the array
  } else {
    socket.join(`Room${roomArray.length}`);
    const thisUser = users.find((user) => user.userID === socket.id);
    const indexOfUser = users.indexOf(thisUser);
    users[indexOfUser].roomName = `Room${roomArray.length}`;
  }
}

const getUserRoom = (users, socket) => {
  const userToChange = users.find((user) => user.userID === socket.id);
  const indexOfUser = users.indexOf(userToChange);
  const myRoom = users[indexOfUser].roomName;
  return myRoom;
};

async function setTurn(socket, io, playername) {
  //after setting up our rooms and adding users to the sequential number
  //of rooms we can get our user room, we take the second element of this
  //as each socket is part of its own room which is the first elem
  const myRoom = [...socket.rooms][1];

  //add username to the data section which is accessible globally
  socket.data.username = playername;

  //lets grab all the sockets which is in this sockets room
  const sockets = await io.in(myRoom).fetchSockets();
  //return the should restart variable back to false state in prep for next round
  sockets.forEach((elem) => (elem.data.restart = false));

  //we now create an array of the usernames
  const socketNames = sockets.map((elem) => {
    return { socketID: elem.id, socketName: elem.data.username };
  });
  //we see whether someone has joined but not submitted a name
  const dontSend = socketNames.some((elem) => elem.socketName === undefined);
  //if two players have joined the room and both have submitted a name we can
  //kick off the turn
  if (socketNames.length === 2 && !dontSend) {
    //set up a random number
    const randomNum = Math.floor(Math.random() * 2);
    const turnObj = {
      allPlayers: socketNames,
      whosTurn: socketNames[randomNum],
    };
    io.to(myRoom).emit("set-turn", turnObj);
  }
}

module.exports = { assignRooms, getUserRoom, setTurn };
