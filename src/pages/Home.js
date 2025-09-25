import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div style={{ textAlign: "center", padding: "40px 0" }}>
      <div className="card" style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h1
          style={{ fontSize: "48px", marginBottom: "20px", color: "#667eea" }}
        >
          🦠 Covid Slayer
        </h1>
        <p style={{ fontSize: "24px", marginBottom: "30px", color: "#666" }}>
          A Tekken-like battle game where you fight the Covid Monster!
        </p>

        {isAuthenticated ? (
          <div>
            <h2 style={{ marginBottom: "20px" }}>
              Welcome back, {user?.fullName}!
            </h2>
            <div
              style={{
                display: "flex",
                gap: "20px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Link
                to="/game"
                className="btn btn-primary"
                style={{ fontSize: "18px", padding: "15px 30px" }}
              >
                🎮 Start New Game
              </Link>
              <Link
                to="/dashboard"
                className="btn btn-secondary"
                style={{ fontSize: "18px", padding: "15px 30px" }}
              >
                📊 Dashboard
              </Link>
              <Link
                to="/history"
                className="btn btn-secondary"
                style={{ fontSize: "18px", padding: "15px 30px" }}
              >
                📜 Game History
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <h2 style={{ marginBottom: "20px" }}>
              Ready to fight the Covid Monster?
            </h2>
            <div
              style={{
                display: "flex",
                gap: "20px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Link
                to="/register"
                className="btn btn-primary"
                style={{ fontSize: "18px", padding: "15px 30px" }}
              >
                🚀 Sign Up & Play
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
