import { readFileSync, writeFileSync } from 'fs';
import { extname } from 'path';
import { sync } from 'glob';
import { format } from './index';

const filePatterns = process.argv[2];

sync(filePatterns).forEach((filename: string) => {
  let text;
  let extension;

  try {
    text = readFileSync(filename, 'utf-8');
    extension = extname(filename);
  } catch (error) {
    console.error(`Unable to read file: "${filename}":\n${error}`);
    process.exitCode = 2;
    return;
  }

  let formatted: string;
  try {
    formatted = format(text, extension.substr(1));
  } catch (error) {
    console.error(`Unable to format file: "${filename}":\n${error}`);
    process.exitCode = 2;
    return;
  }

  try {
    writeFileSync(filename, formatted, 'utf-8');
  } catch (error) {
    console.error(`Unable to write file: "${filename}":\n${error}`);
    process.exitCode = 2;
  }
});