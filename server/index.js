// Backend server for Online Tic-Tac-Toe

const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const roomManager = require("./roomManager");

const app = express();
const server = http.createServer(app);

// CORS configuration for production
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
  "https://tictactoe.vercel.app",
  "https://tictactoamp.vercel.app",
  "https://tictactoe-vercel.app",
  // Add your exact Vercel URL here if different
  ...(process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",")
    : []),
];

// Socket.IO CORS - must match Express CORS
const io = socketIo(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);
app.use(express.json());

// In-memory map to track which room each socket is in
const socketRooms = new Map();

// Socket.IO connection handlers
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Create a new room
  socket.on("create_room", (nickname, boardSize, winCondition, callback) => {
    try {
      const room = roomManager.createRoom(socket.id, nickname, boardSize, winCondition);
      roomManager.addPlayerToRoom(room.code, socket.id, nickname);

      socketRooms.set(socket.id, room.code);
      socket.join(room.code);

      const roomInfo = roomManager.getRoomInfo(room.code);

      io.to(room.code).emit("room_updated", roomInfo);

      if (callback) {
        callback({ success: true, roomCode: room.code });
      }
    } catch (error) {
      console.error("Error creating room:", error);
      if (callback) {
        callback({ success: false, error: error.message });
      }
    }
  });

  // Join an existing room
  socket.on("join_room", (code, nickname, callback) => {
    try {
      const result = roomManager.addPlayerToRoom(code, socket.id, nickname);

      if (!result.success) {
        if (result.isSpectator) {
          // Add as spectator
          roomManager.addSpectatorToRoom(code, socket.id, nickname);
        } else {
          if (callback) {
            callback({ success: false, error: result.error });
          }
          return;
        }
      }

      socketRooms.set(socket.id, code);
      socket.join(code);

      const roomInfo = roomManager.getRoomInfo(code);

      io.to(code).emit("room_updated", roomInfo);

      if (callback) {
        callback({ success: true, room: roomInfo });
      }
    } catch (error) {
      console.error("Error joining room:", error);
      if (callback) {
        callback({ success: false, error: error.message });
      }
    }
  });

  // Make a move
  socket.on("make_move", (move, callback) => {
    const code = socketRooms.get(socket.id);
    if (!code) {
      if (callback) {
        callback({ success: false, error: "Not in a room" });
      }
      return;
    }

    const result = roomManager.makeMove(code, socket.id, move);

    if (!result.success) {
      if (callback) {
        callback(result);
      }
      return;
    }

    const roomInfo = roomManager.getRoomInfo(code);
    io.to(code).emit("room_updated", roomInfo);

    if (callback) {
      callback({ success: true });
    }
  });

  // Send a chat message
  socket.on("send_message", (text) => {
    const code = socketRooms.get(socket.id);
    if (!code) return;

    const room = roomManager.getRoom(code);
    if (!room) return;

    const player = room.players[socket.id];
    if (!player) return;

    roomManager.addMessage(code, player.nickname, text);

    const roomInfo = roomManager.getRoomInfo(code);
    io.to(code).emit("room_updated", roomInfo);
  });

  // Reset the game board for a new round
  socket.on("reset_game", (callback) => {
    const code = socketRooms.get(socket.id);
    if (!code) {
      if (callback) {
        callback({ success: false, error: "Not in a room" });
      }
      return;
    }

    const result = roomManager.resetGame(code);

    if (!result.success) {
      if (callback) {
        callback(result);
      }
      return;
    }

    const roomInfo = roomManager.getRoomInfo(code);
    io.to(code).emit("room_updated", roomInfo);

    if (callback) {
      callback({ success: true });
    }
  });

  // Disconnect handler
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);

    const code = socketRooms.get(socket.id);
    if (code) {
      roomManager.removePlayerFromRoom(code, socket.id);
      socketRooms.delete(socket.id);

      const roomInfo = roomManager.getRoomInfo(code);
      if (roomInfo) {
        io.to(code).emit("room_updated", roomInfo);
      }
    }
  });
});

// REST endpoint to check if server is running
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 4000;
const NODE_ENV = process.env.NODE_ENV || "development";

server.listen(PORT, "0.0.0.0", () => {
  console.log(`[${NODE_ENV.toUpperCase()}] Server running on port ${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
  console.log(`Allowed origins: ${allowedOrigins.join(", ")}`);
});
