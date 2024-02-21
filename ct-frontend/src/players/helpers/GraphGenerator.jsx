function generatePlayerGraphData(playerId, rangeMap, selectedRange, [selectedStats], selectedPlayerData, ) {

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

function generateAllGraphData(rangeMap, range, playerData, values, overUnders, selectedStats) {
    const newData = [];

    playerData.forEach((player) => {
        const playerId = player.id;
        const statValue = values.find(([id]) => id === playerId);
        const overOrUnder = overUnders.find(([id]) => id === playerId);
        const selectedStat = selectedStats.find(([id]) => id === playerId);
        const selectedRange = rangeMap[range];

        if (selectedRange && selectedStat && statValue && overOrUnder) {
            const playerData = generatePlayerGraphData(playerId, rangeMap);
            newData.push({ playerId, data: playerData, value: Number(statValue[1]), overUnder: overOrUnder[1], selectedStat: selectedStat[1], range: range});
        };
        console.log("genAllGraphData newData:", newData);
    });
    return newData;
};

// export default generatePlayerGraphData;