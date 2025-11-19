// Game logic for Tic-Tac-Toe

function checkWinner(board) {
  // Check rows
  for (let i = 0; i < 3; i++) {
    if (
      board[i * 3] &&
      board[i * 3] === board[i * 3 + 1] &&
      board[i * 3] === board[i * 3 + 2]
    ) {
      return board[i * 3];
    }
  }

  // Check columns
  for (let i = 0; i < 3; i++) {
    if (
      board[i] &&
      board[i] === board[i + 3] &&
      board[i] === board[i + 6]
    ) {
      return board[i];
    }
  }

  // Check diagonal (top-left to bottom-right)
  if (board[0] && board[0] === board[4] && board[0] === board[8]) {
    return board[0];
  }

  // Check diagonal (top-right to bottom-left)
  if (board[2] && board[2] === board[4] && board[2] === board[6]) {
    return board[2];
  }

  return null;
}

function isBoardFull(board) {
  return board.every((cell) => cell !== null);
}

function isGameOver(board) {
  return checkWinner(board) !== null || isBoardFull(board);
}

function getGameState(board, currentPlayer) {
  const winner = checkWinner(board);
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
