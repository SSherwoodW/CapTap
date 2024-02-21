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
      <Link to={`/players/${id}`} className="bg-gray-800 shadow-md hover:shadow-lg rounded-md overflow-hidden transition duration-300 transform hover:-translate-y-1 hover:scale-105" >
      <div className="card-body">
          <h6 className="card-title text-white pl-8">
            {name}
          </h6>
        </div>
      </Link>
  );
}

export default PlayerCard;