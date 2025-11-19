import React, { useMemo } from "react";

function Board({ board, onCellClick, disabled, boardSize = 3 }) {
  const handleClick = (index) => {
    if (!disabled && board[index] === null) {
      onCellClick(index);
    }
  };

  const boardStyles = useMemo(() => {
    // Calculate optimal board size based on viewport
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    
    // Reserve space for header, status, buttons, padding
    const reservedHeight = 280; // pixels for non-board elements
    const availableHeight = vh - reservedHeight;
    const availableWidth = vw - 40; // padding
    
    // Use the smaller dimension to ensure everything fits
    const maxSize = Math.min(availableHeight, availableWidth);
    
    // Add some margin for breathing room
    const boardSize_ = Math.max(40, maxSize - 20);
    
    return {
      gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
      gridTemplateRows: `repeat(${boardSize}, 1fr)`,
      width: `${boardSize_}px`,
      height: `${boardSize_}px`,
    };
  }, [boardSize]);

  return (
    <div
      className="board"
      style={boardStyles}
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
