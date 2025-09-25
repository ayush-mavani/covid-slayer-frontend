import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useGame } from "../contexts/GameContext";

const GameHistory = () => {
  const { getGameHistory } = useGame();
  const [games, setGames] = useState([]);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGames();
  }, [currentPage]);

  const loadGames = async () => {
    setLoading(true);
    const result = await getGameHistory(currentPage, 2);
    setGames(result.games);
    setPagination(result.pagination);
    setLoading(false);
  };

  const getResultClass = (winner) => {
    switch (winner) {
      case "player":
        return "win";
      case "monster":
        return "loss";
      case "timeout":
        return "draw";
      default:
        return "draw";
    }
  };

  const getResultText = (winner) => {
    switch (winner) {
      case "player":
        return "Victory";
      case "monster":
        return "Defeat";
      case "timeout":
        return "Draw";
      default:
        return "Unknown";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
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
          marginBottom: "30px",
        }}
      >
        <h1>📜 Game History</h1>
      </div>

      {games.length === 0 ? (
        <div className="card" style={{ textAlign: "center" }}>
          <h2>No Games Played Yet</h2>
          <p style={{ marginBottom: "20px" }}>
            Start playing games to see your history here!
          </p>
          <Link to="/game" className="btn btn-primary">
            🎮 Start Playing
          </Link>
        </div>
      ) : (
        <>
          <div className="card">
            <h2 style={{ marginBottom: "20px" }}>Your Game History</h2>

            {games.map((game) => (
              <div key={game._id} className="game-history-item ">
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "20px",
                      marginBottom: "10px",
                    }}
                  >
                    <span
                      className={`game-result ${getResultClass(game.winner)}`}
                    >
                      {getResultText(game.winner)}
                    </span>
                    <span style={{ fontWeight: "bold" }}>
                      {game.playerName}
                    </span>
                    <span>vs</span>
                    <span style={{ fontWeight: "bold" }}>Covid Monster</span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "30px",
                      fontSize: "14px",
                      color: "#666",
                    }}
                  >
                    <span>Player Health: {game.playerHealth}%</span>
                    <span>Monster Health: {game.monsterHealth}%</span>
                    <span>
                      Duration: {game.duration ? `${game.duration}s` : "N/A"}
                    </span>
                    <span>Date: {formatDate(game.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="card" style={{ textAlign: "center" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                  alignItems: "center",
                }}
              >
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="btn btn-secondary"
                >
                  ← Previous
                </button>

                <span style={{ margin: "0 20px" }}>
                  Page {currentPage} of {pagination.pages}
                </span>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.pages}
                  className="btn btn-secondary"
                >
                  Next →
                </button>
              </div>

              <div
                style={{ marginTop: "10px", fontSize: "14px", color: "#666" }}
              >
                Showing {games.length} of {pagination.total} games
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GameHistory;
