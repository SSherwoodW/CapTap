import axios from "axios";

// const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";
const BASE_URL = "http://localhost:3001";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class CapTapApi {
    // the token for interactive with the API will be stored here.
    static token;
    // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNjb3R0eWhvdHR5IiwiaXNBZG1pbiI6dHJ1ZSwiaWF0IjoxNzAzMTk2OTg2fQ.wawT2wJ5Wmujle--Ur2L-30HdqUjIwtpxJ1Yg6QLdv0";

    static async request(endpoint, data = {}, method = "get") {
        console.debug("API Call:", endpoint, data, method);
        const url = `${BASE_URL}/${endpoint}`;
        const headers = { Authorization: `Bearer ${CapTapApi.token}` };
        const params = method === "get" ? data : {};

        try {
            return (await axios({ url, method, data, params, headers })).data;
        } catch (err) {
            console.error("API Error:", err.response);
            let message = err.response.data.error.message;
            throw Array.isArray(message) ? message : [message];
        }
    }

    // Individual API routes

    /** Get the current user. */

    static async getCurrentUser(username) {
        let res = await this.request(`users/${username}`);
        return res.user;
    }

    /** Get token for login from username, password. */

    static async login(data) {
        let res = await this.request(`auth/token`, data, "post");
        console.log("captapAPI res.token:", res);
        CapTapApi.token = res.token;
        return res.token;
    }

    /** Signup for site. */

    static async signup(data) {
        let res = await this.request(`auth/register`, data, "post");
        console.log("captapAPI res.token:", res);
        CapTapApi.token = res.token;
        return res.token;
    }

    /** Save user profile page. */

    static async saveProfile(username, data) {
        let res = await this.request(`users/${username}`, data, "patch");
        return res.user;
    }

    /** Get teams (filtered by name if not undefined) */

    static async getTeams(name) {
        let res = await this.request("teams", { name });
        return res.teams;
    }

    /** Get details on a team by code. */

    static async getTeam(code) {
        let res = await this.request(`teams/${code}`);
        return res.team;
    }

    /** Get team code by team name */

    static async findTeam(name) {
        let res = await this.request(`teams/${name}`);
        return res.team;
    }

    /** Get list of players (filtered by name if not undefined) */

    static async getPlayers(full_name) {
        let res = await this.request("players", { full_name });
        console.log(res);
        return res.players;
    }

    /** Get details and game log on a player. */

    static async getPlayer(id) {
        let res = await this.request(`players/${id}`);
        res.player["id"] = id;
        return res.player;
    }

    /** Save new Journal entry to database. */

    static async saveJournalEntry(username, data) {
        console.log("saveJournalentry captapapi:", data);
        let res = await this.request(`journal/${username}`, data, "post");
        return res.entry;
    }

    /** Get a user's journal entries */

    static async getJournalEntries(username) {
        let res = await this.request(`journal/${username}`);
        console.log("CTAPI getJournalEntries", res);
        return res.entries;
    }
}

export default CapTapApi;
