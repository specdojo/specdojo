"use strict";

// tsx の CJS フックを登録して .ts ファイルを require 可能にする
require("tsx/cjs");
module.exports = require("./remark-no-unescaped-angle-placeholder.ts").default;
