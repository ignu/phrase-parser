import test from "ava";
import Parser from "./index";
import fs from "fs";

test("returns no phrases when nothing is repeated", t => {
  const parser = new Parser("Hello and how are you today?");
  t.is(parser.topPhrases().length, 0);
});

test("returns two simple phrases", t => {
  const parser = new Parser(
    "May The Force Be With You Luke Said. And May The Force Be With you."
  );
  t.is(parser.topPhrases().length, 1);
  t.is(parser.topPhrases()[0].phrase, "may the force be with you");
});

test("can parse 12 days of christmas", t => {
  const twelveDays = fs.readFileSync("./data/twelve-days.txt").toString();

  const parser = new Parser(twelveDays);
  t.is(parser.topPhrases()[1].phrase, "partridge in a pear tree");
  t.is(parser.topPhrases()[1].count, 12);
  t.is(parser.topPhrases().length, 10);
});

test("can parse multiple phrases per sentence", t => {
  const phrase = `he was laughing
a card was up his sleeve
he was laughing up his sleeve`;

  const parser = new Parser(phrase);
  t.is(parser.topPhrases()[0].phrase, "he was laughing");
  t.is(parser.topPhrases()[1].phrase, "up his sleeve");
});
