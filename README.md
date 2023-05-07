# html-safe-json

Secure JSON.stringify for injecting into HTML's <script> tag.

- 📦 No dependencies - use it anywhere
- 🚀 Fast - ~36% faster than htmlescape
- 🛡️ Secure - fully tested and used in production

## Links worth reading to understand the issue

- [Subsume JSON a.k.a. JSON ⊂ ECMAScript][3]
- [The end-tag open (ETAGO) delimiter][4]
- [OWASP/json-sanitizer - GitHub][5]

## What exactly does `html-safe-json` do:

It wraps JSON.stringify, exposing the same API to you but on the result it does some changes - it encodes 6 strings into
unicode representation to prevent possible XSS attacks (or syntax errors in older browsers).

These strings are:
- `<script`
- `</script`
- `]]>`
- `-->`
- `\u2028`
- `\u2029`

## Usage

### Documentation

You can find documentation here: https://ezez.dev/docs/html-safe-json/latest

### API

Function API is identical to native [JSON.stringify][1].
It accepts `value`, `replacer` and `space` arguments and returns stringified result.

### Real-world example
Usually you probably will use this library like that:

```javascript
import { stringify } from "html-safe-json"; // or require

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
this project, install dependencies and run `yarn start:dev` script.

Then open `127.0.0.1:1337` in your browser for demos.

Alert message is expected - it demonstrates that JSON.stringify is unsafe, while `html-safe-json` is safe.

## Bonus knowledge / other solutions

Next.js uses (as of v2) [htmlescape][2] library to secure data before embedding into HTML. It's more aggressive and
encodes every `<` and `>` characters thus automatically resolves most of the issues. `html-safe-json` saves both output
bytes and processing power (it's faster by ~36%) by replacing only what is needed.

Benchmark run steps:
- install deps
- `yarn start:benchmark`

> html-safe-json is faster by 277 ms (586ms vs 863ms in total) difference: 38 %

Benchmark currently stringifies a string, this is intentional - comparing converting object to string is useless,
because both libs uses `JSON.stringify`. What matters is how fast escaping is done.

## License

MIT

[1]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
[2]: https://github.com/zertosh/htmlescape
[3]: https://v8.dev/features/subsume-json
[4]: https://mathiasbynens.be/notes/etago#recommendations
[5]: https://github.com/OWASP/json-sanitizer
