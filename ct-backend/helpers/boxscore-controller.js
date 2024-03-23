const axios = require("axios");
const db = require("../db");

const Boxscore = require("../models/boxscore");

const { parseBoxScoreData } = require("./api");

const API_KEY = require("../secret/secret");

const phxId = "583ecfa8-fb46-11e1-82cb-f4ce4684ea4c";

/**
 *
 * @returns error message or successful dbInsertion message.
 */

const updateDailyBoxscores = async () => {
    try {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const yesterdayGames = await db.query(
            `SELECT api_id FROM games
            WHERE game_date::date = $1
            AND (team_1_id = $2 OR team_2_id = $2)`,
            [yesterday, phxId]
        );
        console.log("yesterday", yesterday);

        if (yesterdayGames.rows < 1) {
            console.log("no games played yesterday");
            return "no games played yesterday";
        }

        const gameIds = yesterdayGames.rows.map((game) => game.api_id);
        const boxScorePromises = gameIds.map((gameId) =>
            axios.get(
                `http://api.sportradar.us/nba/trial/v8/en/games/${gameId}/summary.json?api_key=${API_KEY}`
            )
        );

        const boxScores = await Promise.all(boxScorePromises);

        const boxScoreData = boxScores.map((boxScore, index) => {
            const phxBoxScore =
                boxScore.data.away.id === phxId
                    ? boxScore.data.away.players
                    : boxScore.data.home.players;

            return {
                gameId: gameIds[index],
                players: phxBoxScore,
            };
        });

        console.log("boxScoreData:", boxScoreData[0].gameId);

        const parsedBoxScoreData = parseBoxScoreData(
            boxScoreData[0].gameId,
            boxScoreData[0]
        );

        const dbInsertion = await Boxscore.addAll(parsedBoxScoreData);
        console.log("dbInsertion:", dbInsertion);

        return dbInsertion;
    } catch (err) {
        console.error("error adding boxscores; error:", err);
        throw err;
    }
};

module.exports = { updateDailyBoxscores };
