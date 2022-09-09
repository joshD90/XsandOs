function assignRoom(socket, rooms) {
  //our rooms returns a Map and so we turn this into an array to iterate over
  const arrayedRooms = Array.from(rooms);
  //as each socket has its own room, we only take rooms that dont contain
  //a socket of the same name inside it
  const realRooms = arrayedRooms.filter((room) => !room[1].has(room[0]));
  console.log(realRooms, "real rooms in assignRoom");
  //initially realRooms will be empty so we kick start off with room1
  if (realRooms.length === 0) {
    return socket.join("room1");
  }
  //each room has its name as first element and the second element is a Map of
  //sockets that are part of.  If there are less than two sockets present, we join that room
  const spareRoom = realRooms.find((room) => room[1].size < 2);
  const roomToJoin = determineRoomNum(realRooms);
  if (spareRoom) {
    socket.join(spareRoom[0]);
    console.log(`this socket has joined${spareRoom[0]}`);
  } else {
    console.log(roomToJoin);
    socket.join(`room${roomToJoin}`);
    console.log(`You have joined room${roomToJoin}`);
  }
}

function determineRoomNum(realRooms) {
  //which room to put them in.  We map a new array of names, the first element of the
  //room represents its name
  const roomNames = realRooms.map((room) => room[0]);
  //as all our 'real' rooms begin with "room" we remove this to get the number of the room
  //and convert to a int so we can sort it
  const roomNumbers = roomNames.map((name) =>
    parseInt(name.slice(4, name.length), 10)
  );
  //we sort the room numbers into ascending order
  const sortedRoomNums = roomNumbers.sort(function (a, b) {
    return a - b;
  });
  //now we check through the range of numbers from 1 to the highest
  let roomToJoin = null;
  for (let i = 1; i < sortedRoomNums[sortedRoomNums.length - 1] + 2; i++) {
    console.log(i, sortedRoomNums[sortedRoomNums.length - 1], "range of i");
    if (!sortedRoomNums.some((elem) => elem === i)) {
      console.log(i, " was not found in the array");
      roomToJoin = i;
      break;
    } else {
      console.log("I dont need to do anything");
    }
  }
  console.log(roomToJoin, "this is the room to join at end of determinroom");
  return roomToJoin;
}

module.exports = { assignRoom };
