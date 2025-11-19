# Online Tic-Tac-Toe Game

A real-time multiplayer Tic-Tac-Toe web application where you can play with friends over the internet. Built with React, Node.js, and Socket.IO.

## Features

- **Create & Join Rooms**: Create a room with a unique code or join an existing one
- **Real-time Gameplay**: Both players see board updates instantly
- **In-game Chat**: Send messages while playing
- **Spectator Support**: Third users can join as spectators to watch
- **Responsive Design**: Works on desktop and mobile devices
- **Game State Management**: Automatic win/loss/draw detection
- **Play Again**: Start a new round without creating a new room

## Tech Stack

- **Frontend**: React 18 with CSS3
- **Backend**: Node.js with Express and Socket.IO
- **Real-time Communication**: WebSockets (Socket.IO)

## Installation & Setup

### Prerequisites

Make sure you have Node.js installed on your computer. Download it from [nodejs.org](https://nodejs.org) if you don't have it.

### Step 1: Install Dependencies

Open a terminal/command prompt and navigate to the project folder, then run:

#### For the backend (from project root):

```bash
cd server
npm install
```

#### For the frontend (from project root):

```bash
cd client
npm install
```

### Step 2: Start the Backend Server

In one terminal window, run:

```bash
cd server
npm start
```

You should see: `Server running on http://localhost:4000`

### Step 3: Start the Frontend

In a **new** terminal window (keep the server running), run:

```bash
cd client
npm start
```

This will automatically open `http://localhost:3000` in your browser.

## How to Play

1. **Enter your nickname** on the home screen
2. **Create a room** - You'll get a room code to share with your friend
   - OR **Join a room** - If your friend created one, paste their room code
3. **Wait for both players** to join (one is X, one is O)
4. **Take turns** clicking cells to place your symbol
5. **Win or Draw** - The game detects the result automatically
6. **Play Again** - Start a new round in the same room
7. **Use Chat** - Send messages to your opponent while playing

## Project Structure

```
TicTacToGameAmp/
├── server/
│   ├── index.js              # Main server file
│   ├── gameLogic.js          # Game rules & win detection
│   ├── roomManager.js        # Room and player management
│   └── package.json          # Backend dependencies
├── client/
│   ├── public/
│   │   └── index.html        # HTML template
│   ├── src/
│   │   ├── App.js            # Main React component
│   │   ├── App.css           # Styling
│   │   ├── index.js          # React entry point
│   │   ├── index.css         # Global styles
│   │   └── components/
│   │       ├── HomeScreen.js # Room creation/joining UI
│   │       ├── GameScreen.js # Main game interface
│   │       ├── Board.js      # Tic-Tac-Toe board
│   │       └── Chat.js       # In-game chat
│   └── package.json          # Frontend dependencies
└── README.md                 # This file
```

## How It Works (Technical Overview)

### Backend (`server/`)
- **index.js**: Express server that handles Socket.IO connections
  - Manages room creation/joining
  - Handles game moves and turn management
  - Broadcasts updates to all players in a room
  
- **roomManager.js**: In-memory storage for active games
  - Stores room data (players, board state, messages)
  - Validates moves
  - Manages player turn rotation
  
- **gameLogic.js**: Pure game logic
  - Checks for winners (rows, columns, diagonals)
  - Detects draws
  - Determines game status

### Frontend (`client/`)
- **App.js**: Main component that manages game state and Socket.IO connection
- **HomeScreen.js**: UI for entering nickname and creating/joining rooms
- **GameScreen.js**: Displays game status, players, and passes data to sub-components
- **Board.js**: 3x3 grid of clickable cells
- **Chat.js**: Message display and input

## Common Issues & Solutions

### "Connection refused" error?
- Make sure the backend server is running (`npm start` in the `server` folder)
- Check that it says "Server running on http://localhost:4000"

### Changes not showing up?
- Stop both servers (Ctrl+C)
- Make sure dependencies are installed for both (`npm install`)
- Start them again

### Multiple tabs/windows don't sync?
- This is expected. Each browser tab is a separate client. To test multiplayer, use two different browser windows or devices.

## Future Enhancements

The code is structured to easily add:
- Database storage (replace in-memory rooms)
- User accounts and authentication
- Game statistics/leaderboards
- Undo moves
- Different game variants
- AI opponent

## License

This project is open source and available for personal use.
