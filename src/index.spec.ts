import { stringify } from "./index.js";

describe("html-safe-json", () => {
    it("should encode basic data that decodes to same value", () => {
        const basic = { a: 5, b: null, c: "yes" };
        const encoded = stringify(basic);
        encoded.must.be.a.string();
        JSON.parse(encoded).must.eql(basic);
    });

    it("should skip values that can't be encoded", () => {
        const basic = { a: 5, b: undefined, c: () => {} };
        const encoded = stringify(basic);
        JSON.parse(encoded).must.eql({ a: 5 });
    });

    describe("should encode closing script tag", () => {
        it("in property value", () => {
            const basic = { a: "</script>xss?" };
            const JSONencoded = JSON.stringify(basic);
            const encoded = stringify(basic);
            JSONencoded.must.contain("</script>");
            encoded.must.not.contain("</script>");
            JSON.parse(encoded).must.eql(basic);
        });

        it("in property name", () => {
            const basic = { "</script>xss?": "a" };
            const JSONencoded = JSON.stringify(basic);
            const encoded = stringify(basic);
            JSONencoded.must.contain("</script>");
            encoded.must.not.contain("</script>");
            JSON.parse(encoded).must.eql(basic);
        });

        it("from direct string value", () => {
            const basic = "</script>xss?";
            const JSONencoded = JSON.stringify(basic);
            const encoded = stringify(basic);
            JSONencoded.must.contain("</script>");
            encoded.must.not.contain("</script>");
            JSON.parse(encoded).must.eql(basic);
        });

        it("with mixed case", () => {
            const basic = "</sCrIpT>xss?";
            const JSONencoded = JSON.stringify(basic);
            const encoded = stringify(basic);
            JSONencoded.must.contain("</sCrIpT>");
            encoded.must.not.contain("</sCrIpT>");
            JSON.parse(encoded).must.eql(basic);
        });

        it("with extra whitespaces", () => {
            const basic = "</sCrIpT >xss?";
            const JSONencoded = JSON.stringify(basic);
            const encoded = stringify(basic);
            JSONencoded.must.contain("</sCrIpT");
            encoded.must.not.contain("</sCrIpT");
            JSON.parse(encoded).must.eql(basic);
        });
    });

    describe("should encode opening script tag", () => {
        it("in property value", () => {
            const basic = { a: "<script>xss?" };
            const JSONencoded = JSON.stringify(basic);
            const encoded = stringify(basic);
            JSONencoded.must.contain("<script>");
            encoded.must.not.contain("<script>");
            JSON.parse(encoded).must.eql(basic);
        });

        it("in property name", () => {
            const basic = { "<script>xss?": "a" };
            const JSONencoded = JSON.stringify(basic);
            const encoded = stringify(basic);
            JSONencoded.must.contain("<script>");
            encoded.must.not.contain("<script>");
            JSON.parse(encoded).must.eql(basic);
        });

        it("from direct string value", () => {
            const basic = "<script>xss?";
            const JSONencoded = JSON.stringify(basic);
            const encoded = stringify(basic);
            JSONencoded.must.contain("<script>");
            encoded.must.not.contain("<script>");
            JSON.parse(encoded).must.eql(basic);
        });

        it("with mixed case", () => {
            const basic = "<sCrIpT>xss?";
            const JSONencoded = JSON.stringify(basic);
            const encoded = stringify(basic);
            JSONencoded.must.contain("<sCrIpT>");
            encoded.must.not.contain("<sCrIpT>");
            JSON.parse(encoded).must.eql(basic);
        });

        it("with extra whitespaces", () => {
            const basic = "<sCrIpT >xss?";
            const JSONencoded = JSON.stringify(basic);
            const encoded = stringify(basic);
            JSONencoded.must.contain("<sCrIpT");
            encoded.must.not.contain("<sCrIpT");
            JSON.parse(encoded).must.eql(basic);
        });

        it("with extra tags", () => {
            const basic = "<sCrIpT type='application/ecmascript'>xss?";
            const JSONencoded = JSON.stringify(basic);
            const encoded = stringify(basic);
            JSONencoded.must.contain("<sCrIpT");
            encoded.must.contain("sCrIpT");
            encoded.must.not.contain("<sCrIpT");
            JSON.parse(encoded).must.eql(basic);
        });
    });

    describe("should encode closing CDATA tag", () => {
        it("in property value", () => {
            const basic = { a: "xss? ]]> xss?" };
            const JSONencoded = JSON.stringify(basic);
            const encoded = stringify(basic);
            JSONencoded.must.contain("]]>");
            encoded.must.not.contain("]]>");
            JSON.parse(encoded).must.eql(basic);
        });

        it("in property name", () => {
            const basic = { "xss? ]]> xss?": "a" };
            const JSONencoded = JSON.stringify(basic);
            const encoded = stringify(basic);
            JSONencoded.must.contain("]]>");
            encoded.must.not.contain("]]>");
            JSON.parse(encoded).must.eql(basic);
        });

        it("from direct string value", () => {
            const basic = "xss? ]]> xss?";
            const JSONencoded = JSON.stringify(basic);
            const encoded = stringify(basic);
            JSONencoded.must.contain("]]>");
            encoded.must.not.contain("]]>");
            JSON.parse(encoded).must.eql(basic);
        });
    });

    describe("should encode html closing tag", () => {
        it("in property value", () => {
            const basic = { a: "xss --> xss" };
            const JSONencoded = JSON.stringify(basic);
            const encoded = stringify(basic);
            JSONencoded.must.contain("-->");
            encoded.must.not.contain("-->");
            JSON.parse(encoded).must.eql(basic);
        });

        it("in property name", () => {
            const basic = { "xss --> xss": "a" };
            const JSONencoded = JSON.stringify(basic);
            const encoded = stringify(basic);
            JSONencoded.must.contain("-->");
            encoded.must.not.contain("-->");
            JSON.parse(encoded).must.eql(basic);
        });

        it("from direct string value", () => {
            const basic = "xss --> xss";
            const JSONencoded = JSON.stringify(basic);
            const encoded = stringify(basic);
            JSONencoded.must.contain("-->");
            encoded.must.not.contain("-->");
            JSON.parse(encoded).must.eql(basic);
        });
    });

    it("encodes values when using replacer function", () => {
        const basic = { a: "value", b: 5 };
        const encoded = stringify(basic, (key, value) => {
            if (!key) {
                return value as unknown;
            }
            return "<script>xss</script>";
        });
        encoded.must.not.contain("<script>");
        encoded.must.not.contain("</script>");
        JSON.parse(encoded).must.eql({
            a: "<script>xss</script>",
            b: "<script>xss</script>",
        });
    });

    it("encodes values when using toJSON property", () => {
        const a = { xxx: 666, toJSON: () => "<script>xss</script>" };
        const encoded = stringify(a);
        encoded.must.be.a.string();
        encoded.must.not.contain("<script>");
        encoded.must.not.contain("</script>");
        JSON.parse(encoded).must.equal("<script>xss</script>");
    });

    it("encodes mixed strings with repeating bad string in big object", () => {
        const data = {
            "xxx": "xss?</script><b>--></script>hello xss</b>",
            "<script>alert(5);--></script>": {
                "cdata ]]> end": "this is ]]> deep",
            },

        };
        const encoded = stringify(data);
        encoded.must.not.contain("</script");
        encoded.must.not.contain("<script");
        encoded.must.not.contain("]]>");
        encoded.must.not.contain("-->");
    });

    it("encodes U+2028 LINE SEPARATOR and U+2029 PARAGRAPH SEPARATOR", () => {
        const data = {
            a: "bad\u2028\u2029bad",
        };
        const encoded = stringify(data);
        const JSONencoded = JSON.stringify(data);

        encoded.must.not.equal(JSONencoded);
        encoded.length.must.be.gt(JSONencoded.length);

        JSON.parse(encoded).must.eql(data);
        JSON.parse(JSONencoded).must.eql(data);

        JSON.parse(encoded).a.length.must.be(8);
        JSON.parse(JSONencoded).a.length.must.be(8);
    });

    it("returns undefined when given something that cannot be JSON stringified", () => {
        const encodedFn = stringify(() => null);
        must(encodedFn).be.undefined();

        const encodedUndefined = stringify(undefined);
        must(encodedUndefined).be.undefined();

        const encodedSymbol = stringify(Symbol("a"));
        must(encodedSymbol).be.undefined();
    });
});
