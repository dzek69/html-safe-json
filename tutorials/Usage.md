This library exposes a single function - `stringify` - which is identical to native JSON.stringify. Returned value can
be safely injected into HTML's `<script>` tag.

```typescript
import { stringify } from "html-safe-json";

const badData = {
  a: "</script><script>alert(1)</script>",
};

// Express.js or any other node.js server endpoint handler
const endpoint = (req, res) => {
    const html = `<html><body>
<script>window.data = ${stringify(badData)};</script>
<!-- init your scripts here -->
</body></html>`;

    res.send(html);
};
```

With this library your code is safe from XSS attacks and syntax errors in older browsers.
