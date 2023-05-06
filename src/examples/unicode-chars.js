/* eslint-disable */
import { stringify } from "../index.js";

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

Check out window.value and window.safeValue in older browser (ie: Internet Explorer 11)
</body>`;
    res.send(html);
};

export default endpoint;
