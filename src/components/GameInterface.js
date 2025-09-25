import React from 'react';
import { useGame } from '../contexts/GameContext';
import { useAuth } from '../contexts/AuthContext';
import HealthBar from './HealthBar';
import CommentaryBox from './CommentaryBox';

const GameInterface = () => {
  const { 
    currentGame, 
    timeRemaining, 
    gameStatus, 
    isActionInProgress, 
    performAction 
  } = useGame();
  const { user } = useAuth();

  const handleAction = async (action) => {
    await performAction(action);
  };

  const getTimerClass = () => {
    if (timeRemaining <= 10) return 'timer-critical';
    if (timeRemaining <= 30) return 'timer-warning';
    return 'timer-text';
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentGame) {
    return (
      <div className="card">
        <h2>No Active Game</h2>
        <p>Start a new game to begin playing!</p>
      </div>
    );
  }

  return (
    <div className="game-container">
      <div className="game-main">
        {/* Timer */}
        <div className="timer-display">
          <div className={getTimerClass()}>
            Time: {formatTime(timeRemaining)}
          </div>
        </div>

        {/* Combatants */}
        <div className="combatants">
          <HealthBar 
            health={currentGame.playerHealth} 
            name={currentGame.playerName}
            isPlayer={true}
          />
          <div className="vs-text">VS</div>
          <HealthBar 
            health={currentGame.monsterHealth} 
            name="Covid Monster"
            isPlayer={false}
          />
        </div>

        {/* Action Buttons */}
        {gameStatus === 'active' && (
          <div className="action-buttons">
            <button 
              className="action-btn attack"
              onClick={() => handleAction('attack')}
              disabled={isActionInProgress}
            >
              Attack
            </button>
            <button 
              className="action-btn power-attack"
              onClick={() => handleAction('Blast')}
              disabled={isActionInProgress}
            >
              Blast
            </button>
            <button 
              className="action-btn heal"
              onClick={() => handleAction('heal')}
              disabled={isActionInProgress}
            >
              Heal
            </button>
            <button 
              className="action-btn surrender"
              onClick={() => handleAction('Giveup')}
              disabled={isActionInProgress}
            >
              Give Up
            </button>
          </div>
        )}

        {/* Game Status */}
        {gameStatus === 'completed' && (
          <div className="card">
            <h2>Game Over!</h2>
            <p>
              {currentGame.winner === 'player' && '🎉 Congratulations! You defeated the Covid Monster!'}
              {currentGame.winner === 'monster' && '💀 The Covid Monster was too strong! Better luck next time!'}
              {currentGame.winner === 'timeout' && '⏰ Time\'s up! It\'s a draw!'}
            </p>
            <div style={{ marginTop: '20px' }}>
              <p><strong>Final Health:</strong></p>
              <p>Player: {currentGame.playerHealth}%</p>
              <p>Covid Monster: {currentGame.monsterHealth}%</p>
            </div>
          </div>
        )}
      </div>

      {/* Commentary Sidebar */}
      <div className="game-sidebar">
        <CommentaryBox logs={currentGame.gameLogs || []} />
      </div>
    </div>
  );
};

export default GameInterface;
