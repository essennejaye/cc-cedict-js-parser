const db = require('./config/connection');
const Dictionary = require('./models/Dictionary');
const lines = require('n-readlines'); // npm package that is much faster than node fs)

// A JavaScript version of franki allegra's cc-cedict parser
// (https://github.com/rubber-duck-dragon/rubber-duck-dragon.github.io)
// I chose the Creative Commons Chinese-English Dictionary because it contained
// pinyin(romanized spelling for Chinese characters)
//  This program will also remove a surname entry if there is another entry for the character.

let newLine;
let parsedLines = [];
let regexp = /\p{sc=Han}/gu; //used to eliminate any line that doesn't contain Chinese characters

// this dictionary has over 100,000 entries, so I am going to filter out some of them
const linesToSkip = [
  '(Tw)',
  '(slang)',
  '(coll.)',
  'variant',
  'Internet slang',
  'Japanese',
  'Suzhou',
  'radical',
  'idiom',
  'proverb',
  'see',
  'iteration mark',
  'component',
  'archaic',
  'used in',
  '(chemistry)',
];

const liner = new lines('./cedict_ts.u8');

// labeled while loop, if a line meets conditions for skipping, control returns to while loop instead
// of for loop
loop1: while ((newLine = liner.next())) {
  newLine = newLine.toString('utf8');

  if (!newLine || !newLine.match(regexp)) {
    continue;
  }

  for (i = 0; i <= linesToSkip.length; i++) {
    if (newLine.includes(linesToSkip[i])) {
      continue loop1;
    }
  }
  parseLine(newLine);
}
createEntries(removeSurnames(parsedLines));

// remove text formatting and parse each line into an object
function parseLine(newLine) {
  parsed = {};

  //remove any lines that have non Chinese characters at beginning (often slang or colloquial expressions)
  if (!newLine[0].match(regexp)) {
    return;
  }

  newLine = newLine.slice(0, -1);
  let [charAndPinyin, ...translations] = newLine.split('/');
  let [chineseCharacters, ...pinyin] = charAndPinyin.split('[');
  let characters = chineseCharacters.split(' ');
  let traditional = characters[0];
  let simplified = characters[1];
  pinyin = pinyin.join('').slice(0, -2);
  let english = translations.filter((phrase) => phrase);

  parsed['traditional'] = traditional;
  parsed['simplified'] = simplified;
  parsed['pinyin'] = pinyin;
  parsed['english'] = english;
  parsedLines.push(parsed);
}

function removeSurnames(parsedLines) {
  for (j = 0; j < parsedLines.length; j++) {
    if (parsedLines[j]['english'].includes('surname')) {
      if (parsedLines[j]['traditional'] == parsedLines[j + 1]['traditional']) {
        parsedLines.splice(j, 1);
      }
    }
  }
  return parsedLines;
}

function createEntries(parsedLines) {
  db.once('open', async () => {
    await Dictionary.deleteMany({});
    await Dictionary.collection
      .insertMany(parsedLines, { ordered: false })
      .catch((err) => console.log(err));
    console.log('all done');
    process.exit(0);
  });
}
