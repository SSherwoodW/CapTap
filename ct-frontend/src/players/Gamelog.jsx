import { useState } from 'react';
import { Link } from 'react-router-dom';
import formatDate from '../hooks/formatDate';

/** Game Log Component
 * 
 * Shows a player's game log with pertinent statistics. 
 * Expands from 5 most recent games to all games at user request.
 * 
 * PlayerDetail => GameLog
 */

function GameLog ({ boxscores }){
    const [showMore, setShowMore] = useState(false);
    const visibleGames = showMore ? boxscores.length : 5;

  return (
    <div className="bg-gray-200 rounded-sm p-4 mb-4 text-center overflow-x-auto max-w-full">
      <h3 className="text-xl bg-indigo-800 text-white mb-2 p-2 rounded-t-sm">Game Log</h3>
      <div className="border-b-2 border-indigo-600 mb-2"></div>

      {/* Header row */}
      <div className="header-row grid grid-cols-10 bg-gray-300 p-3">
        <p className="text-sm font-bold text-gray-700">Date</p>
        <p className="text-sm font-bold text-gray-700">Opponent</p>
        <p className="text-sm font-bold text-gray-700">Minutes</p>
        <p className="text-sm font-bold text-gray-700">Points</p>
        <p className="text-sm font-bold text-gray-700">Rebounds</p>
        <p className="text-sm font-bold text-gray-700">Assists</p>
        <p className='text-sm font-bold text-gray-700'>Turnovers</p>
        <p className="text-sm font-bold text-gray-700">Steals</p>
        <p className="text-sm font-bold text-gray-700">Blocks</p>
        <p className="text-sm font-bold text-gray-700">3pm/att</p>
      </div>

      {/* Game log rows */}
      {boxscores.slice(0, visibleGames).map((game, index) => (
        <div
          key={index}
          className={`grid grid-cols-10 p-3 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}
        >
          <p className="text-sm text-gray-700">{formatDate(game.gamedate)}</p>
          <p className="text-sm text-gray-700">{game.opposing_team}</p>
          <p className="text-sm text-gray-700">{game.minutes === '00:00' ? <b>DNP</b> : game.minutes}</p>
          <p className="text-sm text-gray-700">{game.minutes === '00:00' ? '--' : game.points}</p>
          <p className="text-sm text-gray-700">{game.minutes === '00:00' ? '--' : game.rebounds}</p>
          <p className="text-sm text-gray-700">{game.minutes === '00:00' ? '--' : game.assists}</p>
          <p className="text-sm text-gray-700">{game.minutes === '00:00' ? '--' : game.turnovers}</p>
          <p className="text-sm text-gray-700">{game.minutes === '00:00' ? '--' : game.steals}</p>
          <p className="text-sm text-gray-700">{game.minutes === '00:00' ? '--' : game.blocks}</p>
          <p className="text-sm text-gray-700">{game.minutes === '00:00' ? '--' : `${game.threepointsmade}/${game.threepointsattempted}`}</p>
        </div>
      ))}

      {/* Show more button */}
      {boxscores.length > 5 && (
        <button
          className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded-full"
          onClick={() => setShowMore(!showMore)}
        >
          {showMore ? 'Show Less' : 'Show More'}
        </button>
      )}
    </div>
    
  );
};


export default GameLog;