const jose = require("jose");
const { SECRET_KEY } = require("../config");

/** return signed JWT from user data. */

async function createToken(user) {
    console.assert(
        user.isAdmin !== undefined,
        "createToken passed user without isAdmin property"
    );

    const joseToken = await new jose.SignJWT({
        username: user.username,
        isAdmin: user.isAdmin || false,
    })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .sign(Buffer.from(SECRET_KEY));

    return joseToken;
}

module.exports = { createToken };
