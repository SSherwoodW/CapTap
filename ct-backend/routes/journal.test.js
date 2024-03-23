const request = require("supertest");
const app = require("../app");
const { createToken } = require("../helpers/tokens");
const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
let u1Token;
let u2Token;
let admin1Token;
beforeAll(async function createTokens() {
    let userToken = await createToken({ username: "user1", isAdmin: false });
    u1Token = userToken;

    let user2Token = await createToken({ username: "user2", isAdmin: false });
    u2Token = user2Token;

    let adminToken = await createToken({ username: "admin1", isAdmin: true });
    admin1Token = adminToken;
});
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("Journal routes", () => {
    describe("POST /journal/:username", () => {
        test("creates a new journal entry for the specified user", async () => {
            const data = {
                userId: 1,
                description: "Test journal entry",
                range: "L5",
                data: {
                    playerIds: [1, 2],
                    overUnders: [
                        [1, "Over"],
                        [2, "Under"],
                    ],
                    range: "L5",
                    statCats: [
                        [1, "Points"],
                        [2, "Rebounds"],
                    ],
                    values: [
                        [1, 25],
                        [2, 10],
                    ],
                },
            };

            const response = await request(app)
                .post(`/journal/user1`)
                .set("Authorization", `Bearer ${u1Token}`)
                .send(data);
            console.log("response body", response.body);

            expect(response.statusCode).toBe(201);
            expect(response.body.newEntry).toBeDefined();
        });
    });

    describe("GET /journal", () => {
        test("gets all journal entries for admin user", async () => {
            const response = await request(app)
                .get("/journal")
                .set("Authorization", `Bearer ${admin1Token}`);

            expect(response.statusCode).toBe(200);
            expect(response.body.entries).toBeDefined();
            expect(response.body.entries.length).toBeGreaterThan(0);
        });

        test("fails to get all journal entries for non-admin user", async () => {
            const response = await request(app)
                .get("/journal")
                .set("Authorization", `Bearer ${u1Token}`);

            expect(response.statusCode).toBe(401);
        });
    });

    describe("GET /journal/:username", () => {
        test("gets all journal entries for a specific user", async () => {
            const response = await request(app)
                .get("/journal/user1")
                .set("Authorization", `Bearer ${u1Token}`);

            expect(response.statusCode).toBe(200);
            expect(response.body.entries).toBeDefined();
            expect(response.body.entries.length).toBeGreaterThan(0);
        });

        test("fails to get all journal entries for a specific user if not authorized", async () => {
            const response = await request(app)
                .get("/journal/user1")
                .set("Authorization", `Bearer ${u2Token}`);

            expect(response.statusCode).toBe(401);
        });
    });

    describe("GET /journal/:userId/:journalId", () => {
        test("gets a specific journal entry for admin user", async () => {
            // Assuming there's a journal entry with ID 1 for user with ID 1
            const response = await request(app)
                .get("/journal/1/1")
                .set("Authorization", `Bearer ${admin1Token}`);

            expect(response.statusCode).toBe(200);
            expect(response.body.entry).toBeDefined();
        });

        test("fails to get a specific journal entry for non-admin user", async () => {
            // Assuming there's a journal entry with ID 1 for user with ID 1
            const response = await request(app)
                .get("/journal/1/1")
                .set("Authorization", `Bearer ${u1Token}`);

            expect(response.statusCode).toBe(401);
        });
    });

    describe("PATCH /journal/:journalId/:userId", () => {
        test("updates a specific journal entry for admin user", async () => {
            const data = {
                description: "Updated journal entry",
            };

            const response = await request(app)
                .patch("/journal/1/1")
                .set("Authorization", `Bearer ${admin1Token}`)
                .send(data);

            expect(response.statusCode).toBe(200);
            expect(response.body.entry).toBeDefined();
        });

        test("fails to update a specific journal entry for non-admin user", async () => {
            // Assuming there's a journal entry with ID 1 for user with ID 1
            const data = {
                description: "Updated journal entry",
            };

            const response = await request(app)
                .patch("/journal/1/1")
                .set("Authorization", `Bearer ${u1Token}`)
                .send(data);

            expect(response.statusCode).toBe(401);
        });
    });
});
