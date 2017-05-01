"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parser_1 = require("./parser");
const printer_1 = require("./printer");
function format(text) {
    const tree = parser_1.parse(text);
    return printer_1.print(tree);
}
exports.format = format;
//# sourceMappingURL=index.js.map