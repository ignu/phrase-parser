import R from 'ramda'

const puncutationRegex = /\./

const MIN_LENGTH = 3
const MAX_LENGTH = 10



class PhraseCollection {
  constructor() {
    this.phrases = []
  }

  checkPhrase(words) {
    const phrase = words.join(' ')
    const phraseMatches = R.find(R.propEq('phrase', phrase))
    const match = phraseMatches(this.phrases)
    console.log("match", match)
    if(match) {
      match.count = match.count + 1
      return true
    } else {
      this.phrases.push({phrase, count: 1})
      return false
    }
  }

  topPhrases() {
    const duplicates = R.filter(p => p.count > 1)(this.phrases)
    const sorted = R.sort(R.prop('count'))(duplicates)
    return R.take(10)(sorted)
  }

  add(sentence) {
    const phraseLength = R.clamp(MIN_LENGTH, MAX_LENGTH)

    const parse = (remaining) => {
      let phrase = R.take(MAX_LENGTH)(remaining)

      while(phrase.length >= MIN_LENGTH) {
        // return once the longest possible
        // phrase is found in a match
        if(this.checkPhrase(phrase)) {
          console.log("returning .... phrase", phrase)
          return;
        }
        phrase.pop()
      }

      if (remaining.length > MIN_LENGTH) {
        parse(R.tail(remaining))
      }
    }

    parse.bind(this)

    const words = sentence.split(" ")

    parse(words)
    console.log("this.phrases", this.phrases)
  }

  get top() {

  }
}

class Parser {
  constructor(body) {
    let collection = new PhraseCollection
    this.sentences = body.toLowerCase().split(puncutationRegex)
    this.sentences.forEach(collection.add.bind(collection))
    this.phrases = collection.topPhrases()
  }
}

export default Parser
