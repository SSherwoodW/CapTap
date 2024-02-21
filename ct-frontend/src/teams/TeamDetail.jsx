import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CapTapApi from "../../../api";
import PlayerCard from "../players/PlayerCard";
import LoadingSpinner from "../common/LoadingSpinner";

/** Team Detail page.
 *
 * Renders information about team, along with the roster for that team.
 *
 * Routed at /teams/:code
 *
 * Routes -> TeamDetail -> PlayerCardList
 */

function TeamDetail() {
  const { code } = useParams();
  console.debug("TeamDetail", "code=", code);

  const [team, setTeam] = useState(null);

  useEffect(function getTeamAndRosterForUser() {
    async function getTeam() {
      setTeam(await CapTapApi.getTeam(code));
    }

    getTeam();
  }, [code]);
    console.log(team)

  if (!team) return <LoadingSpinner />;

  return (
      <div className="TeamDetail col-md-8 offset-md-2">
          <h4>{team.name}</h4>
          {team.players
              ? (
                  <div className="TeamsList-list">
              {team.players.map(p => (
                  <PlayerCard
                      name={p.full_name}
                      id={p.id}
                      key={p.full_name}
                  />
              ))}
          </div>
              ): (
                      <p className="lead">Sorry, no results were found!</p>
          )}
      </div>
  );
}

export default TeamDetail;
