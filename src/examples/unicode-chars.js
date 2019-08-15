const stringify = require("../index");

const bad = {
    a: `\u2028\u2029td`,
};

const endpoint = (req, res) => {
    const html = `<html>
<body>
<script>window.safeValue = ${stringify(bad)};</script>
<script>window.value = ${JSON.stringify(bad)};</script>
<script>console.log({
    "value": window.value,
    "safeValue": window.safeValue,
})</script>

Check out window.value and window.saveValue in older browser (ie: Internet Explorer 11)
</body>`;
    res.send(html);
};

module.exports = endpoint;
