# X's and O's

## Readme

---

## Overview

This was a project to create an X's and O's game from scratch. On connecting to the server, the user will be shown a page where they can enter their name. Once they provide a name they will be connected with another user who has also joined the server. They will be able to play against each other. On winning or losing, the player will be provided with an opportunity to rematch with the other player or to restart the whole process again.

---

## Under the Hood

**Express**

> Express is a node js web application framework that provides broad features for building web and mobile applications. It is used to build a single page, multipage, and hybrid web application. It's a layer built on the top of the Node js that helps manage servers and routes.

The server is created with Node and is set to run on http://localhost:3000/. The server will serve the html through Express, using app.sendFile.  
[Link to NPM Express Description](https://www.npmjs.com/package/express)
Static files are served from the Public folder.

**Socket.io**

> Socket.IO is a library that enables low-latency, bidirectional and event-based communication between a client and a server.

We use Socket.io to open a persistent connection between the client and server. The server then acts as a middle man between two connecting clients and facilitating sharing of information. As this is a two player game, the server-side allocates players to different rooms, two to a room.

**Room Allocation**

Each socket comes with it's own socket ID and each socket is joined to a room of the same name as that ID. When we get all the Room Names associated with the server we must first filter out these automatic names and we do so by removing all room names that have a name matching the contained socket ID. We refer to this filtered list as 'Real Rooms'

We then go through all the rooms to see whether there are any with just 1 user present in that room. We will fill up these rooms first. It is possible that players have joined and left which leaves us at a point where we are allocating players to room 6 or 7 but room 1, 2 and 3 are perhaps empty. To avoid this, on every cycle we run a for loop with a range of 1 to the highest room number to see whether there are any empty rooms prior to the latest number.

This project also facilitates room switching, if another player does not join within a certain timeframe, or hit rematch within a certain time-frame, the server will re-allocate the player to a different room with an active user if there is one available.

**Drawing the Board**

The game board is drawn using html5 Canvas. The draw function is linked to mouse movement as squares can be highlighted, to player selection or on a player win. The board can be of varying sizes set by the **numXRows** and **numYRows** items of the **userObject**. An array of squares with grid coordinates and centerpoints for each square. The draw function is based on this array.

1. The background is drawn over everything.
2. The grid lines are applied.
3. The highlight square is applied.
4. The player selection is drawn.
5. The Other players selection is drawn.

**Checking for a Win**

Every time a player makes a new selection we check for a win state. We iterate through every element of the player's selection. For each iteration we check every square in every direction. If the next square over in that direction is also part of the player selection array, we recursively continue by checking the next square in that same direction. This means that all win states are judged dynamically and with differing length as opposed to comparing to a limited matrix of potential win states as appears to be commonly used in examples across the internet.

---

## Setting Up

### This Project Requires

- npm installed : npm install docs
- Node installed : node install docs
- MongoDB and MongoDB Shell installed : mongodb install docs
- Install Nodemon Globally : npm install -g nodemon
- -g will install nodemon globally and may require sudo access

### Getting Started

- Using CLI go to root directory - enter: npm install (This will install all the dependencies)
- Inside this directory enter : nodemon server.js
- Navigate to http://localhost:3000
