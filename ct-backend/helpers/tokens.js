const jwt = require("jsonwebtoken");
const jose = require("jose");
const { TextEncoder } = require("util");
const { SECRET_KEY } = require("../config");

/** return signed JWT from user data. */

async function createToken(user) {
    console.assert(
        user.isAdmin !== undefined,
        "createToken passed user without isAdmin property"
    );

    let payload = {
        username: user.username,
        isAdmin: user.isAdmin || false,
    };
    const joseToken = await new jose.SignJWT({
        username: user.username,
        isAdmin: user.isAdmin || false,
    })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .sign(Buffer.from(SECRET_KEY));

    console.log("joseToken in createToken:", joseToken);
    // const jwtToken = jwt.sign(payload, SECRET_KEY);
    return joseToken;
}

module.exports = { createToken };
