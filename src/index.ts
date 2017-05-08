import { parse } from './parser';
import { print } from './printer';

export function format(text: string, syntax: string = 'css') {
  const tree = parse(text, syntax);
  return print(tree);
}