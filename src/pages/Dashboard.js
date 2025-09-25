import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useGame } from "../contexts/GameContext";
import GameInterface from "../components/GameInterface";

const Dashboard = () => {
  const { user } = useAuth();
  const { currentGame, gameStatus, createGame, resetGame } = useGame();

  const [isCreatingGame, setIsCreatingGame] = useState(false);
  const [gameTime, setGameTime] = useState(60);

  const handleStartGame = async () => {
    setIsCreatingGame(true);
    const result = await createGame(gameTime);
    setIsCreatingGame(false);
  };

  const handleResetGame = () => {
    resetGame();
  };

  return (
    <div>
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>Dashboard</h1>

      {/* User Profile Card */}
      <div className="card">
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <img
            src={user?.avatar}
            alt={user?.fullName}
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
          <div>
            <h2>{user?.fullName}</h2>
            <p style={{ color: "#666", marginBottom: "10px" }}>{user?.email}</p>
            <div style={{ display: "flex", gap: "20px", fontSize: "14px" }}>
              <span>🎮 Games Played: {user?.gamesPlayed || 0}</span>
              <span>🏆 Games Won: {user?.gamesWon || 0}</span>
              <span>📊 Win Rate: {user?.winRate || 0}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Game Section */}
      <div className="card" style={{ marginTop: "20px" }}>
        <h2 style={{ marginBottom: "20px" }}>🎮 Game Controls</h2>

        {!currentGame ? (
          <div>
            <div style={{ marginBottom: "20px" }}>
              <label className="form-label">Game Time (seconds)</label>
              <input
                type="number"
                min="30"
                max="300"
                value={gameTime}
                onChange={(e) => setGameTime(parseInt(e.target.value) || 60)}
                className="form-input"
                style={{ width: "200px" }}
              />
            </div>
            <button
              onClick={handleStartGame}
              className="btn btn-primary"
              disabled={isCreatingGame}
              style={{ fontSize: "18px", padding: "15px 30px" }}
            >
              {isCreatingGame ? "Starting Game..." : "🚀 Start New Game"}
            </button>
          </div>
        ) : (
          <div>
            <GameInterface />
            {gameStatus === "completed" && (
              <div style={{ textAlign: "center", marginTop: "20px" }}>
                <button
                  onClick={handleResetGame}
                  className="btn btn-primary"
                  style={{ fontSize: "18px", padding: "15px 30px" }}
                >
                  🎮 Play Again
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
