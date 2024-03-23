const jose = require("jose");
const { createToken } = require("./tokens");
const { SECRET_KEY } = require("../config");

describe("createToken", function () {
    test("works: not admin", async function () {
        const user = { username: "test", is_admin: false };
        const token = await createToken(user);
        console.log(token);
        const payload = await jose.jwtVerify(token, Buffer.from(SECRET_KEY));
        expect(payload.payload).toEqual({
            iat: expect.any(Number),
            username: "test",
            isAdmin: false,
        });
    });

    test("works: admin", async function () {
        const user = { username: "test", isAdmin: true };
        const token = await createToken(user);
        const payload = await jose.jwtVerify(token, Buffer.from(SECRET_KEY));
        expect(payload.payload).toEqual({
            iat: expect.any(Number),
            username: "test",
            isAdmin: true,
        });
    });

    test("works: default no admin", async function () {
        // given the security risk if this didn't work, checking this specifically
        const user = { username: "test" };
        const token = await createToken(user);
        const payload = await jose.jwtVerify(token, Buffer.from(SECRET_KEY));
        expect(payload.payload).toEqual({
            iat: expect.any(Number),
            username: "test",
            isAdmin: false,
        });
    });
});
