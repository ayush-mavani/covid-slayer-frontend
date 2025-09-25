import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="nav-content">
          <Link to="/" className="nav-logo">
            🦠 Covid Slayer
          </Link>

          <div className="nav-links">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="nav-link">
                  Dashboard
                </Link>
                <Link to="/history" className="nav-link">
                  History
                </Link>
                <Link to="/leaderboard" className="nav-link">
                  Leaderboard
                </Link>

                <div className="user-info">
                  <img
                    src={user?.avatar}
                    alt={user?.fullName}
                    className="user-avatar"
                  />

                  <button
                    onClick={handleLogout}
                    className="btn btn-secondary"
                    style={{ marginLeft: "10px", padding: "8px 16px" }}
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/leaderboard" className="nav-link">
                  Leaderboard
                </Link>
                <Link to="/login" className="nav-link">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
