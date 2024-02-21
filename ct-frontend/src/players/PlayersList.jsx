import React, { useState, useEffect } from "react";
import Search from "../common/SearchForm";
import CapTapApi from "../../../api";
import PlayerCard from "../players/PlayerCard";
import LoadingSpinner from "../common/LoadingSpinner";

/** Show page with list of players.
 *
 * On mount, loads players from API.
 * Re-loads filtered players on submit from search form.
 *
 * PlayersList -> PlayerCard -> PlayerDetail
 *
 * This is routed to at /players
 */

function PlayersList() {
  console.debug("PlayersList");

  const [players, setPlayers] = useState(null);

  useEffect(function getAllPlayersOnMount() {
    console.debug("PlayersList useEffect getAllPlayersOnMount");
      search();
  }, []);

  /** Triggered by search form submit; reloads players. */
  async function search(name) {
    let players = await CapTapApi.getPlayers(name);
      setPlayers(players);
  }
    

  if (!players) return <LoadingSpinner />;
  

  return (
      <div className="PlayersList mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Search searchFor={search} />
          {players.length
              ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {players.map(p => (
                  <PlayerCard
                      name={p.name}
                      id={p.id}
                      key={p.name}
                  />
              ))}
          </div>
              ) : (
                  <p className="lead">Sorry, no results were found!</p>
              )}
      </div>
  );
}

export default PlayersList;