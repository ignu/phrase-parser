import test from 'ava';
import Parser from './index'

test('returns no phrases when nothing is repeated', t => {
  const parser = new Parser("Hello and how are you today?")
  t.is(parser.phrases.length, 0)
});
