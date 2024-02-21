/** Gets averages from a player's boxscores
 * 
 * Filters out games where player did not play. 
 *  
 * Returns Object with major statistical averages in all games/numGames.
 */

function convertToMinutes(timeString) {
    const minutes = Number(timeString.split(':')[0]);
    return minutes;
}

function getAverages(boxscores) {
    if (boxscores.length === 0) {
        return null;
    };

    // filter out boxscores where the player did not play

    let totalMinutes = 0;
    let totalPoints = 0;
    let totalRebounds = 0;
    let totalAssists = 0;
    let totalTurnovers = 0;
    let totalSteals = 0;
    let totalBlocks = 0;
    let totalThreesMade = 0;
    let totalGames = 0;

    for (const boxscore of boxscores) {
        const minutes = convertToMinutes(boxscore.minutes);
        if (minutes > 0) {
            totalGames++;
            totalMinutes += minutes;
            totalPoints += boxscore.points;
            totalRebounds += boxscore.rebounds;
            totalAssists += boxscore.assists;
            totalSteals += boxscore.steals;
            totalBlocks += boxscore.blocks;
            totalTurnovers += boxscore.turnovers;
            totalThreesMade += boxscore.threepointsmade;
        }
    };

     // Calculate averages
    const averageMinutes = (totalMinutes / totalGames).toFixed(1);
    const averagePoints = (totalPoints / totalGames).toFixed(1);
    const averageAssists = (totalAssists / totalGames).toFixed(1);
    const averageRebounds = (totalRebounds / totalGames).toFixed(1);
    const averageTurnovers = (totalTurnovers / totalGames).toFixed(1);
    const averageSteals = (totalSteals / totalGames).toFixed(1);
    const averageBlocks = (totalBlocks / totalGames).toFixed(1);
    const averageThreePointsMade = (totalThreesMade / totalGames).toFixed(1);

    return {
        averageMinutes,
        averagePoints,
        averageAssists,
        averageRebounds,
        averageTurnovers,
        averageSteals,
        averageBlocks,
        averageThreePointsMade,
    };
}

export default getAverages;