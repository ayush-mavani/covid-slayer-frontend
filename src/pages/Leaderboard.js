import React, { useState, useEffect } from "react";
import { usersAPI } from "../utils/api";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, [currentPage]);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await usersAPI.getLeaderboard(currentPage, 10);
      if (response.data.success) {
        setLeaderboard(response.data.leaderboard);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error("Failed to load leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return "🥇";
      case 1:
        return "🥈";
      case 2:
        return "🥉";
      default:
        return `#${index + 1}`;
    }
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
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>Leaderboard</h1>

      {leaderboard.length === 0 ? (
        <div className="card" style={{ textAlign: "center" }}>
          <h2>No Players Yet</h2>
          <p>Be the first to play and appear on the leaderboard!</p>
        </div>
      ) : (
        <>
          <div className="card">
            <h2 style={{ marginBottom: "20px" }}>Top Players</h2>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #e1e5e9" }}>
                    <th style={{ padding: "15px", textAlign: "left" }}>Rank</th>
                    <th style={{ padding: "15px", textAlign: "left" }}>
                      Player
                    </th>
                    <th style={{ padding: "15px", textAlign: "center" }}>
                      Games Played
                    </th>
                    <th style={{ padding: "15px", textAlign: "center" }}>
                      Games Won
                    </th>
                    <th style={{ padding: "15px", textAlign: "center" }}>
                      Win Rate
                    </th>
                    <th style={{ padding: "15px", textAlign: "center" }}>
                      Damage Dealt
                    </th>
                    <th style={{ padding: "15px", textAlign: "center" }}>
                      Damage Taken
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((player, index) => (
                    <tr
                      key={player._id}
                      style={{ borderBottom: "1px solid #e1e5e9" }}
                    >
                      <td
                        style={{
                          padding: "15px",
                          fontWeight: "bold",
                          fontSize: "18px",
                        }}
                      >
                        {getRankIcon(index)}
                      </td>
                      <td style={{ padding: "15px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <img
                            src={player.avatar}
                            alt={player.fullName}
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "50%",
                              objectFit: "cover",
                            }}
                          />
                          <span style={{ fontWeight: "bold" }}>
                            {player.fullName}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: "15px", textAlign: "center" }}>
                        {player.gamesPlayed}
                      </td>
                      <td style={{ padding: "15px", textAlign: "center" }}>
                        {player.gamesWon}
                      </td>
                      <td style={{ padding: "15px", textAlign: "center" }}>
                        <span
                          style={{
                            fontWeight: "bold",
                            color:
                              player.winRate >= 70
                                ? "#28a745"
                                : player.winRate >= 50
                                ? "#ffc107"
                                : "#dc3545",
                          }}
                        >
                          {player.winRate}%
                        </span>
                      </td>
                      <td style={{ padding: "15px", textAlign: "center" }}>
                        {player.totalDamageDealt.toLocaleString()}
                      </td>
                      <td style={{ padding: "15px", textAlign: "center" }}>
                        {player.totalDamageTaken.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
                Showing {leaderboard.length} of {pagination.total} players
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Leaderboard;
