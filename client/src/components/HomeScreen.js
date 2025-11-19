import React, { useState } from "react";

function HomeScreen({ onCreateRoom, onJoinRoom }) {
  const [nickname, setNickname] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [mode, setMode] = useState("create"); // create or join
  const [boardSize, setBoardSize] = useState(3);
  const [winCondition, setWinCondition] = useState(3);

  const handleCreateClick = () => {
    onCreateRoom(nickname, boardSize, winCondition);
    setNickname("");
  };

  const handleJoinClick = () => {
    onJoinRoom(nickname, roomCode);
    setNickname("");
    setRoomCode("");
  };

  return (
    <div className="home-screen">
      <h2>Welcome to Online Tic-Tac-Toe</h2>

      <div className="form-group">
        <label>Your Nickname</label>
        <input
          type="text"
          placeholder="Enter your name"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          maxLength="20"
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              if (mode === "create") {
                handleCreateClick();
              } else {
                handleJoinClick();
              }
            }
          }}
        />
      </div>

      {mode === "create" && (
        <>
          <div className="form-group">
            <label>Board Size: {boardSize}x{boardSize}</label>
            <input
              type="range"
              min="3"
              max="7"
              value={boardSize}
              onChange={(e) => {
                const size = parseInt(e.target.value);
                setBoardSize(size);
                // Ensure win condition doesn't exceed board size
                if (winCondition > size) {
                  setWinCondition(size);
                }
              }}
            />
            <div style={{ fontSize: "0.85rem", color: "#999", marginTop: "5px" }}>
              3 - 7
            </div>
          </div>

          <div className="form-group">
            <label>Win Condition (symbols in a row): {winCondition}</label>
            <input
              type="range"
              min="3"
              max={boardSize}
              value={winCondition}
              onChange={(e) => setWinCondition(parseInt(e.target.value))}
            />
            <div style={{ fontSize: "0.85rem", color: "#999", marginTop: "5px" }}>
              3 - {boardSize}
            </div>
          </div>
        </>
      )}

      {mode === "join" && (
        <div className="form-group">
          <label>Room Code</label>
          <input
            type="text"
            placeholder="Enter room code (e.g., ABC1)"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            maxLength="4"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleJoinClick();
              }
            }}
          />
        </div>
      )}

      <div className="button-group">
        {mode === "create" ? (
          <>
            <button className="btn btn-primary" onClick={handleCreateClick}>
              Create Room
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setMode("join")}
            >
              Join Room
            </button>
          </>
        ) : (
          <>
            <button className="btn btn-primary" onClick={handleJoinClick}>
              Join Room
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setMode("create")}
            >
              Create Room
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default HomeScreen;
