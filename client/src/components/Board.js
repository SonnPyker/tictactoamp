import React from "react";

function Board({ board, onCellClick, disabled, boardSize = 3 }) {
  const handleClick = (index) => {
    if (!disabled && board[index] === null) {
      onCellClick(index);
    }
  };

  return (
    <div
      className="board"
      style={{
        gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
        gridTemplateRows: `repeat(${boardSize}, 1fr)`,
      }}
    >
      {board.map((cell, index) => (
        <button
          key={index}
          className={`cell ${cell ? cell.toLowerCase() : ""}`}
          onClick={() => handleClick(index)}
          disabled={disabled || cell !== null}
        >
          {cell}
        </button>
      ))}
    </div>
  );
}

export default Board;
