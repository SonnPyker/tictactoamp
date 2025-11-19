@echo off
REM =========================================================
REM Online Tic-Tac-Toe - Development Server Launcher
REM =========================================================
REM This batch file starts both the backend and frontend
REM servers in separate terminal windows
REM =========================================================

echo.
echo ===================================================
echo   Starting Online Tic-Tac-Toe Development Servers
echo ===================================================
echo.

REM Start backend server in a new window
echo Starting Backend Server on http://localhost:4000...
start "Tic-Tac-Toe Backend" cmd /k "cd server && npm start"

REM Wait 3 seconds for backend to start
timeout /t 3 /nobreak

REM Start frontend server in a new window
echo Starting Frontend Server on http://localhost:3000...
start "Tic-Tac-Toe Frontend" cmd /k "cd client && npm start"

echo.
echo ===================================================
echo   Servers Starting...
echo ===================================================
echo.
echo   Backend:  http://localhost:4000
echo   Frontend: http://localhost:3000
echo.
echo   The frontend browser will open automatically.
echo   If not, visit http://localhost:3000 manually.
echo.
echo   To stop the servers, close the terminal windows.
echo.
pause
