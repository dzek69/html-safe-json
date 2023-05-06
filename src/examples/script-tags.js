/* eslint-disable */
import stringify from "../index.js";

const bad = {
    a: "</script><script>alert(1)</script>",
};

const endpoint = (req, res) => {
    const html = `<html>
<body>
<script>window.safeValue = ${stringify(bad)};</script>
<script>window.value = ${JSON.stringify(bad)};</script>

Check out window.value and window.safeValue in the console.
</body>`;
    res.send(html);
};

export default endpoint;
