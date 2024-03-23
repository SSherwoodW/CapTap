import formatDate from '../../hooks/formatDate';

export function generatePlayerGraphData(playerId, selectedStats, selectedPlayerData, range) {
    const statMap = {
            'Points': 'points',
            'Assists': 'assists',
            'Rebounds': 'rebounds',
            'Blocks': 'blocks',
            'Steals': 'steals',
            'Turnovers': 'turnovers',
            '3PM': 'threepointsmade'
        };

    const data = selectedStats.find(([id]) => id === playerId);
    const statType = data ? statMap[data[1]] : null;

    const playerData = selectedPlayerData.filter(player => player.id === playerId);

    if (!playerData[0]) playerData.push({ id: playerId, boxscores: [] });
    
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

export default function generateAllGraphData(selectedPlayerData, values, overUnders, selectedStats, selectedRange) {
    const newData = [];

    const rangeMap = {
            'L5': 5,
            'L10': 10,
            'L20': 20,
            'Season': Infinity
        };

    selectedPlayerData.forEach((player) => {
        const playerId = player.id;
        const statValue = values.find(([id]) => id === playerId);
        const overOrUnder = overUnders.find(([id]) => id === playerId);
        const selectedStat = selectedStats.find(([id]) => id === playerId);
        const range = rangeMap[selectedRange];

        if (range && selectedStat && statValue && overOrUnder) {
            const playerData = generatePlayerGraphData(playerId, selectedStats, selectedPlayerData, range);
            newData.push({ playerId, data: playerData, value: Number(statValue[1]), overUnder: overOrUnder[1], selectedStat: selectedStat[1], range: range});
        };
        console.log("genAllGraphData newData:", newData);
    });
    return newData;
};

