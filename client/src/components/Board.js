import React from "react";

function Board({ board, onCellClick, disabled }) {
  const handleClick = (index) => {
    if (!disabled && board[index] === null) {
      onCellClick(index);
    }
  };

  return (
    <div className="board">
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
