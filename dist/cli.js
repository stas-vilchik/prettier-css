"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const glob_1 = require("glob");
const index_1 = require("./index");
const filePatterns = process.argv[2];
glob_1.sync(filePatterns).forEach((filename) => {
    let text;
    try {
        text = fs_1.readFileSync(filename, 'utf-8');
    }
    catch (error) {
        console.error(`Unable to read file: "${filename}":\n${error}`);
        process.exitCode = 2;
    }
    const formatted = index_1.format(text);
    try {
        fs_1.writeFileSync(filename, formatted, 'utf-8');
    }
    catch (error) {
        console.error(`Unable to write file: "${filename}":\n${error}`);
        process.exitCode = 2;
    }
});
//# sourceMappingURL=cli.js.map