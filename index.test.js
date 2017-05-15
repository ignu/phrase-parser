import test from 'ava';
import Parser from './index'

test('returns no phrases when nothing is repeated', t => {
  const parser = new Parser("Hello and how are you today?")
  t.is(parser.phrases.length, 0)
});

test('returns two simple phrases', t => {
  const parser = new Parser("May The Force Be With You Luke Said. And May The Force Be With you.")
  t.is(parser.phrases.length, 1)
  t.is(parser.phrases[0].phrase, "may the force be with you")
});
