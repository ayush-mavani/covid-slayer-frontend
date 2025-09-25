import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { GameProvider } from "./contexts/GameContext";
import ErrorBoundary from "./components/ErrorBoundary";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Game from "./pages/Game";
import GameHistory from "./pages/GameHistory";
import Leaderboard from "./pages/Leaderboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <GameProvider>
          <div className="App">
            <ErrorBoundary>
              <Navbar />
            </ErrorBoundary>
            <div className="container">
              <ErrorBoundary>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/game"
                    element={
                      <ProtectedRoute>
                        <Game />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/history"
                    element={
                      <ProtectedRoute>
                        <GameHistory />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/leaderboard" element={<Leaderboard />} />
                </Routes>
              </ErrorBoundary>
            </div>
          </div>
        </GameProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
