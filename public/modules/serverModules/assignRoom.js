async function assignRoom(socket, rooms) {
  //our rooms returns a Map and so we turn this into an array to iterate over
  const arrayedRooms = Array.from(rooms);
  //as each socket has its own room, we only take rooms that dont contain
  //a socket of the same name inside it
  const realRooms = arrayedRooms.filter((room) => !room[1].has(room[0]));
  //initially realRooms will be empty so we kick start off with room1 as default room to join
  if (realRooms.length === 0) {
    return socket.join("room1");
  }
  //we check through all the available rooms to see whether there is a room with just one in it.  If there is,
  //we join the first one we find
  const spareRoom = realRooms.find((room) => room[1].size < 2);
  roomToJoin(realRooms);
  if (spareRoom) {
    socket.join(spareRoom[0]);
  } else {
    socket.join(`room${roomToJoin(realRooms)}`);
  }
  console.log(realRooms, "real rooms at the end");
}
//if there are no spare rooms to join, we check to see whether there are any room names that have become
//available, ie. both users have disconnected from room 1, however there are users in room 2,3,4,5,6.  This will
//now join room one.  If all these rooms names are used, join the next sequential room name
function roomToJoin(realRooms) {
  //convert our room names, removing "room" we are left with an integer
  const roomNums = realRooms.map((room) =>
    parseInt(room[0].slice(4, room[0].length))
  );

  //sort this array of integers into ascending order
  const sortedRooms = roomNums.sort(function (a, b) {
    return a - b;
  });
  //we run a loop 1 beyond the highest room number name.  If any of those roomnames are not in use, join that room
  for (let i = 1; 1 < sortedRooms[sortedRooms.length - 1] + 2; i++) {
    if (!sortedRooms.some((roomNum) => roomNum === i)) return i;
  }
}

module.exports = { assignRoom };
