async function assignRoom(socket, rooms) {
  //our rooms returns a Map and so we turn this into an array to iterate over
  const arrayedRooms = Array.from(rooms);
  //as each socket has its own room, we only take rooms that dont contain
  //a socket of the same name inside it
  const realRooms = arrayedRooms.filter((room) => !room[1].has(room[0]));
  //initially realRooms will be empty so we kick start off with room1
  if (realRooms.length === 0) {
    return socket.join("room1");
  }

  const spareRoom = realRooms.find((room) => room[1].size < 2);
  roomToJoin(realRooms);
  if (spareRoom) {
    socket.join(spareRoom[0]);
  } else {
    socket.join(`room${roomToJoin(realRooms)}`);
  }
  console.log(realRooms, "real rooms at the end");
}

function roomToJoin(realRooms) {
  const roomNums = realRooms.map((room) =>
    parseInt(room[0].slice(4, room[0].length))
  );
  const sortedRooms = roomNums.sort(function (a, b) {
    return a - b;
  });
  for (let i = 1; 1 < sortedRooms[sortedRooms.length - 1] + 2; i++) {
    if (!sortedRooms.some((roomNum) => roomNum === i)) return i;
  }
}

module.exports = { assignRoom };
