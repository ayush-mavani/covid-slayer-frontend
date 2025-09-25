import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../contexts/GameContext";
import GameInterface from "../components/GameInterface";

const Game = () => {
  const { currentGame, gameStatus, createGame, resetGame } = useGame();
  const navigate = useNavigate();
  const [gameTime, setGameTime] = useState(60);
  const [isCreatingGame, setIsCreatingGame] = useState(false);
  const hasNavigated = useRef(false);

  useEffect(() => {
    // If no current game, redirect to dashboard (but only once)
    if (!currentGame && gameStatus === "idle" && !hasNavigated.current) {
      hasNavigated.current = true;
      navigate("/dashboard");
    }
  }, [currentGame, gameStatus, navigate]);

  const handleStartGame = async () => {
    setIsCreatingGame(true);
    const result = await createGame(gameTime);
    setIsCreatingGame(false);
  };

  const handleBackToDashboard = () => {
    resetGame();
    navigate("/dashboard");
  };

  if (!currentGame && gameStatus === "idle") {
    return (
      <div style={{ textAlign: "center", padding: "40px 0" }}>
        <div className="card" style={{ maxWidth: "500px", margin: "0 auto" }}>
          <h1>🎮 Start New Game</h1>
          <p style={{ marginBottom: "30px" }}>
            Configure your game settings and start battling the Covid Monster!
          </p>

          <div style={{ marginBottom: "30px" }}>
            <label className="form-label">Game Time (seconds)</label>
            <input
              type="number"
              min="30"
              max="300"
              value={gameTime}
              onChange={(e) => setGameTime(parseInt(e.target.value) || 60)}
              className="form-input"
              style={{ width: "200px", margin: "0 auto" }}
            />
          </div>

          <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
            <button
              onClick={handleStartGame}
              className="btn btn-primary"
              disabled={isCreatingGame}
              style={{ fontSize: "18px", padding: "15px 30px" }}
            >
              {isCreatingGame ? "Starting Game..." : "🚀 Start Game"}
            </button>
            <button
              onClick={handleBackToDashboard}
              className="btn btn-secondary"
              style={{ fontSize: "18px", padding: "15px 30px" }}
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1>🎮 Covid Slayer Game</h1>
        <button onClick={handleBackToDashboard} className="btn btn-secondary">
          ← Back to Dashboard
        </button>
      </div>

      <GameInterface />
    </div>
  );
};

export default Game;