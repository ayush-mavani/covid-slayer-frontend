import React from 'react';

const HealthBar = ({ health, name, isPlayer = true }) => {
  const healthPercentage = Math.max(0, Math.min(100, health));
  const healthColor = healthPercentage > 60 ? 'player' : healthPercentage > 30 ? 'monster' : 'monster';

  return (
    <div className="combatant">
      <div className="combatant-name">{name}</div>
      <div className="health-bar">
        <div 
          className={`health-fill ${healthColor}`}
          style={{ width: `${healthPercentage}%` }}
        ></div>
        <div className="health-text">
          {healthPercentage}%
        </div>
      </div>
    </div>
  );
};

export default HealthBar;
