import * as postcss from 'postcss';
const lessSyntax = require('postcss-less');

export function parse(text: string, syntax: string) {
  const result = syntax === 'less'
    ? postcss().process(text, { syntax: lessSyntax })
    : postcss().process(text);
  return result.root;
}
