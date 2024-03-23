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

    if (!team) return <LoadingSpinner />;

    return (
        <div className="grid flex-col md:flex-row">
            <div className="flex-grow md:ml-2 place-items-center">
                <div className="mt-4 mx-2 p-4">
                    <div className="flex items-center mb-4">
                        <div>
                            <span className="absolute" />
                            <span className="sr-only">{team.name} Logo</span>
                            <img
                                className="max-h-36 w-auto"
                                src={`../nba-logos/${team.name}.png`}
                                alt=""
                            />
                        </div>
                        <h4 className="text-5xl font-thin uppercase underline decoration-1 underline-offset-8 text-gray-100">{team.name}</h4>
                    </div>
                    <div className="ml-5 border-gray-200 border-2 text-gray-100 max-w-52">
                        {team.players ? (
                        <div className="grid">
                            <h4 className="place-self-center mt-2 text-lg font-bold underline decoration-1 underline-offset-8">{team.name} Roster</h4>
                            <div className="py-2 m-2">
                                {team.players.map(p => (
                                    <PlayerCard
                                        name={p.full_name}
                                        id={p.id}
                                        key={p.full_name}
                                    />
                                ))}
                            </div>
                        </div>
                            ) : (
                        <p className="lead">Sorry, no results were found!</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TeamDetail;
