import { useContext, useEffect, useState } from "react";
import { useLocation, useParams, useNavigate, Link } from "react-router-dom";
import { Menu } from "@headlessui/react";
import { useAuth } from "../auth/authContext";


import PlayerGraph from "./PlayerGraph";
import SaveToJournalModal from "../journal/SaveToJournalModal";
import GameRange from "./helpers/GameRange";
import formatDate from "../hooks/formatDate";
import OverUnderToggle from "./helpers/OverUnderToggle";
// import generatePlayerGraphData, { generateAllGraphData } from "./helpers/GraphGenerator";
import CapTapApi from "../../../api";
import LoadingSpinner from "../common/LoadingSpinner";




function Parlayer() {
    const { code } = useParams();
    // const { currentUser } = useContext(AuthContext);
    const { currentUser } = useAuth();

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

    const navigate = useNavigate();
    const { state } = useLocation();
    const { player1Id, player2Id } = state || {};


    //********************************************************************************* */
    //**********************    HELPERS SECTION    ************************************ */
    //********************************************************************************* */

    const statMap = {
            'Points': 'points',
            'Assists': 'assists',
            'Rebounds': 'rebounds',
            'Blocks': 'blocks',
            'Steals': 'steals',
            'Turnovers': 'turnovers',
            '3PM': 'threepointsmade'
        };

    const rangeMap = {
            'L5': 5,
            'L10': 10,
            'L20': 20,
            'Season': Infinity
        };
    
    //********************************************************************************* */
    //*******************    PLAYERS/TEAMS SECTION    ********************************* */
    //********************************************************************************* */
    
    useEffect(() => {
        if (currentUser) {
            console.log('currentUser useEffect:');
            const fetchData = async () => {
                console.debug('Fetching data...');
                try {
                    const teamsData = await CapTapApi.getTeams();
                        setTeams(teamsData);

                    if (player1Id && player2Id && code) {
                        setPlayerIds([player1Id, player2Id]);
                        console.log("playerIds:", playerIds);
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
        console.log("TeamData in onChange:", teamData);

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
        
        console.debug("PlayerIds handleClick:", playerIds);
    };

    const handleRemovePlayer = (playerId, apiId) => {
        console.log("removing player with id", playerId);
        setPlayerIds((playerIds) => playerIds.filter((id) => id !== playerId));
        
        setSelectedPlayerData((selectedPlayerData) => selectedPlayerData.filter((player) => player.apiid !== apiId));
        setSelectedStats((selectedStats) => selectedStats.filter(([id]) => id !== playerId));
        setValues((values) => values.filter(([id]) => id !== playerId));
        setOverUnders((overUnders) => overUnders.filter(([id]) => id !== playerId));
        console.debug("handleRemovePlayer playerIds:", playerIds, "selectedStats:", selectedStats, "values:", values, "overUnders:", overUnders);
    };

    useEffect(() => {
        const fetchPlayerData = async () => {
            const playerDataArray = await Promise.all(playerIds.map(id => CapTapApi.getPlayer(id)));
            console.log(playerDataArray);
            setSelectedPlayerData(playerDataArray);
        };

        if (playerIds.length > 0) {
            fetchPlayerData();
        };
        console.debug("PlayerData useEffect:", selectedPlayerData);
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

    // Get boxscores for [selectedRange] # games.
    // Get array of [selectedStat] values from those boxscores.
    // Determine bar color based on if each stat in above array is [over/under]
    // ...[values]
    const generatePlayerGraphData = (playerId) => {

        const range = rangeMap[selectedRange];

        const data = selectedStats.find(([id]) => id === playerId);
        const statType = data ? statMap[data[1]] : null;

        const playerData = selectedPlayerData.filter(player => player.id === playerId);
        const graphData = playerData[0].boxscores
            .slice(0, range)
            .reverse()
            .map(obj => ({
                x: formatDate(obj.gamedate),
                y: obj.minutes === '00:00' ? null : obj[statType],
                opponent: obj.opposing_team
            }));
        console.debug("playerData valuesToGraph", graphData);
        
        return graphData;
    };

    const generateAllGraphData = () => {
        const newData = [];

        selectedPlayerData.forEach((player) => {
            const playerId = player.id;
            const statValue = values.find(([id]) => id === playerId);
            const overOrUnder = overUnders.find(([id]) => id === playerId);
            const selectedStat = selectedStats.find(([id]) => id === playerId);
            const range = rangeMap[selectedRange];

            if (selectedRange && selectedStat && statValue && overOrUnder) {
                const playerData = generatePlayerGraphData(playerId);
                newData.push({ playerId, data: playerData, value: Number(statValue[1]), overUnder: overOrUnder[1], selectedStat: selectedStat[1], range: range});
            };
            console.log("genAllGraphData newData:", newData);
        });
        return newData;
    };

    useEffect(() => {
        if (selectedRange && selectedStats && values && overUnders) {
            const newData = generateAllGraphData(rangeMap, selectedRange, selectedPlayerData, values, overUnders, selectedStats);
            setPlayerGraphData(newData);
            console.log("playerGraphData useEffect", playerGraphData);
            console.log("journalEntry in useEffect", journalData);
        }
    }, [selectedRange, selectedStats, values, overUnders]);

    //********************************************************************************* */
    //*******************     JOURNAL SECTION      ************************************ */
    //********************************************************************************* */

    const saveToJournal = async () => {
        const journalEntry = {
            data: {
                playerIds: playerIds,
                statCats: selectedStats,
                values: values,
                overUnders: overUnders,
            },
            range: selectedRange,
            description: description,
            userId: currentUser.id
        };
        if (description) {
            setJournalData(journalEntry); 
        };
    };
    
    const handleDescriptionChange = (value) => {
        setDescription(value);
    }

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
                <div className="flex-grow bg-indigo-500 border-2 border-indigo-300 shadow-lg">
                    <div className="relative m-4 p-4">
                        <div className="flex justify-between items-center sm:grid-rows-3 text-gray-800">
                            <h4 className="Parlayer-header text-5xl font-extralight uppercase p-4 shadow-md bg-indigo-400 rounded-sm border-2 border-indigo-300 mr-4">Parlayer</h4>
                            <div className="shadow-md rounded-sm">
                                <GameRange selectedOption={selectedRange} handleClick={(range) => handleRangeClick(range)} />
                            </div>
                            <div className="">
                                <label htmlFor="team-select" className="text-center mr-2">Choose a team:</label>
                                <select id="team-select" value={team?.code || ''} onChange={handleTeamChange} className="border-indigo-300 bg-gray-500 rounded-md justify-center gap-x-1.5 py-2 px-2 text-m font-normal text-gray-900 text-center shadow-md ring-1 ring-inset ring-gray-300 hover:bg-gray-700 ">
                                
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
            {playerGraphData.length > 0 && (
                <div className="flex justify-center mt-4">
                    {/* <button
                        onClick={saveToJournal}
                        className="flex rounded-sm p-4 bg-gray-500 border-2 border-gray-400 text-gray-900 text-lg shadow-md hover:bg-gray-400 hover:ring-2 hover:ring-gray-300 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        <p className="ml-2">Save To Journal</p>
                    </button> */}
                    <SaveToJournalModal onSave={saveToJournal} onDescriptionChange={ handleDescriptionChange } />
                </div>
            )}
            {team && (
                <div className="mt-2 mx-0">

                    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-4 overflow-x-auto shadow-lg">
                    {/* Render a section for each selected player */}
                        {selectedPlayerData.map((player, index) => (
                        <div key={player.apiid} >
                            <div>
                                <div className="flex bg-gray-400 p-2 text-center rounded-t-sm justify-between items-center overflow-x-auto">
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
                                        <div className="flex flex-col bg-gray-400 rounded-sm mr-12 mt-8 mb-8">
                                            <label htmlFor="stat-line-input">Stat Amount</label>
                                            <input
                                                id="stat-line-input"
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
                        <div className="bg-gray-800 h-64 rounded-b-md flex items-center justify-between relative">
                            <div className="">
                                <PlayerGraph playerGraphData={playerGraphData} player={player} />
                            </div>
                            <button
                                className="mr-4 p-4 bg-gray-500 text-gray-900 uppercase border-2 border-gray-400 shadow-md hover:text-gray-300 hover:bg-red hover:bg-opacity-70 hover:ring-2 hover:ring-gray-300 focus:ring-1 focus:ring-white focus:ring-offset-1"
                                onClick={() => handleRemovePlayer(player.id, player.apiid)}
                            >
                                Remove
                            </button>
                            </div>
                        </div>          
                    ))}
                </div>
                <div className="flex justify-center mt-4">
                    <Menu as="div" className="relative">
                        <Menu.Button className="flex rounded-sm p-4 bg-gray-500 border-2 border-gray-400 text-gray-900 text-lg shadow-md hover:bg-gray-400 hover:ring-2 hover:ring-gray-300 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                            <p className="ml-2"> Add Player</p>
                        </Menu.Button>
                        <Menu.Items className="absolute  mt-2 w-48 bg-gray-800 rounded-md shadow-lg text-gray-100">
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
            </div>
            )}

            
            </div>
    )
}

export default Parlayer;

