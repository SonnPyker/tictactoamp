import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./App.css";
import HomeScreen from "./components/HomeScreen";
import GameScreen from "./components/GameScreen";

const SOCKET_URL =
  process.env.REACT_APP_SOCKET_URL || "http://localhost:4000";

function App() {
  const [socket, setSocket] = useState(null);
  const [screen, setScreen] = useState("home"); // home or game
  const [nickname, setNickname] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [roomData, setRoomData] = useState(null);
  const [error, setError] = useState("");
  const [playerSymbol, setPlayerSymbol] = useState(null);
  const [isSpectator, setIsSpectator] = useState(false);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    newSocket.on("connect", () => {
      console.log("Connected to server");
    });

    newSocket.on("room_updated", (data) => {
      console.log("Room updated:", data);
      setRoomData(data);

      // Find this player's symbol
      const thisPlayer = data.players[newSocket.id];
      if (thisPlayer) {
        setPlayerSymbol(thisPlayer.symbol);
        setIsSpectator(thisPlayer.isSpectator);
      }
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    newSocket.on("error", (error) => {
      console.error("Socket error:", error);
      setError(error.message || "Connection error");
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleCreateRoom = (playerNickname) => {
    if (!socket || !playerNickname.trim()) {
      setError("Please enter a nickname");
      return;
    }

    socket.emit("create_room", playerNickname, (response) => {
      if (response.success) {
        setNickname(playerNickname);
        setRoomCode(response.roomCode);
        setScreen("game");
        setError("");
      } else {
        setError(response.error || "Failed to create room");
      }
    });
  };

  const handleJoinRoom = (playerNickname, code) => {
    if (!socket || !playerNickname.trim() || !code.trim()) {
      setError("Please enter both nickname and room code");
      return;
    }

    socket.emit("join_room", code.toUpperCase(), playerNickname, (response) => {
      if (response.success) {
        setNickname(playerNickname);
        setRoomCode(code.toUpperCase());
        setRoomData(response.room);
        setScreen("game");
        setError("");
      } else {
        if (response.isSpectator) {
          // Add as spectator
          setNickname(playerNickname);
          setRoomCode(code.toUpperCase());
          setIsSpectator(true);
          setScreen("game");
          setError("");
        } else {
          setError(response.error || "Failed to join room");
        }
      }
    });
  };

  const handleMakeMove = (cellIndex) => {
    if (!socket || isSpectator) {
      return;
    }

    socket.emit("make_move", cellIndex, (response) => {
      if (!response.success) {
        setError(response.error || "Invalid move");
      }
    });
  };

  const handleSendMessage = (text) => {
    if (!socket) return;
    socket.emit("send_message", text);
  };

  const handleResetGame = () => {
    if (!socket) return;

    socket.emit("reset_game", (response) => {
      if (!response.success) {
        setError(response.error || "Failed to reset game");
      }
    });
  };

  const handleLeaveRoom = () => {
    if (socket) {
      socket.disconnect();
    }
    setScreen("home");
    setNickname("");
    setRoomCode("");
    setRoomData(null);
    setPlayerSymbol(null);
    setIsSpectator(false);
    setError("");
  };

  return (
    <div className="app">
      <div className="app-container">
        <div className="header">
          <h1>🎮 Online Tic-Tac-Toe</h1>
          <p>Play with friends in real-time</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        {screen === "home" ? (
          <HomeScreen
            onCreateRoom={handleCreateRoom}
            onJoinRoom={handleJoinRoom}
            error={error}
          />
        ) : (
          <GameScreen
            roomCode={roomCode}
            roomData={roomData}
            nickname={nickname}
            playerSymbol={playerSymbol}
            isSpectator={isSpectator}
            onMakeMove={handleMakeMove}
            onSendMessage={handleSendMessage}
            onResetGame={handleResetGame}
            onLeaveRoom={handleLeaveRoom}
          />
        )}
      </div>
    </div>
  );
}

export default App;
