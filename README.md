# html-safe-json

Small wrapper for JSON-stringify that makes result safe to embed directly into HTML `<script>` tag.

## Links worth reading to understand the issue

- [Subsume JSON a.k.a. JSON ⊂ ECMAScript][3]  
- [The end-tag open (ETAGO) delimiter][4]
- [OWASP/json-sanitizer - GitHub][5]


## So what exactly does `html-safe-json` do:

It follows the API of JSON.stringify, uses JSON.stringify internally but on the result it makes some changes - it
encodes 6 strings into unicode representation to prevent possible XSS attacks or syntax errors in older browsers.

These strings are:
 - `<script`
 - `</script`
 - `]]>`
 - `-->`
 - `\u2028`
 - `\u2029`

## Usage

### API

Function API is identical to native [JSON.stringify][1].
It accepts `value`, `replacer` and `space` arguments and returns stringified result.

### Real-world example
Usually you probably will use this library like that:

```javascript
const stringify = require("html-safe-json");

const badData = {
    a: "</script><script>alert(1)</script>",
};

const endpoint = (req, res) => {
    const html = `<html><body>
<script>window.data = ${stringify(badData)};</script>
<!-- init your scripts here --> 
</body></html>`;
    res.send(html);
};
```

## Demos

If you want to see a difference between `html-safe-json` and bare `JSON.stringify` in action you can clone repository of
this project, install dependencies and run `npm run dev` script. Then open `127.0.0.1:1337` in your browser for demos. 

## Bonus knowledge / other solutions

Next.js uses (as of v2) [htmlescape][2] library to secure data before embedding into HTML. It's more aggressive and
encodes every `<` and `>` characters thus automatically resolves most of the issues. This library saves both output
bytes and processing power (it's faster by ~25%) by replacing only what is needed.

Benchmark run steps:
- install deps
- `cd benchmark`
- `node benchmark`

> html-safe-json is faster by 346 ms (1196ms vs 1542ms in total) difference: 25 %

Benchmark currently stringifies a string, this is partially intentional - comparing actual converting object to string
is useless, because both librarires uses `JSON.stringify` anyway and what's matter is how fast encoding is done.

## License

MIT

[1]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
[2]: https://github.com/zertosh/htmlescape
[3]: https://v8.dev/features/subsume-json
[4]: https://mathiasbynens.be/notes/etago#recommendations
[5]: https://github.com/OWASP/json-sanitizer
