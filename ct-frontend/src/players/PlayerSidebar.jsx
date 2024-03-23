import React from "react";
import { Link } from "react-router-dom";

function PlayerSidebar({ players, teamCode, playerId }) {

  return (
    <div className="Sidebar bg-slate-600 border-2 border-gray-500 rounded-sm my-4 mx-4 p-6 w-64">
          <h3 className="text-xl text-center py-2 mb-4 uppercase text-gray-300 bg-indigo-500 border-2 border-gray-500 rounded-sm">Parlayer</h3>
          <h6 className="mb-2 m-4 text-sm font-thin text-gray-200">Select a teammate</h6>
      <ul>
        {players.map((player) => (
          <Link to={`/parlayer/${teamCode}`} state={{player1Id: playerId, player2Id: player.id}} key={player.full_name}>
            <li className="py-1 px-0 text-gray-200 hover:bg-gray-800 rounded transition duration-300" >{player.full_name}</li>
          </Link>
        ))}
      </ul>
    </div>
  );
}

export default PlayerSidebar;