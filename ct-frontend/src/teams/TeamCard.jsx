import React from "react";
import { Link } from "react-router-dom";



/** Show limited information about a team
 *
 * Is rendered by TeamsList to show a "card" for each team.
 *
 * TeamsList -> TeamCard
 */

function TeamCard({ name, code }) {
  // console.debug("TeamCard", name);

  return (
      <Link className="CompanyCard card" to={`/teams/${code}`}>
        <div className="card-body">
          <h6 className="card-title">
            {code}
          </h6>
          <p>{name}</p>
        </div>
      </Link>
  );
}

export default TeamCard;