const request = require("supertest");
const app = require("./app");
const db = require("./db");

describe("Error Handling Middleware", () => {
    test("not found for site 404", async () => {
        const response = await request(app).get("/nonexistent-route");
        expect(response.statusCode).toBe(404);
    });

    test("not found for site 404 (test stack print)", async function () {
        process.env.NODE_ENV = "";
        const resp = await request(app).get("/no-such-path");
        expect(resp.statusCode).toEqual(404);
        delete process.env.NODE_ENV;
    });
});

afterAll(function () {
    db.end();
});
