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

  if (spareRoom) {
    socket.join(spareRoom[0]);
    console.log(`this socket has joined${spareRoom[0]}`);
  } else {
    socket.join(`room${realRooms.length + 1}`);
    console.log(`You have joined room${realRooms.length + 1}`);
  }
}

module.exports = { assignRoom };
