import { readFileSync, writeFileSync } from 'fs';
import { sync } from 'glob';
import { format } from './index';

const filePatterns = process.argv[2];

sync(filePatterns).forEach((filename: string) => {
  let text;

  try {
    text = readFileSync(filename, 'utf-8');
  } catch (error) {
    console.error(`Unable to read file: "${filename}":\n${error}`);
    process.exitCode = 2;
  }

  const formatted = format(text);

  try {
    writeFileSync(filename, formatted, 'utf-8');
  } catch (error) {
    console.error(`Unable to write file: "${filename}":\n${error}`);
    process.exitCode = 2;
  }
});