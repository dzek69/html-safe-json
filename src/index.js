/**
 * JSON.stringify wrapper. Some characters or substrings of stringify result are unicode-encoded to make result safe for
 * embedding into HTML (including CDATA strings).
 * In short, it should encode these:
 * - <script
 * - </script
 * - ]]>
 * - \u2028
 * - \u2029
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
 * @see https://mathiasbynens.be/notes/etago#recommendations
 * @see https://github.com/OWASP/json-sanitizer
 * @see https://v8.dev/features/subsume-json
 * @param {*} source - The value to convert to a JSON string.
 * @param {function} [replacer] - A function that alters the behavior of the stringification process, or an array
 * of String and Number objects that serve as a whitelist for selecting/filtering the properties of the value object to
 * be included in the JSON string. If this value is null or not provided, all properties of the object are included in
 * the resulting JSON string.
 * @param {string|number} [space] - A String or Number object that's used to insert white space into the output JSON
 * string for readability purposes. If this is a Number, it indicates the number of space characters to use as white
 * space; this number is capped at 10 (if it is greater, the value is just 10). Values less than 1 indicate that no
 * space should be used. If this is a String, the string (or the first 10 characters of the string, if it's longer than
 * that) is used as white space. If this parameter is not provided (or is null), no white space is used.
 * @example
 * stringify({ comment: "xss, here i come</script><script>alert(69)</script>" });
 * // {"comment":"xss, here i come<\u002fscript><script>alert(69)<\u002fscript>"}
 * @returns {void|string} - A JSON string representing the given value or undefined if non-convertable value is passed.
 */
const stringify = (source, replacer, space) => {
    const result = JSON.stringify(source, replacer, space);
    if (typeof result !== "string") {
        return result;
    }
    return result
        .replace(/<(\/?)(script)/gi, "\\u003c$1$2") // $1 here is to preserve case of the tag name
        .replace(/]]>/g, "]]\\u003e")
        .replace(/\u2028/g, "\\u2028")
        .replace(/\u2029/g, "\\u2029")
        .replace(/-->/g, "--\\u003e");
};

module.exports = stringify;
