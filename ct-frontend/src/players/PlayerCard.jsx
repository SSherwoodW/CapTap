import React from "react";
import { Link } from "react-router-dom";



/** Show limited information about a Player
 *
 * Is rendered by PlayersList to show a "card" for each player.
 *
 * PlayersList -> PlayerCard
 */

function PlayerCard({ name, id }) {
  // console.debug("PlayerCard", name);

  return (
      <Link to={`/players/${id}`} >
      <div className="card-body">
          <h6 className="align-items text-center p-1 text-gray-200 hover:bg-gray-800 rounded transition duration-300">
            {name}
          </h6>
        </div>
      </Link>
  );
}

export default PlayerCard;