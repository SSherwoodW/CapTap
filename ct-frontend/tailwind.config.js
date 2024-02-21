// const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */

module.exports = {
    content: ["./index.html", "./src/**/*.jsx"],
    theme: {
        extend: {
            colors: {
                green: "#4caf50",
                red: "#C21807",
            },
        },
    },
    plugins: [require("@tailwindcss/forms")],
};
