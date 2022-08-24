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

  roomArray.forEach((elem) =>
    console.log("for each", elem, rooms.get(elem), "newRoomList")
  );
}

function checkWhichRoom(socket, rooms) {
  console.log(rooms);
}

module.exports = { assignRooms, checkWhichRoom };
