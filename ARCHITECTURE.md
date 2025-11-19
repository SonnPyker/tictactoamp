# Architecture Guide

## How the App Works

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│  Browser (Frontend - React)                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ App.js (Main State & Socket Connection)              │   │
│  │  ├─ HomeScreen.js (Create/Join Room UI)             │   │
│  │  └─ GameScreen.js (Game Interface)                  │   │
│  │      ├─ Board.js (3x3 Grid)                         │   │
│  │      └─ Chat.js (Messages)                          │   │
│  └──────────────────────────────────────────────────────┘   │
│              ↕ WebSocket (Socket.IO)                         │
└─────────────────────────────────────────────────────────────┘
                      localhost:3000
                            ↕
                    (HTTP & WebSocket)
                            ↕
┌─────────────────────────────────────────────────────────────┐
│ Server (Backend - Node.js/Express)                           │
│ ┌──────────────────────────────────────────────────────┐    │
│ │ index.js (Express + Socket.IO Server)                │    │
│ │  ├─ Handles socket connections/disconnections        │    │
│ │  ├─ Emits: room_updated, events to clients           │    │
│ │  └─ Receives: create_room, join_room, make_move,     │    │
│ │               send_message, reset_game events        │    │
│ ├────────────────────────────────────────────────────┤    │
│ │ roomManager.js (Game State Storage)                  │    │
│ │  ├─ stores: rooms (in-memory Map)                    │    │
│ │  ├─ creates rooms with unique codes                  │    │
│ │  ├─ manages players and spectators                   │    │
│ │  ├─ validates and applies moves                      │    │
│ │  ├─ stores chat messages                             │    │
│ │  └─ resets games                                     │    │
│ ├────────────────────────────────────────────────────┤    │
│ │ gameLogic.js (Game Rules)                            │    │
│ │  ├─ checkWinner() - checks rows, columns, diagonals  │    │
│ │  ├─ isBoardFull() - checks for draw                  │    │
│ │  ├─ isGameOver() - combines above                    │    │
│ │  └─ getGameState() - returns status for UI           │    │
│ └──────────────────────────────────────────────────────┘    │
│              localhost:4000                                   │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### Creating a Room

```
User clicks "Create Room" → HomeScreen.js
    ↓
App.js calls: socket.emit("create_room", nickname)
    ↓
index.js receives event, calls:
    - roomManager.createRoom()
    - roomManager.addPlayerToRoom()
    ↓
roomManager adds room to Map, returns room data
    ↓
index.js broadcasts: io.to(roomCode).emit("room_updated", roomInfo)
    ↓
App.js receives "room_updated", updates roomData state
    ↓
GameScreen.js re-renders with new room data
```

### Joining a Room

```
User enters room code → HomeScreen.js
    ↓
App.js calls: socket.emit("join_room", code, nickname)
    ↓
index.js receives event, calls:
    - roomManager.addPlayerToRoom() or addSpectatorToRoom()
    ↓
roomManager adds player to existing room, returns room data
    ↓
index.js broadcasts: io.to(roomCode).emit("room_updated", roomInfo)
    ↓
Both old and new player receive updated room info
    ↓
GameScreen.js renders with both players
```

### Making a Move

```
User clicks cell → Board.js onClick handler
    ↓
GameScreen.js calls: onMakeMove(cellIndex)
    ↓
App.js calls: socket.emit("make_move", cellIndex)
    ↓
index.js receives event, calls:
    - Validates it's player's turn
    - Validates cell is empty
    - roomManager.makeMove()
    ↓
roomManager:
    - Places symbol on board
    - Switches currentPlayer
    - Calls gameLogic.getGameState() to check for win/draw
    ↓
index.js broadcasts: io.to(roomCode).emit("room_updated", roomInfo)
    ↓
All clients (players + spectators) see updated board
```

### Sending Chat Message

```
User types message → Chat.js sends
    ↓
App.js calls: socket.emit("send_message", text)
    ↓
index.js receives event, calls:
    - Gets player nickname from room data
    - roomManager.addMessage(code, nickname, text)
    ↓
roomManager adds message to room.messages array
    ↓
index.js broadcasts: io.to(roomCode).emit("room_updated", roomInfo)
    ↓
All clients receive updated messages array
    ↓
Chat.js renders all messages with auto-scroll
```

## Room Data Structure

```javascript
{
  code: "ABC1",                    // Room identifier
  hostId: "socket-id-xxx",         // Who created the room
  hostNickname: "Alice",
  players: {
    "socket-id-1": {
      id: "socket-id-1",
      nickname: "Alice",
      symbol: "X",                 // X or O
      isSpectator: false
    },
    "socket-id-2": {
      id: "socket-id-2",
      nickname: "Bob",
      symbol: "O",
      isSpectator: false
    },
    "socket-id-3": {
      id: "socket-id-3",
      nickname: "Charlie",
      symbol: null,
      isSpectator: true            // Can only watch
    }
  },
  board: [
    "X", null, "O",
    null, "X", null,
    "O", null, null
  ],                               // Index 0-8 representing 3x3 grid
  currentPlayer: "O",              // Whose turn
  messages: [
    { nickname: "Alice", text: "Hi!", timestamp: 1234567890 },
    { nickname: "Bob", text: "Hello!", timestamp: 1234567891 }
  ],
  createdAt: 1234567890
}
```

## Board Index Layout

```
0 | 1 | 2
---------
3 | 4 | 5
---------
6 | 7 | 8
```

When a player clicks a cell, the index (0-8) is sent to the server.

## Game Logic

### Checking for a Winner

The game checks for three consecutive symbols in a line:

```javascript
// Rows: (0,1,2), (3,4,5), (6,7,8)
// Columns: (0,3,6), (1,4,7), (2,5,8)
// Diagonals: (0,4,8), (2,4,6)

If all three positions have the same symbol → Winner!
```

### Game States

```
Playing:
  - status: "playing"
  - message: "X's turn" or "O's turn"

Won:
  - status: "finished"
  - result: "X" or "O"
  - message: "X wins!" or "O wins!"

Draw:
  - status: "finished"
  - result: "draw"
  - message: "It's a draw!"
```

## Real-Time Sync Mechanism

Every time the game state changes, the server broadcasts the entire room state to all connected clients in that room:

```javascript
io.to(roomCode).emit("room_updated", roomInfo)
```

This ensures all players and spectators always see the same:
- Board state
- Whose turn it is
- Chat messages
- Win/loss status

## Disconnection Handling

When a player disconnects:
```
Socket disconnects → index.js "disconnect" event
    ↓
roomManager.removePlayerFromRoom() called
    ↓
If room becomes empty, room is deleted
    ↓
If room still has players, broadcast room_updated to remaining players
```

If both players disconnect, the room is automatically cleaned up.

## Extensibility

The code is designed to be extended:

### Adding a Database

Replace in-memory `rooms.Map` in `roomManager.js` with database calls:
```javascript
// Current (in-memory):
const room = rooms.get(code)

// Could become (with database):
const room = await db.rooms.findByCode(code)
```

### Adding Authentication

Modify `index.js` to verify user identity before emitting moves:
```javascript
socket.on("make_move", (move, callback) => {
  const userId = socket.userId  // From auth middleware
  // Verify this socket belongs to the registered user
  // ...
})
```

### Adding Game Variants

Add new functions to `gameLogic.js` for different rules:
```javascript
function checkWinnerLargerBoard() { ... }
function checkWinnerOmok() { ... }
```

### Adding Ratings/Leaderboard

Store game results and player stats in database, expose via REST API.
