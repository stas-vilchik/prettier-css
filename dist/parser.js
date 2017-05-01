"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const postcss = require('postcss');
function parse(text) {
    return postcss.parse(text);
}
exports.parse = parse;
//# sourceMappingURL=parser.js.map