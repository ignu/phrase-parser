import test from 'ava';
import Parser from './index'

test('foo', t => {
  const parser = new Parser
  t.is(parser.phrases.length, 0)
});
