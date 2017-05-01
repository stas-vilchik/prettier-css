import { parse } from './parser';
import { print } from './printer';

export function format(text: string) {
  const tree = parse(text);
  return print(tree);
}