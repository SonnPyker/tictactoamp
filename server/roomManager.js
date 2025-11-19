// Room management for Tic-Tac-Toe game

const { getGameState } = require("./gameLogic");

// Store rooms in memory
const rooms = new Map();

// Generate a short random room code (4 characters)
function generateRoomCode() {
  return Math.random().toString(36).substring(2, 6).toUpperCase();
}

// Create a new room
function createRoom(hostId, hostNickname, boardSize = 3, winCondition = 3) {
  let code;
  let attempts = 0;

  // Keep generating until we find a unique code
  do {
    code = generateRoomCode();
    attempts++;
  } while (rooms.has(code) && attempts < 100);

  if (attempts >= 100) {
    throw new Error("Could not generate unique room code");
  }

  const totalCells = boardSize * boardSize;
  const room = {
    code,
    hostId,
    hostNickname,
    players: {},
    boardSize,
    winCondition,
    board: Array(totalCells).fill(null),
    currentPlayer: "X",
    messages: [],
    createdAt: Date.now(),
  };

  rooms.set(code, room);
  return room;
}

// Get a room by code
function getRoom(code) {
  return rooms.get(code);
}

// Add a player to a room
function addPlayerToRoom(code, playerId, nickname) {
  const room = rooms.get(code);
  if (!room) {
    return { success: false, error: "Room not found" };
  }

  const playerCount = Object.keys(room.players).length;

  // Check if room is full
  if (playerCount >= 2) {
    return {
      success: false,
      error: "Room is full",
      isSpectator: true,
    };
  }

  // Assign X or O
  const playerSymbol = playerCount === 0 ? "X" : "O";

  room.players[playerId] = {
    id: playerId,
    nickname,
    symbol: playerSymbol,
    isSpectator: false,
  };

  return {
    success: true,
    room,
  };
}

// Add a spectator to a room
function addSpectatorToRoom(code, spectatorId, nickname) {
  const room = rooms.get(code);
  if (!room) {
    return { success: false, error: "Room not found" };
  }

  room.players[spectatorId] = {
    id: spectatorId,
    nickname,
    symbol: null,
    isSpectator: true,
  };

  return {
    success: true,
    room,
  };
}

// Make a move in a room
function makeMove(code, playerId, cellIndex) {
  const room = rooms.get(code);
  if (!room) {
    return { success: false, error: "Room not found" };
  }

  const player = room.players[playerId];
  if (!player || player.isSpectator) {
    return { success: false, error: "Only players can make moves" };
  }

  if (player.symbol !== room.currentPlayer) {
    return { success: false, error: "It's not your turn" };
  }

  if (room.board[cellIndex] !== null) {
    return { success: false, error: "Cell already occupied" };
  }

  // Make the move
  room.board[cellIndex] = room.currentPlayer;

  // Switch player
  room.currentPlayer = room.currentPlayer === "X" ? "O" : "X";

  return {
    success: true,
    board: room.board,
    currentPlayer: room.currentPlayer,
    gameState: getGameState(room.board, room.currentPlayer),
  };
}

// Add a message to the room
function addMessage(code, nickname, text) {
  const room = rooms.get(code);
  if (!room) {
    return { success: false };
  }

  room.messages.push({
    nickname,
    text,
    timestamp: Date.now(),
  });

  // Keep only last 100 messages
  if (room.messages.length > 100) {
    room.messages.shift();
  }

  return { success: true };
}

// Reset the game board (new round)
function resetGame(code) {
  const room = rooms.get(code);
  if (!room) {
    return { success: false, error: "Room not found" };
  }

  const totalCells = room.boardSize * room.boardSize;
  room.board = Array(totalCells).fill(null);
  // Alternate who goes first each round
  room.currentPlayer = room.currentPlayer === "X" ? "O" : "X";
  // Track rounds for alternating starts
  room.roundCount = (room.roundCount || 0) + 1;

  return {
    success: true,
    board: room.board,
    currentPlayer: room.currentPlayer,
  };
}

// Remove a player from a room
function removePlayerFromRoom(code, playerId) {
  const room = rooms.get(code);
  if (!room) {
    return;
  }

  delete room.players[playerId];

  // Delete room if empty
  if (Object.keys(room.players).length === 0) {
    rooms.delete(code);
  }
}

// Get all room info
function getRoomInfo(code) {
  const room = rooms.get(code);
  if (!room) {
    return null;
  }

  const gameState = getGameState(
    room.board,
    room.currentPlayer,
    room.boardSize,
    room.winCondition
  );

  return {
    code: room.code,
    players: room.players,  // Return players object, not array (keys are socket IDs)
    board: room.board,
    boardSize: room.boardSize,
    winCondition: room.winCondition,
    currentPlayer: room.currentPlayer,
    gameState,
    messages: room.messages,
  };
}

module.exports = {
  createRoom,
  getRoom,
  addPlayerToRoom,
  addSpectatorToRoom,
  makeMove,
  addMessage,
  resetGame,
  removePlayerFromRoom,
  getRoomInfo,
};
