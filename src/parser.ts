const postcss = require('postcss');

export function parse(text: string) {
  return postcss.parse(text);
}
