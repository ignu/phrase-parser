import R from "ramda";

const MIN_LENGTH = 3;
const MAX_LENGTH = 10;
const TOP_PHRASE_COUNT = 10;

const puncutationRegex = /[\.\n]/;

class Parser {
  constructor(body) {
    this.phrases = [];
    const sentences = body.toLowerCase().split(puncutationRegex);
    sentences.forEach(this.parse.bind(this));
  }

  recordPhrase(words) {
    if (this.invalidBookend(words)) {
      return null;
    }

    const phrase = words.join(" ");
    const existingPhrase = R.propEq("phrase", phrase);
    const existing = R.find(existingPhrase)(this.phrases);

    if (existing) {
      existing.count++;
      return existing.phrase;
    } else {
      this.phrases.push({ phrase, count: 1 });
    }
  }

  topPhrases() {
    const repeats = R.filter(p => p.count > 1)(this.phrases);
    const sorted = R.sortWith([R.descend(R.prop("count"))])(repeats);
    return R.take(TOP_PHRASE_COUNT, sorted);
  }

  invalidBookend(phrase) {
    const regex = /^(and|or|a|the)$/;
    return R.head(phrase).match(regex) || R.last(phrase).match(regex);
  }

  parse(sentence) {
    sentence = sentence.trim();
    const words = sentence.split(" ");

    const parse = remaining => {
      let phrase = R.take(MAX_LENGTH)(remaining);

      while (phrase.length >= MIN_LENGTH) {
        if (this.recordPhrase(phrase)) {
          const tail = R.drop(phrase.length)(remaining);
          return tail.length >= MIN_LENGTH ? parse(tail) : null;
        }
        phrase.pop();
      }

      if (remaining.length > MIN_LENGTH) {
        parse(R.tail(remaining));
      }
    };

    parse.bind(this);

    parse(words);
  }
}

export default Parser;
