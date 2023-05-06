/* eslint-disable */
const fs = require("fs");

const htmlescape = require("htmlescape");

const { stringify } = require("../dist");

const html = String(fs.readFileSync("./benchmark/string.txt"));

const REPEAT = 1000;

const slowerOrFaster = diff => {
    if (diff > 0) {
        return "slower";
    }
    return "faster";
};

const relativeDifference = (a, b) => {
    return Math.abs((a - b) / ((a + b) / 2)) * 100;
};

const bench = (repeat) => {
    const startHTML = Date.now();
    for (let i = 0; i < repeat; i++) {
        htmlescape(html);
    }
    const tookHTML = Date.now() - startHTML;

    const startSafe = Date.now();
    for (let i = 0; i < repeat; i++) {
        stringify(html);
    }
    const tookSafe = Date.now() - startSafe;

    const diff = tookSafe - tookHTML;

    return {
        tookSafe,
        tookHTML,
        diff,
    };
};

{
    const { tookSafe, tookHTML, diff } = bench(REPEAT);

    const times = `(${tookSafe}ms vs ${tookHTML}ms in total)`;

    if (!diff) {
        console.info("Both libraries are equally fast/slow :)");
    }
    else {
        console.info(
            "html-safe-json is", slowerOrFaster(diff),
            "by", Math.abs(diff), "ms",
            times,
            "difference:", Math.round(relativeDifference(tookSafe, tookHTML)), "%",
        );
    }
}
