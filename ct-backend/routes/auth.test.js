const schedule = require("node-schedule");
jest.useFakeTimers();
const app = require("../app");
const db = require("../db");
const request = require("supertest");

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("POST /auth/token", () => {
    test("works", async () => {
        const response = await request(app).post("/auth/token").send({
            username: "user1",
            password: "password1",
        });
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual(
            expect.objectContaining({
                token: expect.any(String),
            })
        );
    });
    test("bad request with missing data", async () => {
        const response = await request(app).post("/auth/token").send({
            username: "user1",
        });
        expect(response.statusCode).toEqual(400);
    });
});

describe("POST /auth/register", () => {
    test("works", async () => {
        const response = await request(app).post("/auth/register").send({
            username: "newuser",
            password: "password123",
            firstName: "New",
            lastName: "User",
            email: "newuser@example.com",
            birthdate: "1990-01-01",
        });
        expect(response.statusCode).toEqual(201);
        expect(response.body).toEqual(
            expect.objectContaining({
                token: expect.any(String),
            })
        );
    });

    test("bad request with missing data", async () => {
        const response = await request(app).post("/auth/register").send({
            username: "newuser",
        });

        expect(response.statusCode).toEqual(400);
    });
});
