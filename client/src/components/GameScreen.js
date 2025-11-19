import React, { useState, useRef, useEffect } from "react";
import Board from "./Board";
import Chat from "./Chat";

function GameScreen({
  roomCode,
  roomData,
  nickname,
  playerSymbol,
  isSpectator,
  onMakeMove,
  onSendMessage,
  onResetGame,
  onLeaveRoom,
}) {
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [roomData?.messages]);

  if (!roomData) {
    return (
      <div className="game-screen">
        <div className="waiting-message">
          <span className="waiting-spinner"></span>
          Connecting to room...
        </div>
      </div>
    );
  }

  const players = Object.values(roomData.players);
  const playerCount = players.filter((p) => !p.isSpectator).length;

  const xPlayer = players.find((p) => p.symbol === "X");
  const oPlayer = players.find((p) => p.symbol === "O");

  const gameState = roomData.gameState;
  const isGameOver = gameState.status === "finished";
  
  // Use playerSymbol from props, or derive from roomData if needed
  const currentPlayerSymbol = playerSymbol;
  const isMyTurn =
    currentPlayerSymbol && roomData.currentPlayer === currentPlayerSymbol && !isGameOver;

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      onSendMessage(messageInput);
      setMessageInput("");
    }
  };

  return (
    <div className="game-screen">
      <div className="game-header">
        <h2>Room: {roomCode}</h2>
        <div className="players-info">
          {xPlayer ? (
            <div className="player-info">
              <div className="player-name">
                {xPlayer.nickname}
                {xPlayer.isSpectator && <span className="spectator-badge">Spectator</span>}
              </div>
              <div
                className={`player-symbol ${
                  roomData.currentPlayer === "X" && !isGameOver
                    ? ""
                    : "inactive"
                }`}
              >
                X
              </div>
            </div>
          ) : (
            <div className="player-info">
              <div className="player-name">Waiting...</div>
              <div className="player-symbol inactive">X</div>
            </div>
          )}

          {oPlayer ? (
            <div className="player-info">
              <div className="player-name">
                {oPlayer.nickname}
                {oPlayer.isSpectator && <span className="spectator-badge">Spectator</span>}
              </div>
              <div
                className={`player-symbol ${
                  roomData.currentPlayer === "O" && !isGameOver
                    ? ""
                    : "inactive"
                }`}
              >
                O
              </div>
            </div>
          ) : (
            <div className="player-info">
              <div className="player-name">Waiting...</div>
              <div className="player-symbol inactive">O</div>
            </div>
          )}
        </div>

        <div className="status">
          {playerCount < 2 ? (
            <>
              <span className="waiting-spinner"></span>
              Waiting for another player...
            </>
          ) : isGameOver ? (
            <span className={gameState.result === "draw" ? "draw" : "winner"}>
              {gameState.message}
            </span>
          ) : isSpectator ? (
            <span>{gameState.message}</span>
          ) : isMyTurn ? (
            <span style={{ color: "#4caf50", fontWeight: "bold" }}>
              Your turn!
            </span>
          ) : (
            <span>{gameState.message}</span>
          )}
        </div>
      </div>

      {playerCount >= 2 ? (
        <>
          <div className="game-content">
            <div className="board-section">
              <Board
                board={roomData.board}
                onCellClick={onMakeMove}
                disabled={!isMyTurn || isSpectator}
              />

              {isGameOver && playerCount >= 2 && (
                <button
                  className="btn btn-primary reset-button"
                  onClick={onResetGame}
                >
                  Play Again
                </button>
              )}

              <button
                className="btn btn-leave leave-button"
                onClick={onLeaveRoom}
              >
                Leave Room
              </button>
            </div>

            <Chat
              messages={roomData.messages}
              nickname={nickname}
              onSendMessage={handleSendMessage}
              messageInput={messageInput}
              setMessageInput={setMessageInput}
              messagesEndRef={messagesEndRef}
            />
          </div>
        </>
      ) : (
        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <div className="waiting-message">
            <span className="waiting-spinner"></span>
            Waiting for another player to join...
          </div>
          <div style={{ marginTop: "40px" }}>
            <p style={{ color: "white", fontSize: "0.95rem" }}>
              Share this room code with your friend:
            </p>
            <div style={{ marginTop: "15px" }}>
              <div
                className="room-code"
                style={{ fontSize: "1.3rem", padding: "15px 25px" }}
              >
                {roomCode}
              </div>
            </div>
          </div>
          <button
            className="btn btn-leave leave-button"
            style={{ marginTop: "40px", maxWidth: "300px", margin: "40px auto 0" }}
            onClick={onLeaveRoom}
          >
            Leave Room
          </button>
        </div>
      )}
    </div>
  );
}

export default GameScreen;
