import React, { useState } from "react";

function HomeScreen({ onCreateRoom, onJoinRoom }) {
  const [nickname, setNickname] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [mode, setMode] = useState("create"); // create or join

  const handleCreateClick = () => {
    onCreateRoom(nickname);
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
