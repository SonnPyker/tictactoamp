// Game logic for Tic-Tac-Toe

function checkWinner(board, boardSize = 3, winCondition = 3) {
  // Check rows
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col <= boardSize - winCondition; col++) {
      const firstSymbol = board[row * boardSize + col];
      if (!firstSymbol) continue;

      let match = true;
      for (let i = 1; i < winCondition; i++) {
        if (board[row * boardSize + col + i] !== firstSymbol) {
          match = false;
          break;
        }
      }
      if (match) return firstSymbol;
    }
  }

  // Check columns
  for (let col = 0; col < boardSize; col++) {
    for (let row = 0; row <= boardSize - winCondition; row++) {
      const firstSymbol = board[row * boardSize + col];
      if (!firstSymbol) continue;

      let match = true;
      for (let i = 1; i < winCondition; i++) {
        if (board[(row + i) * boardSize + col] !== firstSymbol) {
          match = false;
          break;
        }
      }
      if (match) return firstSymbol;
    }
  }

  // Check diagonal (top-left to bottom-right)
  for (let row = 0; row <= boardSize - winCondition; row++) {
    for (let col = 0; col <= boardSize - winCondition; col++) {
      const firstSymbol = board[row * boardSize + col];
      if (!firstSymbol) continue;

      let match = true;
      for (let i = 1; i < winCondition; i++) {
        if (
          board[(row + i) * boardSize + col + i] !== firstSymbol
        ) {
          match = false;
          break;
        }
      }
      if (match) return firstSymbol;
    }
  }

  // Check diagonal (top-right to bottom-left)
  for (let row = 0; row <= boardSize - winCondition; row++) {
    for (let col = winCondition - 1; col < boardSize; col++) {
      const firstSymbol = board[row * boardSize + col];
      if (!firstSymbol) continue;

      let match = true;
      for (let i = 1; i < winCondition; i++) {
        if (
          board[(row + i) * boardSize + (col - i)] !== firstSymbol
        ) {
          match = false;
          break;
        }
      }
      if (match) return firstSymbol;
    }
  }

  return null;
}

function isBoardFull(board) {
  return board.every((cell) => cell !== null);
}

function isGameOver(board, boardSize = 3, winCondition = 3) {
  return checkWinner(board, boardSize, winCondition) !== null || isBoardFull(board);
}

function getGameState(board, currentPlayer, boardSize = 3, winCondition = 3) {
  const winner = checkWinner(board, boardSize, winCondition);
  const isFull = isBoardFull(board);

  if (winner) {
    return {
      status: "finished",
      result: winner === "X" ? "X" : "O",
      message: `${winner} wins!`,
    };
  }

  if (isFull) {
    return {
      status: "finished",
      result: "draw",
      message: "It's a draw!",
    };
  }

  return {
    status: "playing",
    result: null,
    message: `${currentPlayer}'s turn`,
  };
}

module.exports = {
  checkWinner,
  isBoardFull,
  isGameOver,
  getGameState,
};
