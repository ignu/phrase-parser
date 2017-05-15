import R from 'ramda'

const puncutationRegex = /[\.\n]/

const MIN_LENGTH = 3
const MAX_LENGTH = 10

class PhraseCollection {
  constructor() {
    this.phrases = []
  }

  checkPhrase(words) {
    if(this.invalidBookend(words)) {
      return false
    }

    const phrase = words.join(' ')
    const phraseMatches = R.find(R.propEq('phrase', phrase))
    const match = phraseMatches(this.phrases)

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
    const sorted = R.sortWith([R.descend(R.prop('count'))])(duplicates)
    return R.take(10, sorted)
  }


  invalidBookend(phrase) {
    const regex = /^(and|or|a|the)$/
    return R.head(phrase).match(regex) || R.last(phrase).match(regex)
  }

  add(sentence) {
    sentence = sentence.trim()
    const phraseLength = R.clamp(MIN_LENGTH, MAX_LENGTH)

    const parse = (remaining) => {
      let phrase = R.take(MAX_LENGTH)(remaining)

      while(phrase.length >= MIN_LENGTH) {
        // return once the longest possible
        // phrase is found in a match
        if(this.checkPhrase(phrase)) {
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
