import React, { useState, useEffect } from "react";
import Search from "../common/SearchForm";
import CapTapApi from "../../../api";
import TeamCard from "./TeamCard";
import LoadingSpinner from "../common/LoadingSpinner";

/** Show page with list of teams.
 *
 * On mount, loads teams from API.
 * Re-loads filtered teams on submit from search form.
 *
 * TeamsList -> TeamCard -> TeamDetail
 *
 * This is routed to at /teams
 */

function TeamsList() {
    console.debug("TeamsList");

    const [teams, setTeams] = useState(null);

    useEffect(function getAllTeamsOnMount() {
        if (CapTapApi.token) {
          console.debug("TeamsList useEffect getAllTeamssOnMount");
        search();
        }
    }, []);

    /** Triggered by search form submit; reloads teams. */
    async function search(name) {
        let teams = await CapTapApi.getTeams(name);
        setTeams(teams);
    }

    if (!teams) return <LoadingSpinner />;
    

    return (
        <div className="TeamsList col-md-8 offset-md-2">
            <Search searchFor={search} />
            {teams.length
                ? (
                    <div className="TeamsList-list">
                {teams.map(t => (
                    <TeamCard
                        name={t.name}
                        code={t.code}
                        key={t.id}
                    />
                ))}
            </div>
                ) : (
                    <p className="lead">Sorry, no results were found!</p>
                )}
        </div>
    );
    }

    export default TeamsList;