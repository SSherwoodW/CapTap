 // check for null games from all playerData to remove null values from % returns in correlator().
export function nullGameDates(data) {
    let nullDates = [];
    data.map(data => data.data.forEach(game => {
        if (game.y === null) {
            nullDates.push(game.x)
        }
    }
    ));
    return nullDates;
};

// nested array of all players' game dates where they hit their targeted values
export function createHitList(data){
    let hitList = [];
    const allHitGamesArr = data.map(player => {
    const overUnder = player.overUnder;
    const value = player.value;
    const hitGames = player.data
        .filter(game => game.y !== null && (overUnder === "Over" ? game.y >= value : game.y < value))
        .map(game => game.x);
    hitList.push(hitGames);
    });
    return hitList;
};

// determines how often all players in playerData array hit their target values in the same game.
export function calculateCorrelation(arr, data) {
    // map {'date' => # players hit that game, 'date' => # players hit that game, ...}
    const gameCountMap = new Map();
    const nullDates = nullGameDates(data);

    // if player value for a gamedate is not null, add gamedate and/or increment that gamedate value
    arr.forEach(innerArr => {
        innerArr.forEach(game => {
            if (!nullDates.includes(game)) {
                gameCountMap.set(game, (gameCountMap.get(game) || 0) + 1);
            }
        });
    });
    console.log('gameCountMap', gameCountMap);
    console.log('datalenth', data[0].data.length)

    // Gets # of games where **ALL** players hit their target value: 
        // get length of array of gameCountMap values where value = number of players in parlay. 
    const allPlayersHit = Array.from(gameCountMap.values()).filter(numPlayersHit => numPlayersHit === arr.length).length;
    const totalGames = nullDates.length > 0 ? gameCountMap.size : data[0].data.length;

    return Math.round((allPlayersHit / totalGames) * 100);
};

// determines how often a single hit their target value.
export function hitRate(data) {
    const overUnder = data.overUnder;
    const value = data.value;
    const range = data.range;
    const overUnderCount = data.data.filter(game => game.y !== null && (overUnder === "Over" ? game.y >= value : game.y < value)).length;
    const nullCheck = data.data.filter(game => game.y === null);

    const denominator = range === Infinity ? data.data.length : range;

    if (nullCheck.length > 0) {
        return (overUnderCount / (denominator - nullCheck.length)) * 100;
    } else {
        return (overUnderCount / denominator) * 100;
    }
};

// returns object list of oppenents+stat value where player did not hit target value
export function missList(data) {
    const overUnder = data.overUnder;
    return data.data
        .filter(game => {
            if (overUnder === "Over") {
                return game.y !== null && game.y < data.value;
            } else if (overUnder === "Under") {
                return game.y !== null && game.y >= data.value;
            }
        })
        .map(game => ({ opponent: game.opponent, amount: game.y, date: game.x}));
};


export default function calculateStats(playerData) {
    if (!playerData[0]) {
        return "oopsy doopsy!"
    }

    let hitList = createHitList(playerData);

    const correlatorStats = playerData.map(player => ({
        playerId: player.playerId,
        hitRate: hitRate(player),
        missList: missList(player),
    }));
    correlatorStats.push(calculateCorrelation(hitList, playerData));

    return correlatorStats;
};