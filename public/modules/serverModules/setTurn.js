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

module.exports = { setTurn };
