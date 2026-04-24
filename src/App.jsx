import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, moveCount }) {
  const [selectedSquare, setSelectedSquare] = useState(null);

  function handleClick(i) {
    const winner = calculateWinner(squares);
    if (winner) {
      return;
    }

    const currentPlayer = xIsNext ? 'X' : 'O';
    const playerMoves = xIsNext
      ? Math.ceil(moveCount / 2)
      : Math.floor(moveCount / 2);

    // placement phase: each player has fewer than 3 pieces
    if (playerMoves < 3) {
      if (squares[i]) {
        return;
      }
      const nextSquares = squares.slice();
      nextSquares[i] = currentPlayer;
      setSelectedSquare(null);
      onPlay(nextSquares);
      return;
    }

    // movement phase: player already has 3 pieces on the board
    if (selectedSquare === null) {
      // first click: select a piece to move
      if (squares[i] !== currentPlayer) {
        return;
      }
      setSelectedSquare(i);
    } else {
      // second click: choose destination
      const from = selectedSquare;
      setSelectedSquare(null);

      if (squares[i]) {
        // destination not empty - invalid move
        return;
      }

      if (!isAdjacent(from, i)) {
        // not an adjacent square - invalid move
        return;
      }

      // center square rule: if current player occupies center,
      // they must either win or vacate the center
      if (squares[4] === currentPlayer) {
        const testSquares = squares.slice();
        testSquares[from] = null;
        testSquares[i] = currentPlayer;

        const moveLeavesCenter = (from === 4);
        const moveWins = calculateWinner(testSquares) === currentPlayer;

        if (!moveLeavesCenter && !moveWins) {
          // move doesn't vacate center and doesn't win
          return;
        }
      }

      const nextSquares = squares.slice();
      nextSquares[from] = null;
      nextSquares[i] = currentPlayer;
      onPlay(nextSquares);
    }
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [moveCount, setMoveCount] = useState(0);
  const xIsNext = moveCount % 2 === 0;

  function handlePlay(nextSquares) {
    setSquares(nextSquares);
    setMoveCount(moveCount + 1);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board
          xIsNext={xIsNext}
          squares={squares}
          onPlay={handlePlay}
          moveCount={moveCount}
        />
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function isAdjacent(from, to) {
  const rowFrom = Math.floor(from / 3);
  const colFrom = from % 3;
  const rowTo = Math.floor(to / 3);
  const colTo = to % 3;

  const rowDiff = Math.abs(rowFrom - rowTo);
  const colDiff = Math.abs(colFrom - colTo);

  return rowDiff <= 1 && colDiff <= 1 && (rowDiff + colDiff > 0);
}
