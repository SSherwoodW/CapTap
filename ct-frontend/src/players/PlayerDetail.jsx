import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import CapTapApi from "../../../api";

import LoadingSpinner from "../common/LoadingSpinner";
import getAverages from "../helpers/getAverages";
import PlayerSidebar from "./PlayerSidebar";
import GameLog from "./Gamelog";

/** Player Detail Page.
 * 
 * Renders information about a player, such as statistical averages and the option to toggle 
 * the data that is returned, i.e. "points per game last 5 games..."
 * 
 * Routed at /players/:id
 * 
 * Routes -> PlayersList -> PlayerDetail --OR-- Routes -> TeamDetail -> PlayerDetail
 */

/** Map for displaying averages table column names */
const avgDisplayNames = {
        averageMinutes: 'Minutes',
        averagePoints: 'Points',
        averageAssists: 'Assists',
        averageRebounds: 'Rebounds',
        averageTurnovers: 'Turnovers',
        averageSteals: 'Steals',
        averageBlocks: 'Blocks',
        averageThreePointsMade: '3PM',
    };

function PlayerDetail() {
    const { id } = useParams();
    console.debug("PlayerDetail", "id=", id);

    const [player, setPlayer] = useState(null);
    const [teamCode, setTeamCode] = useState(null);
    const [teamLogo, setTeamLogo] = useState(null);

    useEffect(() => {
    async function getPlayer() {
        const fetchedPlayer = await CapTapApi.getPlayer(id);
            setPlayer(fetchedPlayer);
            
        const fetchedTeam = await CapTapApi.findTeam(fetchedPlayer.name);
            setTeamCode(fetchedTeam.code);

        const logoUrl = `../nba-logos/${fetchedPlayer.name}.png`;
            setTeamLogo(logoUrl);
        console.log(logoUrl);
    }

    getPlayer();
  }, [id]);

    if (!player) return <LoadingSpinner />;
    console.log("PlayerDetail code:", teamCode);
    console.log('player:', player);

    const averages = getAverages(player.boxscores);
    

    return (
    <div className="flex flex-col md:flex-row">
      <div className="flex-grow md:ml-2">
        <div className="PlayerDetail mt-4 mx-2 p-4 rounded-sm border-4 border-gray-500">
           <div className="flex justify-between items-center mb-4">
                <h4 className="PlayerDetail playerName text-5xl font-thin uppercase text-gray-100">{player.fullname}</h4>
                <div className="flex items-center p-2 px-4 bg-gray-500 rounded-sm border-gray-300 border-2">
                    <div className="PlayerDetail teamLogo">
                        <a
                            href={`/teams/${teamCode}`}
                            className="relative flex">
                            <span className="absolute -inset-1.5" />
                            <span className="sr-only">{player.name} Logo</span>
                            <img
                                className="max-h-12 w-auto"
                                src={teamLogo}
                                alt={`${player.name} Logo`}
                            />
                        </a>
                    </div>
                    <h4 className="PlayerDetail teamName text-3xl font-thin uppercase text-gray-100"><a href={`/teams/${teamCode}`}>{player.name}</a></h4>
                </div>
           </div>
          {averages && (
          <div>  
            <div className="bg-gray-200 rounded-sm p-4 mb-4 ">
              <h3 className="text-xl font-thin bg-indigo-500 text-white mb-2 p-2 rounded-t-sm">Season Averages</h3>
              <div className="border-b-2 border-indigo-600 mb-2"></div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(averages).map(([key, value]) => (
                      <div key={key} className="bg-gray-300 p-3 rounded-md">
                          <p className="text-sm font-bold text-gray-700">{avgDisplayNames[key]}</p>
                          <p className="text-lg text-indigo-600">{value}</p>
                      </div>
                    ))} 
                  </div>               
            </div>
            <div>
              <GameLog boxscores={player.boxscores}/>
            </div>
          </div>
              )}
        </div>          
      </div>
      <PlayerSidebar players={player.teammates} teamCode={teamCode} playerId={id} />
    </div>
  );
}

export default PlayerDetail;