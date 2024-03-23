import { useEffect, useState, useContext } from "react";
import { useLocation, useParams, useNavigate, Link } from "react-router-dom";
import { Menu } from "@headlessui/react";
import { AuthContext } from "../auth/authContext";

import PlayerGraph from "./PlayerGraph";
import SaveToJournalModal from "../journal/SaveToJournalModal";
import GameRange from "./helpers/GameRange";
import OverUnderToggle from "./helpers/OverUnderToggle";
import generateAllGraphData from "./helpers/graphUtils";
import calculateStats from "./helpers/Correlator";

import CapTapApi from "../../../api";

function Parlayer() {
    const { code } = useParams();
    const { currentUser } = useContext(AuthContext);

    //********************************************************************************* */
    //***********************     STATE SECTION      ********************************** */
    //********************************************************************************* */

    // Selected players to parlay.
    const [playerIds, setPlayerIds] = useState([]);
    // Player Objects from DB for selected players.
    const [selectedPlayerData, setSelectedPlayerData] = useState([]);
    // Team to build a parlay. 
    const [team, setTeam] = useState(null);
    // All teams.
    const [teams, setTeams] = useState([]);
    // Selected game range option
    const [selectedRange, setSelectedRange] = useState(null);
    // Selected stat category option
    const [selectedStats, setSelectedStats] = useState([]);
    // Selected stat value option
    const [values, setValues] = useState([]);
    // Over/under for stat value
    const [overUnders, setOverUnders] = useState([]);
    // Accumulated data for building player graph visualizations
    const [playerGraphData, setPlayerGraphData] = useState([]);
    // Accumulated data to save a Parlayer search to database/Journal page
    const [journalData, setJournalData] = useState(null);
    // journal entry description string
    const [description, setDescription] = useState("");
    // correlation & player stat analysis
    const [correlatorData, setCorrelatorData] = useState([]);

    const navigate = useNavigate();
    const { state } = useLocation();
    const { player1Id, player2Id } = state || {};

    //********************************************************************************* */
    //*******************    PLAYERS/TEAMS SECTION    ********************************* */
    //********************************************************************************* */
    
    // if user came from a player page, set player data and team data from params/useLocation. 
    useEffect(() => {
        if (CapTapApi.token) {
            const fetchData = async () => {
                // console.debug('Fetching data...');
                try {
                    const teamsData = await CapTapApi.getTeams();
                        setTeams(teamsData);

                    if (player1Id && player2Id && code) {
                        setPlayerIds([player1Id, player2Id]);
                        const teamData = await CapTapApi.getTeam(code);
                        setTeam(teamData);
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                    return error;
                };
            };

            fetchData(); 
        };
    }, [player1Id, player2Id, code]);

    const handleTeamChange = async (evt) => {
        const selectedTeamCode = evt.target.value;
        const teamData = await CapTapApi.getTeam(selectedTeamCode);
        setTeam(teamData);
        navigate(`/parlayer/${selectedTeamCode}`);
    };

    const handlePlayerClick = async (playerId) => {
        setPlayerIds((prevIds) => {
            if (!prevIds.includes(playerId)) {
                return [...prevIds, playerId]
            } else {
                return prevIds;
            }
        });
    };

    const handleRemovePlayer = (playerId, apiId) => {
        setPlayerIds((playerIds) => playerIds.filter((id) => id !== playerId));
        setSelectedPlayerData((selectedPlayerData) => selectedPlayerData.filter((player) => player.apiid !== apiId));
        setSelectedStats((selectedStats) => selectedStats.filter(([id]) => id !== playerId));
        setValues((values) => values.filter(([id]) => id !== playerId));
        setOverUnders((overUnders) => overUnders.filter(([id]) => id !== playerId));
    };

    useEffect(() => {
        const fetchPlayerData = async () => {
            const playerDataArray = await Promise.all(playerIds.map(id => CapTapApi.getPlayer(id)));
            setSelectedPlayerData(playerDataArray);
        };

        if (playerIds.length > 0) {
            fetchPlayerData();
        };
    }, [playerIds]);

    //********************************************************************************* */
    //**********************     STATS & VALUES SECTION      ************************** */
    //********************************************************************************* */
    
    const handleRangeClick = (range) => {
        setSelectedRange(range);
        console.debug("selectedRange:", selectedRange);
    };

    const handleStatCategoryClick = (playerId, category) => {
        console.log("handleStatCategoryClick clicked", playerId, category)
        const playerIndex = selectedStats.findIndex(([id]) => id === playerId);

        if (playerIndex !== -1) {
            const updatedStats = [...selectedStats];
            updatedStats[playerIndex] = [playerId, category];
            setSelectedStats(updatedStats);
        } else {
            setSelectedStats([...selectedStats, [playerId, category]]);
        }
        console.debug("selectedStatCategory click:", selectedStats);
    };

    const handleValueChange = (playerId, evt) => {
        const newValue = evt.target.value;
        const playerIndex = values.findIndex(([id]) => id === playerId);

        if (playerIndex !== -1) {
            const updatedValue = [...values];
            updatedValue[playerIndex] = [playerId, newValue];
            setValues(updatedValue);
        } else {
            setValues([...values, [playerId, newValue]]);
        };
        console.debug("setValues click:", values);
    };

    const handleOverUnderChange = (playerId, value) => {
        
        const playerIndex = overUnders.findIndex(([id]) => id === playerId);

        if (playerIndex !== -1) {
            const updatedOverUnder = [...overUnders];
            updatedOverUnder[playerIndex] = [playerId, value];
            setOverUnders(updatedOverUnder);
        } else {
            setOverUnders([...overUnders, [playerId, value]]);
        };
        console.debug("setOverUnders change:", overUnders);
    }

    //********************************************************************************* */
    //********************    GRAPH GENERATION SECTION    ***************************** */
    //********************************************************************************* */

    useEffect(() => {
        if (selectedRange && selectedStats && values && overUnders) {
            const newData = generateAllGraphData(selectedPlayerData, values, overUnders, selectedStats, selectedRange);
            const correlatedData = calculateStats(newData);
            setPlayerGraphData(newData);
            setCorrelatorData(correlatedData);
            console.log("journalEntry in useEffect", journalData);
            console.log("correlatorData", correlatorData, "length", correlatorData.length)
        }
    }, [selectedRange, selectedStats, values, overUnders]);

    //********************************************************************************* */
    //*******************     JOURNAL SECTION      ************************************ */
    //********************************************************************************* */

    // const saveToJournal = async () => {
    //     const journalEntry = {
    //         data: {
    //             playerIds: playerIds,
    //             statCats: selectedStats,
    //             values: values,
    //             overUnders: overUnders,
    //         },
    //         range: selectedRange,
    //         description: description,
    //         userId: currentUser.id
    //     };
    //     if (description) {
    //         setJournalData(journalEntry);
    //     };
    // };
    
    // const handleDescriptionChange = (value) => {
    //     setDescription(value);
    // }
    
    const saveJournalEntry = async (data) => {
        try {
            await CapTapApi.saveJournalEntry(currentUser.username, data);
            setJournalData(data);
        } catch (error) {
            console.error('Error saving journal entry:', error);
        }
    };

    useEffect(() => {
        if (journalData) {
            const storeJournalData = async () => {
            const journalRes = await CapTapApi.saveJournalEntry(currentUser.username, journalData);
            console.log('storeJournalData useEffect:', journalRes);
            };
            storeJournalData();
        }
    }, [journalData]);
    
    return (
        <div>
            <div className="flex flex-col md:flex-row">
                <div className="flex-grow bg-gray-300 border-8 border-gray-800 shadow-lg">
                    <div className="relative mx-6 my-2">
                        <div className="flex justify-between items-center text-gray-800">
                            <h4 className="Parlayer-header text-5xl font-extralight uppercase p-4 shadow-md bg-indigo-400 rounded-sm border-2 border-indigo-300">Parlayer</h4>
                            <div className="shadow-md rounded-sm">
                                <GameRange selectedOption={selectedRange} handleClick={(range) => handleRangeClick(range)} />
                            </div>
                            <div className="flex flex-col items-center p-2 border-2 border-gray-200 bg-gray-400">
                                <label htmlFor="team-select" className="text-center uppercase bg-indigo-400 px-6 mb-2 shadow-md rounded-sm ">Choose a team</label>
                                <select id="team-select" value={team?.code || ''} onChange={handleTeamChange} className="border-indigo-300 bg-gray-400 rounded-md justify-center gap-x-1.5 py-2 px-2 text-m font-normal text-gray-900 text-center shadow-md ring-1 ring-inset ring-gray-300 hover:bg-gray-700 ">
                                
                                    <option value="">Select Team</option>
                                {teams.map((team) => (
                                    <option key={team.id} value={team.code}>       
                                    {team.name}
                                    </option>
                                ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {team && (
                <div className="">
                    <div id="action-buttons" className="grid grid-cols-7 items-center bg-indigo-200 border-indigo-700 border-2">
                        <div className="col-start-1 m-2">
                            <Menu as="div" className="relative">
                                <Menu.Button className="flex rounded-sm p-4 bg-gray-500 border-2 border-gray-400 text-gray-900 text-lg shadow-md hover:bg-gray-400 hover:ring-2 hover:ring-gray-300 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                    <p className="ml-2"> Add Player</p>
                                </Menu.Button>
                                <Menu.Items className="absolute mt-2 w-48 bg-gray-800 rounded-md shadow-lg text-gray-100 z-50">
                                    {team.players
                                        .filter(player => !playerIds.includes(player.id))
                                        .map((player) => (
                                            <Menu.Item key={player.id}>
                                                {({ active }) => (
                                                    <button
                                                        className={`block w-full px-4 py-2 text-center ${
                                                            active ? 'bg-gray-700' : 'hover:bg-gray-700'
                                                        }`}
                                                        onClick={() => handlePlayerClick(player.id)}
                                                    >
                                                        {player.full_name}
                                                    </button>
                                                )}
                                            </Menu.Item>
                                        ))}
                                </Menu.Items>
                            </Menu>
                        </div>
                        <div className="col-start-2 col-span-2">
                            {playerGraphData.length > 0 && (
                                <div className="">
                                    <SaveToJournalModal
                                        entry={null}
                                        saveJournalEntry={saveJournalEntry}
                                        playerIds={playerIds}
                                        selectedStats={selectedStats}
                                        values={values}
                                        overUnders={overUnders}
                                        selectedRange={selectedRange}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="col-start-7">
                        {correlatorData !== 'oopsy doopsy!' && (
                                <div className="grid-cols rounded-sm mx-6 my-2 bg-gray-200 border-2 border-gray-400 text-gray-900 text-lg shadow-md">
                                    <div className="">
                                        <div className="grid grid-cols-1 text-center">
                                            <div>Correlation Rate</div>
                                            {playerIds.length < 2 ?
                                                <div className="text-indigo-400 font-thin text-sm italic">Add more players to correlate</div> :
                                                <div className="text-indigo-400 font-bold text-xl">{correlatorData.slice(-1)}%</div>
                                            }
                                        </div>
                                        {/* {correlatorData.length <= 2 ? : 'b'} */}
                                    </div>
                                </div>
                        )}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-0 overflow-x-auto shadow-xl">
                    {/* Render a section for each selected player */}
                        {selectedPlayerData.map((player, index) => (
                        <div key={player.apiid} data-testid="player-section">
                            <div>
                                <div className="flex bg-gray-400 p-2 text-center rounded-t-sm justify-between items-center overflow-x-auto border-t-2 border-indigo-700">
                                    <div className="text-gray-900 uppercase text-2xl underline decoration-1 underline-offset-4 flex items-center ml-12">
                                        <Link to={`/players/${player.id}`}><span className="mr-10">{player.fullname}</span></Link>
                                    </div>
                                    <div className="flex justify-between items-center divide-x divide-gray-900">
                                    {['Points', 'Rebounds', 'Assists', 'Blocks', 'Steals', 'Turnovers', '3PM'].map((category) => {
                                        const isSelected = selectedStats.some(([id, selectedCategory]) => id === player.id && selectedCategory === category);
                                        return (
                                            <button
                                                key={category}
                                                className={`px-4 py-2 rounded-sm text-gray-900 hover:bg-gray-300 focus:outline-none 
                                            ${isSelected ? 'bg-gray-300 text-gray-900' : 'bg-gray-500'
                                                    }`}
                                                onClick={() => handleStatCategoryClick(player.id, category)}
                                            >
                                                {category}
                                            </button>
                                        );
                                    })}
                                    </div>
                                    <div className="flex">
                                        <div className="flex bg-gray-400 rounded-sm">
                                            <OverUnderToggle
                                                selectedValue={overUnders.find(([id]) => id === player.id)?.[1] || ''}
                                                onChange={(value) => handleOverUnderChange(player.id, value)}
                                            />
                                        </div>
                                        <div className="flex flex-col bg-gray-400 rounded-sm mr-12 mt-4">
                                            <label htmlFor={`stat-line-input ${player.id}`}>Stat Amount</label>
                                            <input
                                                id={`stat-line-input ${player.id}`}
                                                type="number"
                                                placeholder="Set Value"    
                                                value={values.find(([id]) => id === player.id)?.[1] || ''}
                                                onChange={(evt) => handleValueChange(player.id, evt)}
                                                className="value px-2 w-28 rounded-sm text-center text-gray-100 bg-gray-600 focus:outline-none"
                                            /> 
                                        </div>
                                    </div>
                                </div>      
                            </div>
                            <div 
                                className={`bg-gray-200 flex items-center justify-between relative border-t-0 border-indigo-700 rounded-b-sm
                                ${correlatorData === 'oopsy doopsy!' ? 'h-12' : 'h-64'}`}
                            >
                                <div className="ml-1">
                                    <PlayerGraph playerGraphData={playerGraphData} player={player} hitStats={correlatorData} />
                                </div>
                                <div>
                                    <div>
                                        
                                    </div>        
                                    <button
                                        className={`mx-2 bg-gray-500 text-gray-900 uppercase border-2 border-gray-400 shadow-md hover:text-gray-300 hover:bg-red hover:bg-opacity-70 hover:ring-2 hover:ring-gray-300 focus:ring-1 focus:ring-white focus:ring-offset-1
                                        ${correlatorData === 'oopsy doopsy!' ? 'p-1' : 'p-4'}`}
                                        // className="mx-2 p-4 bg-gray-500 text-gray-900 uppercase border-2 border-gray-400 shadow-md hover:text-gray-300 hover:bg-red hover:bg-opacity-70 hover:ring-2 hover:ring-gray-300 focus:ring-1 focus:ring-white focus:ring-offset-1"
                                        onClick={() => handleRemovePlayer(player.id, player.apiid)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>          
                    ))}
                </div>
            </div>
            )}
            </div>
    )
}

export default Parlayer;

