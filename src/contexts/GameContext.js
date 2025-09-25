import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { gamesAPI } from '../utils/api';
import toast from 'react-hot-toast';

const GameContext = createContext();

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export const GameProvider = ({ children }) => {
  const [currentGame, setCurrentGame] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [gameStatus, setGameStatus] = useState('idle'); // idle, active, completed
  const [isActionInProgress, setIsActionInProgress] = useState(false);
  const timerRef = useRef(null);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  const startTimer = (initialTime) => {
    // Clear any existing timer first
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    setTimeRemaining(initialTime);
    setGameStatus('active');
    
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          setGameStatus('completed');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const createGame = async (gameTime = 60) => {
    try {
      setIsActionInProgress(true);
      const response = await gamesAPI.createGame({ gameTime });
      
      if (response.data.success) {
        const game = response.data.game;
        setCurrentGame(game);
        startTimer(game.gameTime);
        toast.success('Game started! Good luck!');
        return { success: true, game };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create game';
      toast.error(message);
      return { success: false, message };
    } finally {
      setIsActionInProgress(false);
    }
  };

  const performAction = async (action) => {
    if (!currentGame || isActionInProgress || gameStatus !== 'active') {
      return { success: false, message: 'Cannot perform action at this time' };
    }

    try {
      setIsActionInProgress(true);
      const response = await gamesAPI.performAction(currentGame.id, {
        action,
        timeRemaining
      });

      if (response.data.success) {
        const updatedGame = response.data.game;
        setCurrentGame(updatedGame);
        
        // Update game status if game ended
        if (updatedGame.status === 'completed' || updatedGame.status === 'surrendered') {
          setGameStatus('completed');
          stopTimer();
          
          if (updatedGame.winner === 'player') {
            toast.success('🎉 You won! Congratulations!');
          } else if (updatedGame.winner === 'monster') {
            toast.error('💀 Covid Monster won! Better luck next time!');
          } else {
            toast('⏰ Time\'s up! It\'s a draw!');
          }
        }

        return { success: true, game: updatedGame };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Action failed';
      toast.error(message);
      return { success: false, message };
    } finally {
      setIsActionInProgress(false);
    }
  };

  const resetGame = () => {
    stopTimer();
    setCurrentGame(null);
    setTimeRemaining(60);
    setGameStatus('idle');
    setIsActionInProgress(false);
  };

  const getGameStats = async () => {
    try {
      const response = await gamesAPI.getStats();
      if (response.data.success) {
        return response.data.stats;
      }
    } catch (error) {
      console.error('Failed to get game stats:', error);
    }
    return null;
  };

  const getGameHistory = async (page = 1, limit = 10) => {
    try {
      const response = await gamesAPI.getGames(page, limit);
      if (response.data.success) {
        return {
          games: response.data.games,
          pagination: response.data.pagination
        };
      }
    } catch (error) {
      console.error('Failed to get game history:', error);
    }
    return { games: [], pagination: {} };
  };

  const value = {
    currentGame,
    timeRemaining,
    gameStatus,
    isActionInProgress,
    createGame,
    performAction,
    resetGame,
    getGameStats,
    getGameHistory,
    startTimer,
    stopTimer
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};
