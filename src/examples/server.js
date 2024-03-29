import express from "express";

import unicodeChars from "./unicode-chars.js";
import scriptTags from "./script-tags.js";

const app = express();

const PORT = 1337;

const list = {
    "unicode-chars": {
        name: "Unicode chars",
        endpoint: unicodeChars,
    },
    "script-tags": {
        name: "Script tags",
        endpoint: scriptTags,
    },
};

app.get("/", (req, res) => {
    const html = Object.entries(list).map(([link, { name }]) => {
        return `<li><a href="/${link}">${name}</a>`; // this is perfect example of ugly xss, I know :)
    }).join("");
    res.send(html);
});

Object.entries(list).forEach(([link, { endpoint }]) => {
    app.get("/" + link, endpoint);
});

app.listen(PORT);
