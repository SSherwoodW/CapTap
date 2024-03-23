import { useState } from 'react';
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
    <div className="grid bg-gray-200 rounded-sm p-4 mb-4 text-center overflow-x-auto max-w-full">
      <h3 className="text-xl bg-indigo-500 text-white mb-2 p-2 rounded-t-sm">Game Log</h3>
      <div className="border-b-2 border-indigo-600 mb-2"></div>

      {/* Header row */}
      <div className="grid grid-cols-10 bg-gray-300 p-3 ">
        <div className="text-sm font-bold text-gray-700">Date</div>
        <div className="text-sm font-bold text-gray-700">Opponent</div>
        <div className="text-sm font-bold text-gray-700">Minutes</div>
        <div className="text-sm font-bold text-gray-700">Points</div>
        <div className="text-sm font-bold text-gray-700">Rebounds</div>
        <div className="text-sm font-bold text-gray-700">Assists</div>
        <div className='text-sm font-bold text-gray-700'>Turnovers</div>
        <div className="text-sm font-bold text-gray-700">Steals</div>
        <div className="text-sm font-bold text-gray-700">Blocks</div>
        <div className="text-sm font-bold text-gray-700">3pm/att</div>
      </div>

      {/* Game log rows */}
      {boxscores.slice(0, visibleGames).map((game, index) => (
        <div
          id={formatDate(game.gamedate)}
          key={index}
          className={`grid grid-cols-10 p-3 place-items-center ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}
        >
          <div className="row text-sm text-gray-700">{formatDate(game.gamedate)}</div>
          <div className="row text-sm text-gray-700">{game.opposing_team}</div>
          <div className="row text-sm text-gray-700">{game.minutes === '00:00' ? <b>DNP</b> : game.minutes}</div>
          <div className="row text-sm text-gray-700">{game.minutes === '00:00' ? '--' : game.points}</div>
          <div className="row text-sm text-gray-700">{game.minutes === '00:00' ? '--' : game.rebounds}</div>
          <div className="row text-sm text-gray-700">{game.minutes === '00:00' ? '--' : game.assists}</div>
          <div className="row text-sm text-gray-700">{game.minutes === '00:00' ? '--' : game.turnovers}</div>
          <div className="row text-sm text-gray-700">{game.minutes === '00:00' ? '--' : game.steals}</div>
          <div className="row text-sm text-gray-700">{game.minutes === '00:00' ? '--' : game.blocks}</div>
          <div className="row text-sm text-gray-700">{game.minutes === '00:00' ? '--' : `${game.threepointsmade}/${game.threepointsattempted}`}</div>
        </div>
      ))}

      {/* Show more button */}
      {boxscores.length > 5 && (
        <button
          className="mt-2 bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-800 justify-self-center max-w-40"
          onClick={() => setShowMore(!showMore)}
        >
          {showMore ? 'Show Less' : 'Show More'}
        </button>
      )}
    </div>
    
  );
};


export default GameLog;