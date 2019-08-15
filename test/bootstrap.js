"use strict";

require("@babel/polyfill");
require("@babel/register")({
    extends: "./.babelrc",
    ignore: [],
});
const must = require("must/register");

global.must = must;
