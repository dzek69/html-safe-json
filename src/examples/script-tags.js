const stringify = require("../index");

const bad = {
    a: "</script><script>alert(1)</script>",
};

const endpoint = (req, res) => {
    const html = `<html>
<body>
<script>window.safeValue = ${stringify(bad)};</script>
<script>window.value = ${JSON.stringify(bad)};</script>

Check out window.value and window.saveValue in the console.
</body>`;
    res.send(html);
};

module.exports = endpoint;
