const request = require("supertest");

const schedule = require("node-schedule");
jest.useFakeTimers();

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

describe("POST /users", () => {
    test("works for admin", async () => {
        console.log(admin1Token);
        const response = await request(app)
            .post("/users")
            .send({
                username: "new",
                password: "password",
                firstName: "Test",
                lastName: "User",
                email: "new@test.com",
                birthdate: "1990-01-01",
                isAdmin: false,
            })
            .set("authorization", `Bearer ${admin1Token}`);
        expect(response.statusCode).toEqual(201);
        expect(response.body).toEqual({
            token: expect.any(String),
            user: {
                username: "new",
                firstName: "Test",
                lastName: "User",
                email: "new@test.com",
                isAdmin: false,
            },
        });
    });

    test("unauth for non-admin", async () => {
        const response = await request(app)
            .post("/users")
            .send({
                username: "new",
                password: "password",
                firstName: "Test",
                lastName: "User",
                email: "new@test.com",
                birthdate: "1990-01-01",
                isAdmin: false,
            })
            .set("authorization", `Bearer ${u1Token}`);
        expect(response.statusCode).toEqual(401);
    });

    test("bad request with missing data", async () => {
        const response = await request(app)
            .post("/users")
            .send({
                username: "new",
                password: "password",
                firstName: "Test",
                email: "new@test.com",
                birthdate: "1990-01-01",
                isAdmin: false,
            })
            .set("authorization", `Bearer ${admin1Token}`);
        expect(response.statusCode).toEqual(400);
    });
});

describe("GET /users", () => {
    test("works for admin", async () => {
        const response = await request(app)
            .get("/users")
            .set("authorization", `Bearer ${admin1Token}`);
        expect(response.statusCode).toEqual(200);
        expect(response.body.users).toHaveLength(3);
    });

    test("unauth for non-admin", async () => {
        const response = await request(app)
            .get("/users")
            .set("authorization", `Bearer ${u1Token}`);
        expect(response.statusCode).toEqual(401);
    });
});

describe("GET /users/:username", () => {
    test("works for admin", async () => {
        const response = await request(app)
            .get("/users/user1")
            .set("authorization", `Bearer ${admin1Token}`);
        expect(response.statusCode).toEqual(200);
        expect(response.body.user.username).toEqual("user1");
    });

    test("works for same user", async () => {
        const response = await request(app)
            .get("/users/user1")
            .set("authorization", `Bearer ${u1Token}`);
        expect(response.statusCode).toEqual(200);
        expect(response.body.user.username).toEqual("user1");
    });

    test("unauth for different user", async () => {
        const response = await request(app)
            .get("/users/user1")
            .set("authorization", `Bearer ${u2Token}`);
        expect(response.statusCode).toEqual(401);
    });
});

describe("PATCH /users/:username", () => {
    test("works for admin", async () => {
        const response = await request(app)
            .patch("/users/user1")
            .send({
                firstName: "NewName",
            })
            .set("authorization", `Bearer ${admin1Token}`);
        expect(response.statusCode).toEqual(200);
        expect(response.body.user.firstName).toEqual("NewName");
    });

    test("works for same user", async () => {
        const response = await request(app)
            .patch("/users/user1")
            .send({
                firstName: "NewName",
            })
            .set("authorization", `Bearer ${u1Token}`);
        expect(response.statusCode).toEqual(200);
        expect(response.body.user.firstName).toEqual("NewName");
    });

    test("unauth for different user", async () => {
        const response = await request(app)
            .patch("/users/user1")
            .send({
                firstName: "NewName",
            })
            .set("authorization", `Bearer ${u2Token}`);
        expect(response.statusCode).toEqual(401);
    });
});
