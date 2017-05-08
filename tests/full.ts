import { readFileSync } from 'fs';
import { join } from 'path';
import { format } from '../src/index';

it('selectors', () => {
  const text = readFileSync(join(__dirname, 'selectors.css'), 'utf-8');
  expect(format(text)).toMatchSnapshot();
});

it('rules', () => {
  const text = readFileSync(join(__dirname, 'rules.css'), 'utf-8');
  expect(format(text)).toMatchSnapshot();
});

it('atRules', () => {
  const text = readFileSync(join(__dirname, 'atRules.css'), 'utf-8');
  expect(format(text)).toMatchSnapshot();
});

it('comments', () => {
  const text = readFileSync(join(__dirname, 'comments.css'), 'utf-8');
  expect(format(text)).toMatchSnapshot();
});

it('less', () => {
  const text = readFileSync(join(__dirname, 'variables.less'), 'utf-8');
  expect(format(text, 'less')).toMatchSnapshot();
})